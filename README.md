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


## Docker Usage

### Development

### Production

**NOTE** - If you have mutple external servers/dependencies I suggest using docker-compose instead

## Project Extension Guide & Walkthrough

### Integrating Databases - Setup & Usage

In the `src` folder add the following folders and files:

```bash
├── database/
│   ├── models/                 # Access models
│   ├── schemas/                # Database schema
│   └── db-connection.mjs       # Connection point to db
```

The `models/` acts as ...


### Testing - Setup & Usage

Tests in this project are handled via `vitest` and can be run using this script `npm test`.

The the tests folder is split into three sub folders as shown below:

```bash
├── tests/
│   ├── e2e/                 
│   ├── integration/                
│   └── unit/       
```


### Logging Mechanism

The project uses winston logging as the default centralized logging mechanism. It implements a logging interface
defined in the file `src/logger/logger-interface.mjs`. The logging mechanism can easy be swittched out with
another of your preference but it must implement the interface defined in the file to maintain compatibility.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Support

- Issues: GitHub Issues
- Discussions: GitHub Discussions
- Email: emmanuel@example.com


Built with ❤️ by [Emmanuel M-A]()

Happy coding!
