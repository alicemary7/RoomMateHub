const express = require('express');
const router = express.Router();
const {
  createReview,
  getPropertyReviews,
} = require('../controllers/reviewController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { requireTenant } = require('../middleware/roleMiddleware');

// Post a review (Authenticated Tenants only)
router.post('/', authenticateUser, requireTenant, createReview);

// Public get reviews for a property
router.get('/:propertyId', getPropertyReviews);

module.exports = router;
