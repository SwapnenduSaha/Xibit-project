const express = require('express');
const router = express.Router();
const { getSpecialistInfo } = require('../controllers/symptomController');

// Handling POST request on /api/symptoms
router.post('/', getSpecialistInfo);

module.exports = router;
