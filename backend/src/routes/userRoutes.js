const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  updateProfile,
  setPreferredGames,
  setAvailability,
  getUserProfile,
  searchPlayers,
  getMatchHistory,
} = require('../controllers/userController');

router.put('/me', protect, updateProfile);
router.put('/me/games', protect, setPreferredGames);
router.put('/me/availability', protect, setAvailability);
router.get('/me/history', protect, getMatchHistory);
router.get('/search', protect, searchPlayers);
router.get('/:id', protect, getUserProfile);

module.exports = router;
