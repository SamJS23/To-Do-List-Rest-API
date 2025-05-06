const swaggerJsDoc = require("swagger-jsdoc");
const path = require("path");

// __filename and __dirname are available by default in CommonJS

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 * 
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the user
 *         name:
 *           type: string
 *           description: Full name of the user (optional)
 *         email:
 *           type: string
 *           description: Email address of the user
 *         password:
 *           type: string
 *           description: Hashed password of the user
 *       example:
 *         id: "uuid-generated-id"
 *         name: "Samuel James Setiadi"
 *         email: "samuel23505@gmail.com"
 *         password: "Samuel235!"
 *
 *     ToDo:
 *       type: object
 *       required:
 *         - text
 *         - completed
 *         - userId
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the todo item
 *         text:
 *           type: string
 *           description: Description or title of the todo item
 *         completed:
 *           type: boolean
 *           description: Status of the todo item
 *         userId:
 *           type: string
 *           description: ID of the user who owns the todo item
 *       example:
 *         id: "uuid-generated-id"
 *         text: "Do WADS Assignment"
 *         completed: false
 *         userId: "uuid-user-id"
 */

const swaggerSpec = swaggerJsDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo List Management API",
      version: "1.0.0",
      description: "API for managing todo list, including user authentication and todo list management.",
    },
    servers: [
      {
        url: 'http://localhost:5000/api/user',
        description: 'Development - user',
      },
      {
        url: "http://localhost:5000/api/todos",
        description: 'Development - todo'
      }
    ],
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    path.join(__dirname, 'routes', '*.js'),
    path.join(__dirname, 'routes', '*.ts'),
    path.join(__dirname, 'swagger.js'),
    path.join(__dirname, 'swagger.ts'),
  ],
});

module.exports = swaggerSpec;
