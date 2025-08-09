# Express JS Starter Template

A modern, scalable, and production-ready Express.js starter template built with ES Modules, designed for rapid development of RESTful APIs and microservices. This template emphasizes maintainability, testability, and seamless integration with modern development tools.

## Features

- **ESM-First Architecture**: Built with ES Modules (`.mjs`) and modern import/export syntax.
- **Comprehensive API Documentation**: Automatic Swagger/OpenAPI documentation generation.
- **Testing Suite**: Complete testing setup with Vitest (unit, integration, and E2E tests).
- **Docker Ready**: Separate configurations for development and production environments.
- **Security First**: Helmet, CORS, and rate limiting configured out of the box.
- **Structured Logging**: Centralized logging with Winston, configurable for different environments.
- **Error Handling**: Robust error handling with standardized API responses.
- **Development Tools**: Hot reloading with Nodemon and GitHub Actions CI/CD.
- **Scalable Structure**: Modular architecture ready for team development.

## Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Configuration]()
- [API Documentation]()
- [Testing]()
- [Docker Usage]()
- [Database Integration]()
- [Logging System]()
- [Error Handling]()
- [Contributing]()
- [License]()

## Quick Start

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm or yarn**
- **Docker** (optional, for containerized development)

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/EmmanuelM-A/express-js-starter-template.git
```

#### 2. Change directory into cloned project

```bash
cd express-js-starter-template
```

#### 3. Install dependencies

```bash
npm install
```

#### 4. Setup Enviornment Variables

```bash
cp .env.example .env
```

Edit `.env` file with your configurations.

#### 5. Start the development server

```bash
npm run dev     # Using nodemom (for development)
```

Access the application:
- API: [Development Server](http://localhost:5000/api/v1)
- Documentation: [Swagger UI](http://localhost:5000/api-docs)

## Project Structure

```bash
express-js-starter-template/
├── .github/                        # GitHub Actions and workflows
│   └── workflows/
│       └── tests.yml               # Automated testing pipeline
├── src/                            
│   ├── api/                        
│   │   └── v1/                     # API version 1
│   │       ├── controllers/        # API route definitions
│   │       └── routes/             # Express route definitions
│   ├── config/                     # Application configuration
│   │   ├── settings.mjs            # App-wide settings
│   │   └── common-errors.mjs       # Standardized error definitions
│   ├── docs/                       # API documentation
│   │   ├── v1/                     # Version-specific docs
│   │   ├── bundled-swagger.yaml    # Generated OpenAPI spec
│   │   └── swagger.mjs             # Swagger setup and configuration
│   ├── logger/                     # Logging system
│   │   ├── logger-interface.mjs    # Abstract logging interface
│   │   └── winston-logger.mjs      # Winston implementation
│   ├── middleware/                 # Express middleware
│   │   ├── error-handler.mjs       # Global error handling
│   │   └── api-rate-limiter.mjs    # Rate limiting configuration
│   ├── services/                   # Business logic and external services
│   ├── utils/                      # Utility functions and helpers
│   │   ├── api-error.mjs           # Custom error class
│   │   └── response-structure.mjs  # Standardized API responses
│   ├── app.mjs                     # Express app configuration
│   └── server.mjs                  # Application entry point
├── tests/                          # Test suite
│   ├── e2e/                        # End-to-end tests
│   ├── integration/                # Integration tests
│   └── unit/                       # Unit tests
├── .dockerignore                   # Docker build exclusions
├── .gitignore                      # Git version control exclusions
├── Dockerfile.Dev                  # Development Docker configuration
├── Dockerfile.Prod                 # Production Docker configuration
├── package.json                    # Dependencies and scripts
├── vitest.config.js                # Testing configuration
└── README.md                       # Project documentation
```

### Key Directories Explained

- **`src/api/`**: Contains the API layer with version-based organization.

    - **Controllers**: Handle HTTP requests, input validation, and response formatting.

    - **Routes**: Define API endpoints and connect them to controllers.

    - **Versioning**: Supports multiple API versions (v1, v2, etc.) for backward compatibility.

- **`/src/config/`**: Centralized configuration management.

    - `settings.mjs`: Application-wide constants and settings.

    - `common-errors.mjs`: Standardized error codes and messages.

- **`/src/docs/`**: API documentation system.

    - **Modular YAML files**: Organized by endpoints for maintainability.

    - **Auto-generation**: Swagger docs are automatically bundled and served.

    - **Version-specific**: Supports documentation for different API versions.

- **`/src/logger/`**: Pluggable logging system.

    - **Interface-based**: Easy to swap logging libraries.

    - **Environment-aware**: Different log formats for development/production

    - **Structured logging**: JSON format for production, colored console for development

- **`/src/middleware/`**: Express middleware for cross-cutting concerns.

    - **Error handling**: Centralized error processing and response formatting.

    - **Security**: Rate limiting, CORS, and security headers.

    - **Logging**: Request/response logging and performance monitoring.

- **`/src/services/`**: Business logic and external service integrations.

    - **Separation of concerns**: Keep controllers thin, business logic in services.

    - **Testability**: Easy to unit test business logic independently.

    - **Reusability**: Services can be used across multiple controllers.

- **`/src/utils/`**: Utility functions and helpers.

    - **API responses**: Standardized success and error response formatting.

    - **Custom errors**: ApiError class for consistent error handling.

    - **Common utilities**: Shared helper functions.

## Configuration

### Enviornment Variables

Create a `.env` file in the root directory:

```bash
# Server Configuration
NODE_ENV=development                # development, production, test
PORT=5000                           # Server port
SERVICE_URL=http://localhost:5000   # Full service URL for documentation

