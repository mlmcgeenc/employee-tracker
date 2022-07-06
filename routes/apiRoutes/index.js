const express = require('express');
const router = express.Router();

router.use(require('./apiRoutes'));

module.exports = router;
