const express = require('express');
const router = express.Router();
const {
  createReport,
  getReports,
  resolveReport,
  rejectReport,
} = require('../controllers/reportController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

router.use(authenticateUser);

// Any authenticated user can submit a report
router.post('/', createReport);

// Admin-only management
router.get('/', requireAdmin, getReports);
router.patch('/:id/resolve', requireAdmin, resolveReport);
router.patch('/:id/reject', requireAdmin, rejectReport);

module.exports = router;
