# Express JS Starter Template

A modern, customizable, production-ready Express.js starter template using **ES Modules (`.mjs`)**, designed to scale, stay maintainable, and integrate seamlessly with modern tooling like **Docker**, **Swagger** and more.

## Project Structure

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
│   ├── e2e/ 
│   ├── integration/ 
│   └── unit/ 
├── .env                   # Environment variables
├── .env.example           # Example env file for reference
├── .dockerignore          # Files to exclude from Docker builds
├── Dockerfile             # Docker build configuration
├── docker-compose.yml     # For multi-service setup (DB + API)
├── package.json
├── package-lock.json
├── README.md
└── .gitigno


```

