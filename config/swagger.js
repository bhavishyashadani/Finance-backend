const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Dashboard API',
      version: '1.0.0',
      description: `
## Finance Data Processing and Access Control Backend

A backend system for a finance dashboard that supports user role management, financial records CRUD, dashboard analytics, and role-based access control.

### Roles
- **Viewer** — Can view all records and recent activity
- **Analyst** — Can view records + access all dashboard analytics
- **Admin** — Full access including creating/updating/deleting records and managing users

### Authentication
All protected routes require a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <your_jwt_token>
\`\`\`
Get your token by calling **POST /api/auth/login**
      `,
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token obtained from /api/auth/login',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '661f1b2c3d4e5f6a7b8c9d0e' },
            name: { type: 'string', example: 'Admin User' },
            email: { type: 'string', example: 'admin@finance.com' },
            role: { type: 'string', enum: ['viewer', 'analyst', 'admin'], example: 'admin' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Record: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '661f1b2c3d4e5f6a7b8c9d0f' },
            amount: { type: 'number', example: 75000 },
            type: { type: 'string', enum: ['income', 'expense'], example: 'income' },
            category: {
              type: 'string',
              enum: ['salary', 'freelance', 'investment', 'food', 'transport', 'utilities', 'entertainment', 'healthcare', 'education', 'rent', 'other'],
              example: 'salary',
            },
            date: { type: 'string', format: 'date-time' },
            notes: { type: 'string', example: 'April salary payment' },
            createdBy: { $ref: '#/components/schemas/User' },
            isDeleted: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            total: { type: 'integer', example: 13 },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            totalPages: { type: 'integer', example: 2 },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message here' },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation failed' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Valid email is required' },
                },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);