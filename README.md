# Bella Imagine – Backend

Bella Imagine is a platform that connects clients with professional photographers, built with a robust and scalable backend using **Clean Architecture** and adhering to **SOLID principles** for modularity and maintainability.

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Environment Configuration](#environment-configuration)
- [Setup and Installation](#setup-and-installation)
- [Running the Project](#running-the-project)
- [Contributing](#contributing)
- [License](#license)

## Overview
Bella Imagine's backend powers a seamless experience for hiring photographers, managing media, and facilitating real-time communication. It is designed for scalability, performance, and ease of maintenance.

## Architecture
- **Architecture**: Clean Architecture
- **Principles**: SOLID
- **Core Layers**:
  - **Controllers**: Handle incoming HTTP requests and responses.
  - **Use Cases**: Encapsulate business logic.
  - **Repositories**: Manage data access and storage.
  - **Entities**: Represent core business models.
- **Caching**: Redis (for caching presigned URLs).
- **Storage**: AWS S3 for media file storage.
- **Authentication**: JWT-based authentication system.
- **Real-Time Communication**: Socket.IO for live chat functionality.

## Features
- Connect clients with professional photographers.
- Secure media storage and access via AWS S3.
- Real-time chat for seamless client-photographer communication.
- Scalable and maintainable codebase with Clean Architecture.
- Secure authentication with JWT access and refresh tokens.
- Payment integration with Stripe.
- Efficient caching with Redis.

## Environment Configuration
Create a `.env` file in the project root and configure the following environment variables:

```plaintext
# Database Configuration
DATABASE_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/bellaimagine

# CORS Configuration
CORS_ALLOWED_ORIGIN=http://localhost:5173
PORT=3002

# JWT Configuration
JWT_ACCESS_SECRET_KEY=jwt-access-secret
JWT_REFRESH_SECRET_KEY=jwt-refresh-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=1d

# Email Configuration
EMAIL_USER=no-reply@bellaimagine.com
EMAIL_PASS=your-email-password

# Environment
NODE_ENV=development

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_yourstripekey

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
BUCKET_NAME=bellaimagine-bucket
AWS_REGION=ap-south-1

# Redis Configuration
REDIS_USERNAME=default
REDIS_PASS=your-redis-password
REDIS_PORT=12802
REDIS_HOST=redis-instance.example.com
REDIS_PRESIGNRED_URL_EXPIRY=86400
```

## Setup and Installation
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd bella-imagine-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Copy the `.env.example` file to `.env`.
   - Update the `.env` file with your specific configuration values.

## Running the Project
- **Development Mode**:
  ```bash
  npm run dev
  ```
  Starts the server with hot-reloading for development.

- **Build for Production**:
  ```bash
  npm run build
  ```
  Compiles the project for production.

- **Production Mode**:
  ```bash
  npm start
  ```
  Starts the production server.

## Contributing
We welcome contributions to Bella Imagine! To contribute:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

Please ensure your code follows the project's coding standards and includes relevant tests.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.