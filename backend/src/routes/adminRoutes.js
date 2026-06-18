const express = require('express');
const router = express.Router();
const { protect, requireAdmin } = require('../middleware/auth');
const {
  listUsers,
  setUserActiveStatus,
  platformStats,
  setUserRole,
} = require('../controllers/adminController');

router.get('/users', protect, requireAdmin, listUsers);
router.patch('/users/:id/status', protect, requireAdmin, setUserActiveStatus);
router.patch('/users/:id/role', protect, requireAdmin, setUserRole);
router.get('/stats', protect, requireAdmin, platformStats);

module.exports = router;
