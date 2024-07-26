# DocServe

a platform designed to streamline file management and sharing.

Table of Contents

Description
Installation
Features
File Structure
Technologies Used

DESCRIPTION
....................................................

WEBSITE LINK: <https://docserve.onrender.com>

DocServe is a platform designed to streamline file management and sharing. This platform caters to both regular users and administrators, providing a comprehensive set of features to ensure efficient document handling and secure access.

INSTALLATION
..................................................

Prerequisites
. mongodb and mongo url
. email account
. dropbox api

Clone Repository
git clone <https://github.com/dafriyie7/DocServe.git>
cd DocServe

TO INSTALL DEPENDENCIES
run: npm install

SETUP YOUR .env FILE
PORT = 5000
MONGO_URL = your_mongo_url
SESSION_SECRET = your_session_secret
EMAIL_USER = your_email
EMAIL_PASS = your_email_password
DROPBOX_ACCESS_TOKEN = your_dropbox_access_token

Run the application
npm run dev

FEATURES
....................................................

1. User Authentication
Features:

Signup with email verification.
Login with email and password.
Reset password feature.
2. User Dashboard and File Feed
Features:

Display a feed of downloadable files.
Allow users to search the file server.
Admins can upload, download and delete files
3. Email Functionality
Features:

Allow users to send files to an email through the platform.

FILE STRUCTURE
├── config/                     // Configuration files
│   └── db.js                   // Database connection setup
├── controllers/                // Controllers for handling business logic
│   ├── authController.js       // Controller for authentication related actions
│   ├── adminController.js      // Controller for admin related actions
│   └── fileController.js       // Controller for file handling actions
├── middleware/                 // Middleware functions
│   ├── authMiddleware.js       // Middleware for authentication and authorization
│   └── errorMiddleware.js      // Middleware for handling errors
├── models/                     // Mongoose models for MongoDB
│   ├── userModel.js            // User schema and model definition
│   └── fileModel.js            // File schema and model definition
├── routes/                     // Express routes
│   ├── authRoutes.js           // Routes for authentication (signup, login, reset password)
│   ├── fileRoutes.js           // Routes for handling files (upload, download, delete)
│   └── adminRoutes.js          // Routes for admin operations
├── views/                      // EJS view templates
│   ├── login.ejs               // Login page template
│   ├── signup.ejs              // Signup page template
│   ├── resetPassword.ejs       // Reset password page template
│   ├── files/                  // File-related view templates
│   │   ├── upload.ejs          // File upload page template
│   │   ├── list.ejs            // List of files page template
│   │   ├── details.ejs         // File details page template
│   │   └── edit.ejs            // Edit file details page template
├── public/                     // Public static assets
│   ├── style.css               // CSS styles
│   └── scripts.js              // Client-side JavaScript
├── .env                        // Environment variables configuration
├── server.js                   // Main server file
├── package.json                // Node.js project configuration
└── README.md                   // Project documentation and instructions

Technologies used
Node.js
Express.js
Mongoose
Passport.js
bcryptjs
Multer
Dropbox SDK
express-session
connect-mongo
dotenv
uuid
got
method-override
nodemailer
EJS
connect-flash
cors
nodemon
