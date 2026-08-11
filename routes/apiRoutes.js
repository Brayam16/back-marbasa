const express = require('express');
const { status, echo } = require('../controllers/apiController');

const router = express.Router();

router.get('/status', status);
router.post('/echo', echo);

module.exports = router;
