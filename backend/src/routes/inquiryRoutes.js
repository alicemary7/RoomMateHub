const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getMyInquiries,
  getOwnerInquiries,
  respondInquiry,
  closeInquiry,
} = require('../controllers/inquiryController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { requireTenant, requireOwner } = require('../middleware/roleMiddleware');

router.use(authenticateUser);

router.post('/', requireTenant, createInquiry);
router.get('/my', requireTenant, getMyInquiries);
router.get('/owner', requireOwner, getOwnerInquiries);
router.patch('/:id/respond', requireOwner, respondInquiry);
router.patch('/:id/close', closeInquiry);

module.exports = router;
