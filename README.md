# Express JS Starter Template

A modern, customizable, production-ready Express.js starter template using **ES Modules (`.mjs`)**, designed to scale, stay maintainable, and integrate seamlessly with modern tooling like **Docker**, **Swagger** and more.

## Table of Contents
- Base Project Structure

## Base Project Structure

```bash
express-js-starter-template/
├── .github/                    # Github actions
│   └── workflows/
│       └── tests.yml
├── src/
│   └── api/                    # API core (with versioning)
│       └── v1
│           ├── controllers/    # Route handlers
│           └── routes/         # API route defintions
│   ├── config/                 # Configurations
│   ├── docs/                   # API documentation
│   ├── logger/                 # Logger setup
│   ├── middleware/             # Custom middleware (e.g., auth, error handlers)
│   ├── services/               # Business logic / external services
│   ├── database/               # Database models (e.g., Mongoose/Sequelize)
│   ├── utils/                  # Utility functions
│   ├── app.js                  # Express app instance
│   └── server.js               # Entry point (starts server)
├── tests/                      # Application tests
├── .dockerignore               # Files to exclude from Docker builds
├── .gitignore                  # Files to exclude from Git version tracking
├── .env                        # Environment variables
├── .env.example                # Example env file for reference
├── Dockerfile.Dev              # Docker build configuration for Development
├── Dockerfile.Prod             # Docker build configuration
├── package-lock.json
├── package.json
├── README.md
└── vitest.config.js
```

## Features

- **ESM-first**: Uses .mjs and modern import/export syntax
- **Centralized and pluggable logging**
- Modular documentation structure with Swagger API docs and easy command line usage
- Environment-specific config via `.env`
- Structured error and HTTP response handling
- Test-ready layout with `tests/` directory
- Docker-ready for both dev and prod environments
- Clean and modular folder structure for scalability

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/EmmanuelM-A/express-js-starter-template.git
```

### 2. Change directory into cloned project

```bash
cd express-js-starter-template
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Enviornment Variables

```bash
cp .env.example .env
```

### 5. Run the Application

```bash
npm run dev     # Using nodemom (for development)
npm start       # Production run
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

