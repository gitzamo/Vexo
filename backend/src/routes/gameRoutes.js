const express = require('express');
const router = express.Router();
const { protect, requireAdmin } = require('../middleware/auth');
const { listGames, createGame, updateGame } = require('../controllers/gameController');

router.get('/', listGames);
router.post('/', protect, requireAdmin, createGame);
router.put('/:id', protect, requireAdmin, updateGame);

module.exports = router;
