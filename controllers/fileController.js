// controllers/fileController.js

const asyncHandler = require('express-async-handler');
const File = require('../models/fileModel');
const path = require('path');
const nodemailer = require('nodemailer');
const dbx = require('../config/dropbox'); // Import the Dropbox client
const upload = require('../config/multer')
const { isAdmin } = require('../middleware/authMiddleware');

// @desc Get all files or search results
// @route GET /files/dashboard
// @access private
const renderDashboard = asyncHandler(async (req, res) => {
  try {
    const query = req.query.query || ''; // Get search query from request
    let files;

    if (query) {
      files = await File.find({ title: new RegExp(query, 'i') }); // Search by title
    } else {
      files = await File.find({});
    }

    res.render('dashboard', { files, isAdmin: req.user.isAdmin, query }); // Pass query for search input value
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// @desc Search for file
// @route GET /files/search
// @access public
const searchFile = asyncHandler(async (req, res) => {
  try {
    const query = req.query.query || ''; // Default to empty string if no query parameter
    const files = await File.find({ title: new RegExp(query, 'i') }); // Search by title
    if (!files.length) {
      return res.status(404).json({ error: 'No files found' });
    }
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc Upload file
// @route POST /files/upload
// @access private
const uploadFile = asyncHandler(async (req, res) => {
  // Handling file upload with multer
  upload.single('file')(req, res, async (err) => {
    if (err) {
      req.flash('error_msg', err.message);
      return res.redirect('/files/dashboard');
    }

    const { title, description } = req.body;
    const uploadedBy = req.user ? req.user._id : null;

    if (!title || !description) {
      req.flash('error_msg', 'Title and description are required');
      return res.redirect('/files/dashboard');
    }

    try {
      // Upload file to Dropbox
      const fileContent = req.file.buffer;
      const dropboxResponse = await dbx.filesUpload({
        path: `/${req.file.originalname}`,
        contents: fileContent
      });

      // Save file information to database
      const file = new File({
        title,
        description,
        path: dropboxResponse.result.path_display, // Save Dropbox path
        uploadedBy
      });

      await file.save();
      req.flash('success_msg', 'File uploaded and saved successfully');
      res.redirect('/files/dashboard');
    } catch (err) {
      req.flash('error_msg', 'Failed. Re-upload file');
      res.redirect('/files/dashboard');
    }
  });
});


// @desc Download file
// @route GET /files/download/:id
// @access private
const downloadFile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const file = await File.findById(id);
    if (!file) {
      req.flash('error_msg', 'File not found');
      return res.redirect('/files/dashboard');
    }

    // Fetch file content from Dropbox
    const dropboxResponse = await dbx.filesDownload({ path: file.path });
    res.setHeader('Content-Disposition', `attachment; filename=${path.basename(file.path)}`);
    res.send(dropboxResponse.result.fileBinary);
    
    // Increment downloadCount
    file.downloadCount += 1;
    await file.save();
  } catch (error) {
    req.flash('error_msg', 'Error downloading file');
    res.redirect('/files/dashboard');
  }
});

// @desc Delete file
// @route DELETE /files/delete/:id
// @access private
const deleteFile = asyncHandler(async (req, res) => {
  try {
    // Find the file by ID
    const file = await File.findById(req.params.id);
    if (!file) {
      req.flash('error_msg', 'File not found');
      return res.redirect('/files/dashboard');
    }

    // Delete file from Dropbox
    await dbx.filesDelete({ path: file.path });

    // Delete the file record from the database
    const result = await File.findByIdAndDelete(req.params.id);
    if (!result) {
      req.flash('error_msg', 'Failed to delete file record from database');
      return res.redirect('/files/dashboard');
    }

    // Set success flash message and redirect
    req.flash('success_msg', 'File deleted successfully');
    res.redirect('/files/dashboard');
  } catch (err) {
    console.error('Error during file deletion:', err);
    req.flash('error_msg', 'Failed to delete file');
    res.redirect('/files/dashboard');
  }
});

// @desc Share file via email
// @route POST /files/share/:id
// @access private
const shareFile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { email } = req.body; // Ensure email is passed in the request

  try {
    const file = await File.findById(id);
    if (!file) {
      req.flash('error_msg', 'File not found');
      return res.redirect('/files/dashboard');
    }

    // Configure the email transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Set up email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `File: ${file.title}`,
      text: `You can download the file from the following link: ${req.protocol}://${req.get('host')}/files/download/${file._id}`
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Update share count in the database
    file.shareCount = (file.shareCount || 0) + 1;
    await file.save();

    // Set success flash message and redirect
    req.flash('success_msg', 'File shared successfully');
    res.redirect('/files/dashboard');
  } catch (error) {
    console.error('Error sharing file:', error);
    req.flash('error_msg', 'Error sharing file');
    res.redirect('/files/dashboard');
  }
});

module.exports = {
  searchFile,
  uploadFile,
  downloadFile,
  deleteFile,
  shareFile,
  renderDashboard
};