# Logging Configuration
LOG_LEVEL=debug                     # error, warn, info, debug
SERVICE_NAME=express-starter        # Service identifier in logs

# Add your custom environment variables below
# DATABASE_URL=mongodb://localhost:27017/myapp
# JWT_SECRET=your-secret-key
# REDIS_URL=redis://localhost:6379
```

### Application Settings

Modify `/src/config/settings.mjs` for application-wide settings:

```javascript
export const settings = {
    DEFAULT_PORT: 5000,
    API_VERSION: 'v1',
    // Add your settings here
};
```

## API Documentation

This template includes comprehensive API documentation using Swagger/OpenAPI 3.1.

### Accessing Documentation

- Development: `http://localhost:5000/api-docs`
- Production: `https://your-domain.com/api-docs`

### Documentation Structure

The documentation is organized in modular YAML files:

```bash
src/docs/
│   └── v1/                         # Versioned documentation
│       ├── components/             # Resuable data models
│       │       ├── parameters/
│       │       └── schemas/
│       ├── routes/                 # Endpoint-specific documentation
│       └── openapi.yaml            # Main OpenAPI documentation              
├── bundled-swagger.yaml            # The bundled yaml file
└── swagger.mjs                     # Setups the Swagger UI
```

### Adding New Endpoints

1. Create endpoint documentation in `/src/docs/v1/routes/`.

2. Reference it in `/src/docs/v1/openapi.yaml`.;hjl20

3. Run `npm run bundle-docs` to regenerate the documentation.

### Example Documentation

```yaml
# /src/docs/v1/routes/users/create.yml
summary: Create a new user
description: Creates a new user account with the provided information
operationId: createUser
tags: [Users]
requestBody:
  required: true
  content:
    application/json:
      schema:
        $ref: '../../components/schemas/CreateUserRequest.yml'
responses:
  '201':
    description: User created successfully
    content:
      application/json:
        schema:
          $ref: '../../components/schemas/SuccessEnvelope.yml'
```



## Testing

This template includes a comprehensive testing setup using **Vitest**.

### Test Structure

```bash
tests/
├── unit/                    # Unit tests for individual functions/classes
├── integration/            # Integration tests for API endpoints
└── e2e/                   # End-to-end tests for complete workflows
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test tests/unit/services/server-util-services.test.js
```

### Writing Tests

#### Unit Test Example

```javascript
// tests/unit/services/user-service.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { UserService } from '../../../src/services/user-service.mjs';

describe('UserService', () => {
    it('should create a new user', async () => {
        const userData = { name: 'John Doe', email: 'john@example.com' };
        const result = await UserService.createUser(userData);
        
        expect(result).toHaveProperty('id');
        expect(result.name).toBe(userData.name);
    });
});
```

#### Integration Test Example

```javascript
// tests/integration/api/users.test.js
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../../src/app.mjs';

describe('Users API', () => {
    it('should create a user via POST /api/v1/users', async () => {
        const userData = { name: 'Jane Doe', email: 'jane@example.com' };
        
        const response = await request(app)
            .post('/api/v1/users')
            .send(userData)
            .expect(201);
            
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('id');
    });
});
```

