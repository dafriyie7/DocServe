const express = require('express');
const router = express.Router();
const { getfiles } = require('../controllers/fileController');
const { authentication, isAdmin } = require('../middleware/permissions');

router.get('/dashboard', authentication, isAdmin, getfiles);
router.post('/upload');
router.get('/:id/download');
router.delete('/:id/delete');
router.post('/:id/email');

module.exports = router;