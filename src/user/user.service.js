import { UserRepository } from './user.repository.js';
import { NotFoundException } from '../exceptions/notfound.exception.js';

export class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getById(id) {
    const user = await this.userRepository.findById(Number(id));

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  async getByEmail(email) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  async getAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const users = await this.userRepository.findAll(skip, limit);

    return users.map((user) => this.sanitizeUser(user));
  }

  async update(id, dto) {
    const existingUser = await this.userRepository.findById(Number(id));

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userRepository.update(Number(id), dto);

    return this.sanitizeUser(updatedUser);
  }

  async delete(id) {
    const existingUser = await this.userRepository.findById(Number(id));

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(Number(id));

    return { message: 'User deleted successfully' };
  }

  sanitizeUser(user) {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}
