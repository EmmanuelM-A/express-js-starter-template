# Contributing to Express.js Starter Template

Thank you for your interest in contributing to the Express.js Starter Template! I welcome contributions from the community and I am grateful for your support in making this project better.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation Guidelines](#documentation-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Community Guidelines](#community-guidelines)

## 📜 Code of Conduct

This project adheres to a Code of Conduct that we expect all contributors to follow. Please read and follow these guidelines to help maintain a welcoming and inclusive community.

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Examples of behavior that contributes to creating a positive environment include:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Examples of unacceptable behavior include:**
- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:
- **Node.js** (v18+ recommended)
- **npm** (v8+ recommended)
- **Git** for version control
- **Docker** (optional, for testing containerized builds)
- A **GitHub account**

### Finding Ways to Contribute

There are many ways to contribute to this project:

1. **🐛 Report Bugs**: Found a bug? Report it in our [Issues](https://github.com/EmmanuelM-A/express-js-starter-template/issues)
2. **💡 Suggest Features**: Have ideas for improvements? Create a feature request
3. **📝 Improve Documentation**: Help us make our docs clearer and more comprehensive
4. **🧪 Write Tests**: Add test coverage for existing functionality
5. **🔧 Fix Issues**: Look for issues labeled `good-first-issue` or `help-wanted`
6. **⚡ Performance Improvements**: Optimize existing code
7. **🎨 UI/UX Improvements**: Enhance the developer experience

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR-USERNAME/express-js-starter-template.git
cd express-js-starter-template

# Add the original repository as upstream
git remote add upstream https://github.com/EmmanuelM-A/express-js-starter-template.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

```bash
# Copy environment file
cp .env.example .env

# Edit .env with appropriate values for development
```

### 4. Verify Setup

```bash
# Run tests to ensure everything works
npm test

# Start development server
npm run dev

# Verify the server is running at http://localhost:5000
```

### 5. Keep Your Fork Synced

```bash
# Fetch upstream changes
git fetch upstream

# Switch to main branch
git checkout main

# Merge upstream changes
git merge upstream/main

# Push updates to your fork
git push origin main
```

## 🤝 How to Contribute

### Step 1: Choose What to Work On

- **For Beginners**: Look for issues labeled `good-first-issue`
- **For Experienced Contributors**: Check `help-wanted` or `enhancement` labels
- **For Bug Fixes**: Look for issues labeled `bug`
- **For New Features**: Create an issue first to discuss the feature

### Step 2: Create a Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Examples:
git checkout -b fix/error-handling-bug
git checkout -b feature/add-redis-caching
git checkout -b docs/update-readme
```

### Step 3: Make Your Changes

- Write clean, readable code following our [coding standards](#coding-standards)
- Add tests for new functionality
- Update documentation as needed
- Ensure all existing tests still pass

### Step 4: Test Your Changes

```bash
# Run the full test suite
npm test

# Run tests with coverage
npm run test:coverage

# Test the development server
npm run dev

# Build documentation
npm run bundle-docs
```

### Step 5: Commit Your Changes

We follow conventional commit messages. Use this format:

```bash
# Format: type(scope): description
git commit -m "feat(auth): add JWT authentication middleware"
git commit -m "fix(logger): resolve memory leak in winston config"
git commit -m "docs(readme): update installation instructions"
git commit -m "test(api): add integration tests for user endpoints"
```

**Commit Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Step 6: Push and Create Pull Request

```bash
# Push your branch to your fork
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub from your fork to the main repository.

## Coding Standards

### JavaScript/ES Modules Standards

#### 1. **Use Modern ES6+ Features**

```javascript
// ✅ Good - Use destructuring
const { name, email } = user;

// ✅ Good - Use arrow functions for simple operations
const users = data.map(user => user.name);

// ✅ Good - Use template literals
const message = `Welcome ${user.name}!`;

// ❌ Avoid - Old-style concatenation
const message = 'Welcome ' + user.name + '!';
```

#### 2. **File Naming Conventions**

```bash
# Use kebab-case for file names
user-service.mjs          # ✅ Good
userService.mjs           # ❌ Avoid
user_service.mjs          # ❌ Avoid

# Use .mjs extension for ES modules
import-export.mjs         # ✅ Good
import-export.js          # ❌ Avoid (unless legacy requirement)
```

#### 3. **Import/Export Standards**

```javascript
// ✅ Good - Named exports for utilities
export const formatDate = (date) => { /* ... */ };
export const validateEmail = (email) => { /* ... */ };

// ✅ Good - Default export for classes/main modules
export default class UserService {
    // class implementation
}

// ✅ Good - Organize imports
import express from 'express';           // Third-party first
import { StatusCodes } from 'http-status-codes';

import logger from '../logger/winston-logger.mjs';  // Local imports after
import { UserService } from '../services/user-service.mjs';
```

#### 4. **Function and Variable Naming**

```javascript
// ✅ Good - Use camelCase
const userName = 'john_doe';
const getUserById = (id) => { /* ... */ };

// ✅ Good - Use descriptive names
const isEmailValid = (email) => validateEmailFormat(email);

// ❌ Avoid - Single letter variables (except for loops)
const u = getCurrentUser();  // What is 'u'?

// ✅ Exception - Loop counters
for (let i = 0; i < users.length; i++) {
    // 'i' is acceptable here
}
```

#### 5. **Async/Await Standards**

```javascript
// ✅ Good - Use async/await
const createUser = async (userData) => {
    try {
        const user = await UserService.create(userData);
        logger.info('User created successfully', { userId: user.id });
        return user;
    } catch (error) {
        logger.error('Failed to create user', { error: error.message });
        throw new ApiError('User creation failed', StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

// ❌ Avoid - Promise chains when async/await is cleaner
const createUser = (userData) => {
    return UserService.create(userData)
        .then(user => {
            logger.info('User created successfully');
            return user;
        })
        .catch(error => {
            logger.error('Failed to create user');
            throw new ApiError('User creation failed', StatusCodes.INTERNAL_SERVER_ERROR);
        });
};
```

### Code Structure Standards

#### 1. **Controller Pattern**

```javascript
// ✅ Good - Thin controllers, use services for business logic
export class UserController {
    static createUser = expressAsyncHandler(async (request, response) => {
        const userData = request.body;
        
        // Validation (consider using middleware)
        if (!userData.email) {
            throw new ApiError('Email is required', StatusCodes.BAD_REQUEST);
        }
        
        // Business logic in service
        const user = await UserService.createUser(userData);
        
        sendSuccessResponse(
            response,
            StatusCodes.CREATED,
            'User created successfully',
            user
        );
        
        logger.info('User created via API', { userId: user.id });
    });
}
```

#### 2. **Service Pattern**

```javascript
// ✅ Good - Services contain business logic
export class UserService {
    static async createUser(userData) {
        // Validation
        await this.validateUserData(userData);
        
        // Business logic
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        // Database operation
        const user = await User.create({
            ...userData,
            password: hashedPassword
        });
        
        // Don't return sensitive data
        const { password, ...userResponse } = user.toObject();
        return userResponse;
    }
    
    static async validateUserData(userData) {
        if (await this.emailExists(userData.email)) {
            throw new ApiError(
                'Email already exists',
                StatusCodes.CONFLICT,
                'EMAIL_EXISTS'
            );
        }
    }
}
```

#### 3. **Error Handling Standards**

```javascript
// ✅ Good - Use ApiError for known errors
throw new ApiError(
    'User not found',
    StatusCodes.NOT_FOUND,
    'USER_NOT_FOUND',
    { userId }
);

// ✅ Good - Wrap unknown errors
try {
    return await someExternalService.call();
} catch (error) {
    logger.error('External service failed', { error: error.message });
    throw new ApiError(
        'Service temporarily unavailable',
        StatusCodes.SERVICE_UNAVAILABLE,
        'EXTERNAL_SERVICE_ERROR'
    );
}
```

### Documentation Standards

#### 1. **JSDoc Comments**

```javascript
/**
 * Creates a new user account with the provided information.
 * 
 * @param {Object} userData - The user data object
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password (will be hashed)
 * @param {string} [userData.name] - User's full name (optional)
 * @returns {Promise<Object>} The created user object (without password)
 * @throws {ApiError} Throws CONFLICT error if email already exists
 * @throws {ApiError} Throws VALIDATION_ERROR if data is invalid
 * 
 * @example
 * const user = await UserService.createUser({
 *     email: 'john@example.com',
 *     password: 'securePassword123',
 *     name: 'John Doe'
 * });
 */
static async createUser(userData) {
    // Implementation
}
```

#### 2. **README Updates**

When adding new features, update the relevant documentation:

```markdown
<!-- Add to appropriate section in README.md -->
### New Feature: User Authentication

This feature provides JWT-based authentication for API endpoints.

#### Usage

```javascript
import { authenticateToken } from '../middleware/auth.mjs';

// Protect routes
router.get('/protected', authenticateToken, controller.method);
```

#### Configuration

Add to your `.env` file:
```env
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=24h
```
```

## Testing Requirements

### Test Coverage Standards

- **Minimum Coverage**: 80% for new code
- **Critical Paths**: 100% coverage required for error handling and security features
- **Test Types**: Unit tests are required, integration tests highly recommended

### Writing Tests

#### 1. **Unit Tests**

```javascript
// tests/unit/services/user-service.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from '../../../src/services/user-service.mjs';

describe('UserService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    
    describe('createUser', () => {
        it('should create a user with valid data', async () => {
            // Arrange
            const userData = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User'
            };
            
            // Act
            const result = await UserService.createUser(userData);
            
            // Assert
            expect(result).toBeDefined();
            expect(result.email).toBe(userData.email);
            expect(result.password).toBeUndefined(); // Should not return password
        });
        
        it('should throw error for duplicate email', async () => {
            // Arrange
            const userData = { email: 'existing@example.com' };
            
            // Act & Assert
            await expect(UserService.createUser(userData))
                .rejects
                .toThrow('Email already exists');
        });
    });
});
```

#### 2. **Integration Tests**

```javascript
// tests/integration/api/users.test.js
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../../src/app.mjs';

describe('Users API Integration', () => {
    beforeAll(async () => {
        // Setup test database, etc.
    });
    
    afterAll(async () => {
        // Cleanup
    });
    
    describe('POST /api/v1/users', () => {
        it('should create a user successfully', async () => {
            const userData = {
                email: 'newuser@example.com',
                password: 'password123',
                name: 'New User'
            };
            
            const response = await request(app)
                .post('/api/v1/users')
                .send(userData)
                .expect(201);
            
            expect(response.body.success).toBe(true);
            expect(response.body.data.email).toBe(userData.email);
            expect(response.body.data.password).toBeUndefined();
        });
    });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test tests/unit/services/user-service.test.js

# Run with coverage
npm run test:coverage

# Run in watch mode during development
npm run test:watch
```

## Documentation Guidelines

### 1. **API Documentation**

When adding new endpoints, create corresponding Swagger documentation:

```yaml
# src/docs/v1/routes/users/create.yml
summary: Create a new user
description: Creates a new user account with the provided information
operationId: createUser
tags: [Users]
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required: [email, password]
        properties:
          email:
            type: string
            format: email
            example: "user@example.com"
          password:
            type: string
            minLength: 8
            example: "securePassword123"
          name:
            type: string
            example: "John Doe"
responses:
  '201':
    description: User created successfully
    content:
      application/json:
        schema:
          $ref: '../../components/schemas/SuccessEnvelope.yml'
  '409':
    description: Email already exists
    content:
      application/json:
        schema:
          $ref: '../../components/schemas/ErrorEnvelope.yml'
```

### 2. **Code Comments**

```javascript
// ✅ Good - Explain WHY, not WHAT
// Validate email uniqueness before creating user to prevent conflicts
const existingUser = await User.findOne({ email });

// ✅ Good - Complex business logic explanation
// Calculate pricing tier based on usage patterns and subscription level
// This algorithm considers both monthly usage and feature access
const pricingTier = calculatePricingTier(usage, subscription);

// ❌ Avoid - Obvious comments
// Increment counter by 1
counter++;

// ❌ Avoid - Outdated comments
// TODO: Remove this hack (left from 2019)
```

## Pull Request Process

### Before Submitting

**Checklist:**
- [ ] All tests pass (`npm test`)
- [ ] Code follows style guidelines
- [ ] Documentation updated (if applicable)
- [ ] No merge conflicts with main branch
- [ ] Commit messages follow conventional format
- [ ] Self-review completed

### Pull Request Template

When creating a PR, use this template:

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to not work)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Added tests for new functionality
- [ ] All existing tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots or GIFs demonstrating the change.

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review of code completed
- [ ] Code is commented where necessary
- [ ] Documentation updated
- [ ] No new warnings or errors introduced
```

### Review Process

1. **Automated Checks**: GitHub Actions will run tests automatically
2. **Code Review**: Maintainers will review your code
3. **Feedback**: Address any feedback from reviewers
4. **Approval**: Once approved, a maintainer will merge your PR

### Review Criteria

Reviewers will check for:
- **Functionality**: Does the code work as expected?
- **Testing**: Is there adequate test coverage?
- **Documentation**: Are docs updated appropriately?
- **Style**: Does code follow project conventions?
- **Performance**: Are there any performance implications?
- **Security**: Are there any security concerns?

## Issue Guidelines

### Reporting Bugs

Use this template for bug reports:

```markdown
**Bug Description**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- OS: [e.g. macOS, Ubuntu 20.04, Windows 10]
- Node.js version: [e.g. 18.16.0]
- npm version: [e.g. 9.5.1]
- Project version: [e.g. 1.0.0]

**Additional Context**
Any other context, logs, or screenshots.
```

### Feature Requests

Use this template for feature requests:

```markdown
**Feature Description**
A clear description of what you want to happen.

**Problem Statement**
What problem does this solve? What use case does it address?

**Proposed Solution**
Describe the solution you'd like to see.

**Alternatives Considered**
Describe any alternative solutions you've considered.

**Additional Context**
Any other context, mockups, or examples.
```

### Issue Labels

- `bug`: Something isn't working
- `feature`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good-first-issue`: Good for newcomers
- `help-wanted`: Extra attention is needed
- `question`: Further information is requested
- `enhancement`: Improvement to existing feature

## Community Guidelines

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and community discussions
- **Pull Requests**: Code contributions and reviews

### Best Practices for Community Interaction

1. **Be Respectful**: Treat all community members with respect
2. **Be Constructive**: Provide helpful feedback and suggestions
3. **Be Patient**: Remember that maintainers are often volunteers
4. **Search First**: Check if your question/issue has been addressed before
5. **Provide Context**: Give detailed information to help others help you

### Getting Help

**Before asking for help:**
1. Check the [README](README.md) and documentation
2. Search existing [Issues](https://github.com/EmmanuelM-A/express-js-starter-template/issues)
3. Review [Discussions](https://github.com/EmmanuelM-A/express-js-starter-template/discussions)

**When asking for help:**
- Provide a clear description of your problem
- Include relevant code snippets
- Share error messages and logs
- Describe what you've already tried

## Recognition

Contributors who make significant contributions will be:
- Added to the contributors list in README.md
- Mentioned in release notes
- Given contributor status on the repository

### Types of Contributions Recognized

- **Code contributions**: Bug fixes, features, performance improvements
- **Documentation**: Improving docs, tutorials, examples
- **Testing**: Adding test coverage, identifying bugs
- **Community support**: Helping others in issues and discussions
- **Maintenance**: Keeping dependencies updated, CI/CD improvements

## Questions?

If you have questions about contributing, please:
1. Check this guide first
2. Search existing discussions and issues
3. Create a new [Discussion](https://github.com/EmmanuelM-A/express-js-starter-template/discussions) for general questions
4. Create an [Issue](https://github.com/EmmanuelM-A/express-js-starter-template/issues) for specific problems

---

Thank you for contributing to Express.js Starter Template!

***Tears and sweat aren’t the foundation, but they’re the path to one. Happy coding!***