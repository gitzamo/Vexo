const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  sendRequest,
  respondToRequest,
  listMyRequests,
} = require('../controllers/playRequestController');

router.post('/', protect, sendRequest);
router.get('/', protect, listMyRequests);
router.patch('/:id/status', protect, respondToRequest);

module.exports = router;
