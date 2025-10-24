# EC Attend Backend API

A Hono-based backend API for EC Attend application with user management functionality.

## Features

- **User Management**: Complete CRUD operations for users
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Ready for Better Auth integration
- **API Endpoints**: RESTful API design

## API Endpoints

### Health

- `GET /health` - Health check endpoint

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file with:

   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/ec_attend_db
   ```

3. **Database Setup**:

   ```bash
   # Generate migration files
   npx drizzle-kit generate

   # Run migrations
   npx drizzle-kit migrate
   ```

4. **Development**:
   ```bash
   npm run dev
   ```

## Example API Usage

### Create User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "age": 30, "email": "john@example.com"}'
```

### Get All Users

```bash
curl http://localhost:3000/api/users
```

### Update User

```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "John Smith", "age": 31}'
```

### Delete User

```bash
curl -X DELETE http://localhost:3000/api/users/1
```

## Database Schema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  isActive BOOLEAN DEFAULT true NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW() NOT NULL,
  updatedAt TIMESTAMP DEFAULT NOW() NOT NULL
);
```
