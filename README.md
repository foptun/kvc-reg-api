# Registration API

REST API สำหรับระบบ Registration พัฒนาด้วย Hono, Prisma, PostgreSQL และ JWT Authentication

## ⚙️ Requirements

- **Node.js**: >= 24.13.1 (LTS)
- **npm**: >= 10.0.0
- **Prisma**: 7.3.0
- **PostgreSQL**: >= 14.0

## 🏗️ โครงสร้างโปรเจกต์

```
reg-api/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/                # Configuration
│   │   ├── env.ts            # Environment validation
│   │   └── database.ts       # Prisma client
│   ├── middlewares/           # Middlewares
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── logger.middleware.ts
│   ├── exceptions/            # Custom exceptions
│   ├── utils/                 # Utilities
│   │   ├── jwt.util.ts
│   │   ├── password.util.ts
│   │   └── validator.util.ts
│   ├── health/                # Health check domain
│   │   ├── health.controller.ts
│   │   └── health.route.ts
│   ├── auth/                  # Authentication domain
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.route.ts
│   │   └── dto/
│   ├── user/                  # User domain
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.repository.ts
│   │   ├── user.route.ts
│   │   └── dto/
│   ├── types/                 # TypeScript types
│   ├── app.ts                 # Hono app setup
│   └── server.ts              # Entry point
├── .env.example
├── package.json
└── tsconfig.json
```

## 🚀 การติดตั้ง

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า Environment Variables

```bash
cp .env.example .env
```

แก้ไขไฟล์ `.env`:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/reg_api_db
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-at-least-32-characters-long-here
JWT_REFRESH_EXPIRES_IN=30d
BCRYPT_ROUNDS=10
```

### 3. ตั้งค่า Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio
npm run prisma:studio
```

### 4. รัน Development Server

```bash
npm run dev
```

API จะรันที่ `http://localhost:3000`

## 📡 API Endpoints

### Health Check

```
GET /health              - Health check with database status
GET /health/ping         - Simple ping endpoint
```

### Authentication

```
POST /api/v1/auth/register    - Register new user
POST /api/v1/auth/login       - Login
POST /api/v1/auth/refresh     - Refresh access token
GET  /api/v1/auth/me          - Get current user (Protected)
```

### Users

```
GET    /api/v1/users/profile       - Get current user profile (Protected)
GET    /api/v1/users               - Get all users (Admin only)
GET    /api/v1/users/:id           - Get user by ID (Admin only)
PATCH  /api/v1/users/:id           - Update user (Admin only)
DELETE /api/v1/users/:id           - Delete user (Admin only)
```

## 📝 API Examples

### Register

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!",
    "name": "John Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'
```

### Get Current User

```bash
curl http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Refresh Token

```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## 🔐 Password Requirements

- อย่างน้อย 8 ตัวอักษร
- มีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว
- มีตัวพิมพ์เล็กอย่างน้อย 1 ตัว
- มีตัวเลขอย่างน้อย 1 ตัว
- มีอักขระพิเศษอย่างน้อย 1 ตัว (!@#$%^&*(),.?":{}|<>)

## 🏛️ Architecture

### Layered Architecture (Domain-Driven Design)

```
Controller → Service → Repository → Database
    ↓           ↓
   DTO    Domain Logic
```

- **Controller**: รับ HTTP requests และส่ง responses
- **Service**: Business logic
- **Repository**: Database operations (Prisma)
- **DTO**: Data validation และ transformation (Zod)
- **Middleware**: Authentication, logging, error handling

## 🔧 Scripts

```bash
npm run dev              # Run development server
npm run build            # Build for production
npm run start            # Start production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
npm run db:push          # Push schema to database (no migration)
```

## 🐳 Docker Deployment

### สร้าง External Network (ถ้ายังไม่มี)

```bash
docker network create nginx-proxy-gateway-network
```

### รัน Docker Compose

```bash
# Copy environment file
cp .env.docker .env

# แก้ไข JWT secrets ใน .env (สำคัญ!)
nano .env

# Build และ run services
docker-compose up -d

# ดู logs
docker-compose logs -f reg-api

# Run database migrations
docker-compose exec reg-api npx prisma migrate deploy
```

### Docker Compose Services

- **reg-api**: API application (port 3000)
- **postgres**: PostgreSQL database (port 5432)
- **Network**: `nginx-proxy-gateway-network` (external)

### Nginx Proxy Configuration Example

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://reg-api:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Rebuild
docker-compose up -d --build

# View logs
docker-compose logs -f

# Shell access
docker-compose exec reg-api sh

# Database shell
docker-compose exec postgres psql -U regapi -d reg_api_db

# Remove all (including volumes)
docker-compose down -v
```

## 🛡️ Security Features

- ✅ JWT Authentication (Access + Refresh tokens)
- ✅ Password hashing ด้วย bcrypt
- ✅ Password strength validation
- ✅ Role-based authorization (Admin, User)
- ✅ CORS configuration
- ✅ Environment variable validation
- ✅ Error handling middleware
- ✅ Type-safe API ด้วย TypeScript

## 📦 Technologies

- **Hono** - Fast web framework
- **Prisma** - Modern ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Zod** - Schema validation
- **TypeScript** - Type safety

## 📄 License

ISC
