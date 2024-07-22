const express = require('express');
const router = express.Router();
const { Authenticated, isAdmin } = require('../middleware/authMiddleware');
const {
    getFiles,
    searchFile,
    uploadFile,
    downloadFile,
    deleteFile,
    shareFile,
    renderDashboard
} = require('../controllers/fileController');

// Route to render the dashboard
router.get('/dashboard', Authenticated, renderDashboard);

// Route for file upload (Admin only)
router.post('/files/upload', Authenticated, isAdmin, uploadFile);

// Route for file deletion (Admin only)
router.delete('/files/delete/:id', Authenticated, isAdmin, deleteFile);

// Route for file download
router.get('/files/download/:id', Authenticated, downloadFile);

// Route for file sharing via email
router.post('/files/share/:id', Authenticated, shareFile);

// Route for file search
router.get('/files/search', Authenticated, searchFile);

module.exports = router;