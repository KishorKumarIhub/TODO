const fs = require('fs');
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');
const yaml = require('js-yaml');

// Load environment variables
require('dotenv').config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo List API',
      version: '1.0.0',
      description: 'A comprehensive Todo List API with user authentication and CRUD operations',
      contact: {
        name: 'API Support',
        email: 'support@todoapi.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://your-production-url.com/api' 
          : 'http://localhost:3000/api',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated id of the user'
            },
            username: {
              type: 'string',
              description: 'The username of the user',
              minLength: 3,
              maxLength: 30
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'The email of the user'
            },
            password: {
              type: 'string',
              description: 'The password of the user',
              minLength: 6
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the user was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the user was last updated'
            }
          }
        },
        Todo: {
          type: 'object',
          required: ['title'],
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated id of the todo'
            },
            title: {
              type: 'string',
              description: 'The title of the todo',
              maxLength: 100
            },
            description: {
              type: 'string',
              description: 'The description of the todo',
              maxLength: 500
            },
            completed: {
              type: 'boolean',
              description: 'The completion status of the todo',
              default: false
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'The priority level of the todo',
              default: 'medium'
            },
            dueDate: {
              type: 'string',
              format: 'date',
              description: 'The due date of the todo'
            },
            user: {
              type: 'string',
              description: 'The ID of the user who owns the todo'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the todo was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the todo was last updated'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            message: {
              type: 'string'
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User'
                },
                token: {
                  type: 'string',
                  description: 'JWT token for authentication'
                }
              }
            }
          }
        },
        TodoResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            message: {
              type: 'string'
            },
            data: {
              type: 'object',
              properties: {
                todo: {
                  $ref: '#/components/schemas/Todo'
                }
              }
            }
          }
        },
        TodoListResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            message: {
              type: 'string'
            },
            data: {
              type: 'object',
              properties: {
                todos: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Todo'
                  }
                },
                total: {
                  type: 'integer',
                  description: 'Total number of todos'
                },
                page: {
                  type: 'integer',
                  description: 'Current page number'
                },
                limit: {
                  type: 'integer',
                  description: 'Number of todos per page'
                },
                pages: {
                  type: 'integer',
                  description: 'Total number of pages'
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            error: {
              type: 'string',
              example: 'Detailed error information'
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Validation failed'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './models/*.js'
  ]
};

const specs = swaggerJSDoc(options);

// Generate JSON file
fs.writeFileSync('swagger.json', JSON.stringify(specs, null, 2));
console.log('✅ swagger.json generated successfully');

// Generate YAML file
const yamlStr = yaml.dump(specs, { 
  indent: 2,
  lineWidth: 120,
  noRefs: true,
  sortKeys: false
});
fs.writeFileSync('swagger.yaml', yamlStr);
console.log('✅ swagger.yaml generated successfully');

console.log('\n📚 Swagger documentation files generated:');
console.log('   - swagger.json');
console.log('   - swagger.yaml');
console.log('\n🌐 View documentation at: http://localhost:3000/api-docs');
