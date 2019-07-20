const express = require('express');

const apiController = require('../controllers/api');

const router = express.Router();

router
  .get('/airports', apiController.findAirports);

router
  .get('/airports/:id', apiController.findAirportById);

module.exports = router;
