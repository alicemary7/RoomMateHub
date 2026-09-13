const express = require('express');
const router = express.Router();
const {
  createVisit,
  getMyVisits,
  getOwnerVisits,
  acceptVisit,
  rejectVisit,
  completeVisit,
  cancelVisit,
} = require('../controllers/visitController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { requireTenant, requireOwner } = require('../middleware/roleMiddleware');

router.use(authenticateUser);

router.post('/', requireTenant, createVisit);
router.get('/my', requireTenant, getMyVisits);
router.get('/owner', requireOwner, getOwnerVisits);
router.patch('/:id/accept', requireOwner, acceptVisit);
router.patch('/:id/reject', requireOwner, rejectVisit);
router.patch('/:id/complete', completeVisit);
router.patch('/:id/cancel', cancelVisit);

module.exports = router;
