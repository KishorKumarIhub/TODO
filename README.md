# Todo List API

A comprehensive Node.js Todo List application with Express.js and MongoDB, featuring user authentication, CRUD operations, and complete API documentation.

## 🚀 Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Todo Management**: Complete CRUD operations for todos
- **User Isolation**: Each user can only access their own todos
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Proper HTTP status codes and error messages
- **CORS Support**: Cross-origin resource sharing enabled
- **Pagination**: Built-in pagination for todo lists
- **Filtering**: Filter todos by completion status and priority

## 📋 Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [Security Features](#security-features)
- [Contributing](#contributing)
- [License](#license)

## 🛠 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BasicTODO
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/todoapp
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   PORT=3000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - For local development: `mongod`
   - For MongoDB Atlas: Update `MONGODB_URI` in `.env`

5. **Start the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/todoapp` | Yes |
| `JWT_SECRET` | Secret key for JWT signing | - | Yes |
| `JWT_EXPIRE` | Token expiration time | `7d` | No |
| `PORT` | Server port | `3000` | No |
| `NODE_ENV` | Environment mode | `development` | No |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000` | No |

### MongoDB Setup

**Local MongoDB:**
```bash
# Install MongoDB locally
# Start MongoDB service
mongod
```

**MongoDB Atlas (Cloud):**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## 📚 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | Register new user | No |
| POST | `/auth/login` | Login user | No |

### Todo Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/todos` | Get all todos | Yes |
| GET | `/todos/:id` | Get todo by ID | Yes |
| POST | `/todos` | Create new todo | Yes |
| PUT | `/todos/:id` | Update todo | Yes |
| DELETE | `/todos/:id` | Delete todo | Yes |

### Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | API health check | No |

## 🔐 Authentication

### Registration

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Using JWT Token

Include the JWT token in the Authorization header for protected routes:

```bash
curl -X GET http://localhost:3000/api/todos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📖 Documentation

### Interactive API Documentation

Visit the Swagger UI at: `http://localhost:3000/api-docs`

### Generated Documentation Files

- `swagger.json` - OpenAPI specification in JSON format
- `swagger.yaml` - OpenAPI specification in YAML format

### API Documentation Features

- Interactive endpoint testing
- Request/response examples
- Authentication instructions
- Schema definitions
- Error code documentation

## 🏗 Project Structure

```
BasicTODO/
├── config/
│   └── swagger.js          # Swagger configuration
├── controllers/
│   ├── authController.js   # Authentication logic
│   └── todoController.js   # Todo CRUD operations
├── middleware/
│   └── auth.js             # JWT authentication middleware
├── models/
│   ├── User.js             # User data model
│   └── Todo.js             # Todo data model
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── todos.js            # Todo routes
│   └── index.js            # Main router
├── scripts/
│   └── generate-swagger.js  # Swagger file generator
├── .env.example            # Environment variables template
├── FRD.txt                 # Functional Requirements Document
├── package.json            # Dependencies and scripts
├── server.js               # Main application entry point
├── swagger.json            # Generated Swagger JSON
├── swagger.yaml            # Generated Swagger YAML
└── README.md               # This file
```

## 💡 Usage Examples

### Create a Todo

```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "priority": "high",
    "dueDate": "2024-01-20"
  }'
```

### Get All Todos with Pagination

```bash
curl -X GET "http://localhost:3000/api/todos?page=1&limit=10&completed=false&priority=high" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update a Todo

```bash
curl -X PUT http://localhost:3000/api/todos/TODO_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "completed": true,
    "priority": "low"
  }'
```

### Delete a Todo

```bash
curl -X DELETE http://localhost:3000/api/todos/TODO_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## ⚠️ Error Handling

### Common Error Responses

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

**Not Found Error (404):**
```json
{
  "success": false,
  "message": "Todo not found"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "message": "Server error while processing request",
  "error": "Detailed error information"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |

## 🔒 Security Features

### Password Security
- Passwords are hashed using bcrypt with salt rounds of 10
- Password validation requires uppercase, lowercase, and numbers
- Passwords are never returned in API responses

### JWT Authentication
- JWT tokens are signed with a secret key
- Tokens expire after 7 days (configurable)
- All protected routes require valid JWT token

### Input Validation
- All inputs are validated using express-validator
- SQL injection prevention through Mongoose ODM
- XSS protection through input sanitization

### CORS Configuration
- CORS is enabled for cross-origin requests
- Configurable origin settings

## 🧪 Testing

### Manual Testing

1. **Test Registration:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","email":"test@example.com","password":"TestPass123"}'
   ```

2. **Test Login:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"TestPass123"}'
   ```

3. **Test Protected Routes:**
   Use the JWT token from login response in Authorization header.

### Health Check

```bash
curl -X GET http://localhost:3000/api/health
```

## 🚀 Deployment

### Production Deployment

1. **Set Environment Variables:**
   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp
   JWT_SECRET=your_production_secret_key
   ```

2. **Install Dependencies:**
   ```bash
   npm install --production
   ```

3. **Start Application:**
   ```bash
   npm start
   ```

### Docker Deployment (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Performance Considerations

- Database indexes on frequently queried fields
- Pagination for large datasets
- JWT token validation caching
- Efficient query patterns

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Check if MongoDB is running
   - Verify `MONGODB_URI` in `.env`
   - Check network connectivity

2. **JWT Token Error:**
   - Verify `JWT_SECRET` is set
   - Check token expiration
   - Ensure token is in Authorization header

3. **CORS Error:**
   - Update `CORS_ORIGIN` in `.env`
   - Check frontend URL configuration

### Debug Mode

Set `NODE_ENV=development` for detailed error messages.

## 📝 API Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the [FRD.txt](FRD.txt) for detailed requirements
- Visit the interactive API documentation at `/api-docs`

## 🎯 Roadmap

- [ ] Unit and integration tests
- [ ] Rate limiting implementation
- [ ] Email verification for registration
- [ ] Password reset functionality
- [ ] Todo categories/tags
- [ ] File upload for todo attachments
- [ ] Real-time notifications
- [ ] Mobile app integration

---

**Happy Coding! 🚀**
