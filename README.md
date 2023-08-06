# Invoice Generator

The Invoice Generator is a Node.js application that allows you to create and manage invoices. It provides an API for creating, retrieving, and sending invoices via email. The application uses Express.js for handling routes, MongoDB with Mongoose for database interactions, and various npm packages for additional functionality.

## Features

-   Create and manage invoices with detailed product information.
-   Retrieve invoices based on different query parameters.
-   Send invoices via email as PDF attachments.
-   Role-based access control for secure invoice management.
-   User authentication with JSON Web Tokens (JWT).

## Prerequisites

Before running the application, ensure you have the following installed:

-   Node.js (v14.x or higher)
-   MongoDB (running instance or connection URL)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Nayan-Shrivastava/invoice-generator.git
```

2. Navigate to the project directory:

```bash
cd invoice-generator
```

3. Install dependencies using npm:

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory and add the following environment variables:

```
MONGODB_URL=YOUR_MONGODB_CONNECTION_URL
SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY
JWT_SECRET=YOUR_JWT_SECRET_KEY
```

-   Replace `YOUR_MONGODB_CONNECTION_URL` with your MongoDB connection URL.
-   Replace `YOUR_SENDGRID_API_KEY` with your SendGrid API key for sending emails.
-   Replace `YOUR_JWT_SECRET_KEY` with a secret key for JWT token generation.

## Running the Application

To start the application, use the following npm scripts:

-   For production:

```bash
npm start
```

-   For development (using nodemon for auto-restart):

```bash
npm run dev
```

## API Endpoints

The application provides the following API endpoints:

-   POST /login: User login with credentials (returns JWT token).
-   POST /create-user: Create a new user with different roles.
-   POST /reset-password: Reset user's password.
-   GET /get-user/:id: Retrieve a specific user by ID.
-   PATCH /make-admin: Promote a user to an Admin role.
-   PATCH /remove-admin: Demote an Admin to a Cashier role.
-   DELETE /delete-user/:id: Delete a user by ID.
-   POST /create: Create a new invoice.
-   GET /get: Retrieve invoices based on query parameters.
-   GET /get/:id: Retrieve a specific invoice by ID.
-   POST /send-invoice-email: Send an invoice via email as a PDF attachment.

## Contributing

If you want to contribute to this project, please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Bugs/Issues

If you encounter any bugs or have any issues, please report them on the [GitHub Issues](https://github.com/Nayan-Shrivastava/invoice-generator/issues) page.

## Contact

For any inquiries or questions, you can reach out to the project owner [@Nayan-Shrivastava](https://github.com/Nayan-Shrivastava).

Happy invoicing!
