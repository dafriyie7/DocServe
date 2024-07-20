# DocServe

A document sharing platform using express.js, mongodb and ejs

DocServe is a robust document distribution platform designed to streamline file management and sharing. This platform caters to both regular users and administrators, providing a comprehensive set of features to ensure efficient document handling and secure access.

Key Features
....................................................

1. User Authentication
Features:

Signup with email verification.
Login with email and password.
Reset password feature.
Implementation Steps:

Use Passport.js for authentication and session management.
Implement routes and controllers for user signup, login, password reset, and email verification.
Store user data in MongoDB, including hashed passwords.
2. User Dashboard and File Feed
Features:

Display a feed of downloadable files.
Allow users to search the file server.
Implementation Steps:

Create routes and controllers to handle file retrieval and searching.
Use MongoDB to store file metadata (title, description, download count).
Implement views (using EJS or similar) to render the file feed and search results.
3. Email Functionality
Features:

Allow users to send files to an email through the platform.
Implementation Steps:

Use an email service provider like SendGrid to handle email sending.
Implement routes and controllers to handle file sending via email.
4. Admin Functionalities
Features:

Upload files with title and description.
View download and email send statistics for each file.
Implementation Steps:

Implement admin routes and controllers for file upload and statistics retrieval.
Secure admin routes using authentication middleware (to ensure only admins can access).

APIs

userRoutes
................................................
Purpose: Handles user authentication and management.

Routes:

POST /user/signup: For user signup.
POST /user/login: For user login.
PUT /user/resetPassword: For password reset.
GET /user/login: Render login page.
GET /user/signup: Render signup page.
Controller Methods: Functions to handle signup, login, and password reset logic.

Middleware: May include middleware for input validation, authentication, etc.

fileRoutes  FILE ROUTES
.................................................
Purpose: Handles file operations such as uploading, retrieving, updating, and deleting files.

Routes:

GET /files: Get all files.
POST /files: Upload a new file.
GET /files/:id: Get a specific file by ID.
PUT /files/:id: Update a file by ID.
DELETE /api/files/:id: Delete a file by ID.
Middleware: Uses multer for handling file uploads, can also include middleware for authentication, input validation, etc.

ADMIN IMPLEMENTATION
..................................................

Implementation Steps
Add a Role to the User Model: Add an isAdmin field to the user model to differentiate between admin and regular users.

Create Middleware for Role-Based Access Control: Create middleware to check if the user has admin privileges.

Use the Middleware in Routes: Apply the middleware to routes that require admin access.