### Test Configuration

Vitest is configured in `vitest.config.js`:

```javascript
export default {
    test: {
        globals: true,
        environment: 'node',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html']
        }
    }
};
```

## Docker Usage

The template includes Docker configurations for both development and production environments.

### Development with Docker

```bash
# Build development image
docker build -f Dockerfile.Dev -t express-starter:dev .

# Run development container
docker run -p 5000:5000 -v $(pwd):/app express-starter:dev
```

### Production with Docker

```bash
# Build production image
docker build -f Dockerfile.Prod -t express-starter:prod .

# Run production container
docker run -p 5000:5000 express-starter:prod
```

### Docker Compose (Recommended)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.Dev
    ports:
      - "5000:5000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    depends_on:
      - mongodb
      - redis

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7
    ports:
      - "6379:6379"

volumes:
  mongo_data:
```

## Database Inegration

This template is designed to work with any database. Here's how to integrate popular options:

### MongoDB with Mongoose

1. **Install dependencies**
   ```bash
   npm install mongoose
   ```

2. **Create database structure**
   ```
   src/database/
   ├── models/              # Mongoose models
   │   └── user.mjs
   ├── schemas/             # Mongoose schemas
   │   └── user-schema.mjs
   └── db-connection.mjs    # Database connection
   ```

3. **Example implementation**
   ```javascript
   // src/database/db-connection.mjs
   import mongoose from 'mongoose';
   import logger from '../logger/winston-logger.mjs';

   export const connectDatabase = async () => {
       try {
           await mongoose.connect(process.env.DATABASE_URL);
           logger.info('Connected to MongoDB');
       } catch (error) {
           logger.error('Database connection failed:', error);
           process.exit(1);
       }
   };
   ```

### PostgreSQL with Sequelize

1. **Install dependencies**
   ```bash
   npm install sequelize pg pg-hstore
   ```

2. **Create database structure**
   ```
   src/database/
   ├── models/              # Sequelize models
   ├── migrations/          # Database migrations
   ├── seeders/            # Database seeders
   └── db-connection.mjs    # Sequelize configuration
   ```

### Redis Integration

```javascript
// src/services/cache-service.mjs
import redis from 'redis';
import logger from '../logger/winston-logger.mjs';

const client = redis.createClient({
    url: process.env.REDIS_URL
});

client.on('error', (err) => logger.error('Redis error:', err));

export const CacheService = {
    async get(key) {
        return await client.get(key);
    },
    
    async set(key, value, expireInSeconds = 3600) {
        return await client.setEx(key, expireInSeconds, JSON.stringify(value));
    }
};
```


## Logging System

The template uses a pluggable logging system with Winston as the default implementation.

### Logger Interface

All loggers must implement the interface defined in `/src/logger/logger-interface.mjs`:

```javascript
export default class LoggerInterface {
    info(message, meta) { /* Implementation required */ }
    warn(message, meta) { /* Implementation required */ }
    error(message, meta) { /* Implementation required */ }
    debug(message, meta) { /* Implementation required */ }
    log(level, message, meta) { /* Implementation required */ }
}
```

### Using the Logger

```javascript
import logger from '../logger/winston-logger.mjs';

// Basic logging
logger.info('User created successfully');
logger.error('Database connection failed');
logger.debug('Processing request', { userId: 123, action: 'login' });

// With metadata
logger.info('Payment processed', {
    userId: 123,
    amount: 99.99,
    currency: 'USD',
    transactionId: 'txn_123456'
});
```

### Log Formats

- **Development**: Colored console output with timestamps
- **Production**: Structured JSON format for log aggregation

### Custom Logger Implementation

To use a different logger (e.g., Pino), create a new implementation:

```javascript
// src/logger/pino-logger.mjs
import pino from 'pino';
import LoggerInterface from './logger-interface.mjs';

class PinoLogger extends LoggerInterface {
    constructor() {
        super();
        this.logger = pino();
    }

    info(message, meta = {}) {
        this.logger.info(meta, message);
    }
    
    // ... implement other methods
}

export default new PinoLogger();
```


## Error Handling

## Contributing

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Support

- Issues: GitHub Issues
- Discussions: GitHub Discussions
- Email: emmanuel@example.com


Built with ❤️ by [Emmanuel M-A]()

Happy coding!
