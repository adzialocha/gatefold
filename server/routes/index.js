const express = require('express');

const apiRoutes = require('./api');
const homeRoutes = require('./home');
const tokensRoutes = require('./tokens');

const router = express.Router();

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/tokens', tokensRoutes);

router.use((req, res, next) => {
  res.render('404');
});

module.exports = router;
