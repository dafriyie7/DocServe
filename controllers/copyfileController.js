const asyncHandler = require('express-async-handler');
const File = require('../models/fileModel');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

//render dashboard
const renderDashboard = asyncHandler(
  async (req, res) => {
  try {
    const files = await File.find({});
    res.render('dashboard', /*{ files, isAdmin: req.user.isAdmin }*/);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
}
)

// @desc Get all files
// @route GET /files
// @access public
const getFiles = asyncHandler(async (req, res) => {
  try {
    const files = await File.find({});
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
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
const uploadFile = asyncHandler(async (req, res, next) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/upload'); // Redirect back to the upload form
    }

    const { title, description } = req.body;
    const uploadedBy = req.user ? req.user._id : null; // Assuming req.user is set from authentication

    if (!title || !description) {
      req.flash('error', 'Title and description are required');
      return res.redirect('/upload');
    }

    try {
      const file = new File({
        title,
        description,
        path: req.file.path,
        uploadedBy
      });

      await file.save();
      req.flash('success', 'File uploaded and saved successfully');
      res.redirect('/upload');
    } catch (err) {
      req.flash('error', err.message);
      res.redirect('/upload');
    }
  });
});

// @desc Download file
// @route GET /files/download/:id
// @access private
const downloadFile = asyncHandler(async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    file.downloadCount += 1;
    await file.save();

    res.download(file.path);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc Delete file
// @route DELETE /files/delete/:id
// @access private
const deleteFile = asyncHandler(async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    fs.unlink(file.path, async (err) => {
      if (err) {
        return res.status(500).json({ error: 'File deletion error' });
      }

      await file.remove();
      res.status(200).json({ message: 'File deleted successfully' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc Share file via email
// @route POST /files/share/:id
// @access private
const shareFile = asyncHandler(async (req, res) => {
  try {
    const { recipientEmail, subject, text } = req.body;
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'your-email-service',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject,
      text,
      attachments: [{
        filename: path.basename(file.path),
        path: file.path
      }]
    };

    await transporter.sendMail(mailOptions);

    file.emailsSent += 1;
    await file.save();

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = {
  getFiles,
  searchFile,
  uploadFile,
  downloadFile,
  deleteFile,
  shareFile,
  renderDashboard
};