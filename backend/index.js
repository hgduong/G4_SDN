const express = require('express');
const router = express.Router();

// Basic health check and placeholder route. Replace or extend routes as needed.
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;
