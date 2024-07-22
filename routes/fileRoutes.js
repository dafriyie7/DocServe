const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const {
    getFiles,
    searchFile,
    uploadFile,
    downloadFile,
    deleteFile,
    shareFile
} = require('../controllers/fileController');

// Route to render the dashboard
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const files = await File.find({});
    res.render('dashboard', { files, isAdmin: req.user.isAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Route for file upload (Admin only)
router.post('/files/upload', isAuthenticated, isAdmin, uploadFile);

// Route for file deletion (Admin only)
router.delete('/files/delete/:id', isAuthenticated, isAdmin, deleteFile);

// Route for file download
router.get('/files/download/:id', isAuthenticated, downloadFile);

// Route for file sharing via email
router.post('/files/share/:id', isAuthenticated, shareFile);

// Route for file search
router.get('/files/search', isAuthenticated, searchFile);

module.exports = router;