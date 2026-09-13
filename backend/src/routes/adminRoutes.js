const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  togglePropertyVerified,
  getAllPropertiesAdmin,
} = require('../controllers/adminController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

router.use(authenticateUser, requireAdmin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.get('/properties', getAllPropertiesAdmin);
router.patch('/properties/:id/verify', togglePropertyVerified);

module.exports = router;
