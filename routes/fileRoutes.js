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

router.get('/dashboard', Authenticated, renderDashboard);
router.post('/files/upload', Authenticated, isAdmin, uploadFile);
router.delete('/files/delete/:id', Authenticated, isAdmin, deleteFile);
router.get('/files/download/:id', Authenticated, downloadFile);
router.post('/files/share/:id', Authenticated, shareFile);
router.get('/files/search', Authenticated, searchFile);

module.exports = router;