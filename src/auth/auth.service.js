import { UserRepository } from '../user/user.repository.js';
import { PasswordUtil } from '../utils/password.util.js';
import { JwtUtil } from '../utils/jwt.util.js';
import { UnauthorizedException } from '../exceptions/unauthorized.exception.js';
import { ConflictException } from '../exceptions/conflict.exception.js';
import { ValidationException } from '../exceptions/validation.exception.js';

export class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(dto) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await PasswordUtil.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async register(dto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordValidation = PasswordUtil.validate(dto.password);
    if (!passwordValidation.valid) {
      throw new ValidationException('Password validation failed', passwordValidation.errors);
    }

    const hashedPassword = await PasswordUtil.hash(dto.password);

    const user = await this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    });

    const tokens = this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshToken(refreshToken) {
    try {
      const payload = JwtUtil.verifyRefreshToken(refreshToken);

      const user = await this.userRepository.findById(Number(payload.userId));

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = this.generateTokens(user);

      return {
        user: this.sanitizeUser(user),
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  generateTokens(user) {
    const payload = {
      userId: String(user.id),
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: JwtUtil.generateAccessToken(payload),
      refreshToken: JwtUtil.generateRefreshToken(payload),
    };
  }

  sanitizeUser(user) {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}
