const jsonContent = (schemaRef) => ({
  'application/json': {
    schema: schemaRef,
  },
});

const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'ToDo List API',
    version: '1.1.0',
    description:
      'Professional API documentation for authentication and todo management endpoints.',
  },
  servers: [
    {
      url: '/',
      description: 'Current server origin',
    },
  ],
  tags: [
    { name: 'Health', description: 'Service status and liveliness' },
    { name: 'Auth', description: 'User registration, login, and profile operations' },
    { name: 'Todos', description: 'Create and manage user todos' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    parameters: {
      TodoId: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'MongoDB ObjectId of the todo item',
        schema: {
          type: 'string',
          example: '6651f6f5f1b5cc39d95f16ab',
        },
      },
    },
    schemas: {
      ApiError: {
        type: 'object',
        required: ['message'],
        properties: {
          message: {
            type: 'string',
            example: 'Invalid email or password.',
          },
          stack: {
            type: 'string',
            nullable: true,
            description: 'Only returned outside production environment.',
          },
        },
      },
      HealthResponse: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            example: 'ok',
          },
        },
      },
      PublicUser: {
        type: 'object',
        required: ['id', 'name', 'email'],
        properties: {
          id: { type: 'string', example: '6651f6f5f1b5cc39d95f16a0' },
          name: { type: 'string', example: 'Ahmed' },
          email: { type: 'string', format: 'email', example: 'ahmed@example.com' },
        },
      },
      ProfileUser: {
        type: 'object',
        required: ['_id', 'name', 'email'],
        properties: {
          _id: { type: 'string', example: '6651f6f5f1b5cc39d95f16a0' },
          name: { type: 'string', example: 'Ahmed' },
          email: { type: 'string', format: 'email', example: 'ahmed@example.com' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      AuthResponse: {
        type: 'object',
        required: ['user', 'token'],
        properties: {
          user: { $ref: '#/components/schemas/PublicUser' },
          token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
      ProfileResponse: {
        type: 'object',
        required: ['user'],
        properties: {
          user: { $ref: '#/components/schemas/ProfileUser' },
        },
      },
      Todo: {
        type: 'object',
        required: ['_id', 'title', 'completed', 'priority', 'user'],
        properties: {
          _id: { type: 'string', example: '6651f6f5f1b5cc39d95f16ab' },
          title: { type: 'string', example: 'Finish backend docs' },
          completed: { type: 'boolean', example: false },
          priority: { type: 'string', enum: ['low', 'medium', 'high'], example: 'medium' },
          dueDate: { type: 'string', format: 'date-time', nullable: true },
          user: { type: 'string', example: '6651f6f5f1b5cc39d95f16a0' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      TodoListResponse: {
        type: 'object',
        required: ['todos'],
        properties: {
          todos: {
            type: 'array',
            items: { $ref: '#/components/schemas/Todo' },
          },
        },
      },
      TodoResponse: {
        type: 'object',
        required: ['todo'],
        properties: {
          todo: { $ref: '#/components/schemas/Todo' },
        },
      },
      MessageResponse: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string', example: 'Todo deleted successfully.' },
        },
      },
      ClearCompletedResponse: {
        type: 'object',
        required: ['deletedCount'],
        properties: {
          deletedCount: { type: 'integer', example: 2 },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Ahmed' },
          email: { type: 'string', format: 'email', example: 'ahmed@example.com' },
          password: { type: 'string', minLength: 6, example: 'StrongPass123' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'ahmed@example.com' },
          password: { type: 'string', minLength: 6, example: 'StrongPass123' },
        },
      },
      CreateTodoRequest: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', example: 'Prepare deployment notes' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'], example: 'high' },
          dueDate: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: '2026-06-10T00:00:00.000Z',
          },
        },
      },
      UpdateTodoRequest: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Prepare deployment notes (updated)' },
          completed: { type: 'boolean', example: true },
          priority: { type: 'string', enum: ['low', 'medium', 'high'], example: 'medium' },
          dueDate: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: '2026-06-11T00:00:00.000Z',
          },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: 'Missing or invalid token',
        content: jsonContent({ $ref: '#/components/schemas/ApiError' }),
      },
      NotFoundUser: {
        description: 'User not found',
        content: jsonContent({ $ref: '#/components/schemas/ApiError' }),
      },
      NotFoundTodo: {
        description: 'Todo not found',
        content: jsonContent({ $ref: '#/components/schemas/ApiError' }),
      },
      InvalidCredentials: {
        description: 'Invalid credentials',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ApiError' },
            examples: {
              invalidEmailOrPassword: {
                value: {
                  message: 'Invalid email or password.',
                },
              },
            },
          },
        },
      },
      InvalidTodoPayload: {
        description: 'Invalid todo payload.',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ApiError' },
            examples: {
              invalidPriority: {
                value: {
                  message: 'Priority must be low, medium, or high.',
                },
              },
              invalidDueDate: {
                value: {
                  message: 'Due date is invalid.',
                },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        operationId: 'getHealthStatus',
        summary: 'Health check',
        description: 'Returns service status for uptime and monitoring checks.',
        responses: {
          200: {
            description: 'Service is healthy',
            content: jsonContent({ $ref: '#/components/schemas/HealthResponse' }),
          },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        operationId: 'registerUser',
        summary: 'Register user',
        description: 'Creates a new account and returns a JWT token.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'User created successfully',
            content: jsonContent({ $ref: '#/components/schemas/AuthResponse' }),
          },
          400: {
            description: 'Missing required fields',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' },
                examples: {
                  missingFields: {
                    value: {
                      message: 'Please provide name, email, and password.',
                    },
                  },
                },
              },
            },
          },
          409: {
            description: 'Email already in use',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' },
                examples: {
                  emailConflict: {
                    value: {
                      message: 'Email is already in use.',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        operationId: 'loginUser',
        summary: 'Login user',
        description: 'Authenticates user credentials and returns a JWT token.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: jsonContent({ $ref: '#/components/schemas/AuthResponse' }),
          },
          400: {
            description: 'Missing credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' },
                examples: {
                  missingCredentials: {
                    value: {
                      message: 'Please provide email and password.',
                    },
                  },
                },
              },
            },
          },
          401: {
            $ref: '#/components/responses/InvalidCredentials',
          },
        },
      },
    },
    '/api/auth/profile': {
      get: {
        tags: ['Auth'],
        operationId: 'getUserProfile',
        summary: 'Get profile',
        description: 'Returns the currently authenticated user profile.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User profile',
            content: jsonContent({ $ref: '#/components/schemas/ProfileResponse' }),
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          404: {
            $ref: '#/components/responses/NotFoundUser',
          },
        },
      },
    },
    '/api/todos': {
      get: {
        tags: ['Todos'],
        operationId: 'getTodos',
        summary: 'List todos',
        description: 'Returns all todos for the authenticated user, newest first.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Todo list',
            content: jsonContent({ $ref: '#/components/schemas/TodoListResponse' }),
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
        },
      },
      post: {
        tags: ['Todos'],
        operationId: 'createTodo',
        summary: 'Create todo',
        description: 'Creates a todo item for the authenticated user.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateTodoRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Todo created',
            content: jsonContent({ $ref: '#/components/schemas/TodoResponse' }),
          },
          400: {
            description: 'Missing title',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' },
                examples: {
                  titleRequired: {
                    value: {
                      message: 'Title is required.',
                    },
                  },
                },
              },
            },
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
        },
      },
    },
    '/api/todos/completed': {
      delete: {
        tags: ['Todos'],
        operationId: 'clearCompletedTodos',
        summary: 'Clear completed todos',
        description: 'Deletes all completed todos for the authenticated user.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Completed todos deleted',
            content: jsonContent({ $ref: '#/components/schemas/ClearCompletedResponse' }),
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
        },
      },
    },
    '/api/todos/{id}': {
      put: {
        tags: ['Todos'],
        operationId: 'updateTodo',
        summary: 'Update todo',
        description: 'Updates title and/or completion status for a specific todo.',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/TodoId' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateTodoRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Todo updated',
            content: jsonContent({ $ref: '#/components/schemas/TodoResponse' }),
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          400: {
            $ref: '#/components/responses/InvalidTodoPayload',
          },
          404: {
            $ref: '#/components/responses/NotFoundTodo',
          },
        },
      },
      delete: {
        tags: ['Todos'],
        operationId: 'deleteTodo',
        summary: 'Delete todo',
        description: 'Deletes a specific todo item.',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/TodoId' }],
        responses: {
          200: {
            description: 'Todo deleted',
            content: jsonContent({ $ref: '#/components/schemas/MessageResponse' }),
          },
          401: {
            $ref: '#/components/responses/Unauthorized',
          },
          404: {
            $ref: '#/components/responses/NotFoundTodo',
          },
        },
      },
    },
  },
};

module.exports = swaggerSpec;
