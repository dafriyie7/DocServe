const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const path = require('path');
const errorHandler = require('./middleware/errorMiddleware');
const passport = require('./config/passport');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
const methodOverride = require('method-override');

// Connect to the database
connectDB();

const app = express();

// Middleware for CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Method Override Middleware for handling HTTP methods like PUT and DELETE
app.use(methodOverride('_method'));

// Session configuration for user sessions
app.use(session({
  secret: process.env.SESSION_SECRET, // Session secret for signing cookies
  resave: false, // Don't save session if unmodified
  saveUninitialized: true, // Save a session that is new but not modified
}));

// Initialize Passport and use sessions
app.use(passport.initialize());
app.use(passport.session());

// Flash messages for displaying notifications
app.use(flash());

// Middleware to set flash messages in locals for views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Middleware to set user information in locals for views
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Directory for view templates

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Default route to redirect to the files dashboard
app.get('/', (req, res) => {
  res.redirect('/files/dashboard');
});

// Route handling
app.use('/auth', authRoutes);
app.use('/files', fileRoutes);

// Error handler middleware for handling errors
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));