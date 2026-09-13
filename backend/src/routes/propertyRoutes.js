const express = require('express');
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  getMyProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController');
const {
  approveProperty,
  rejectProperty,
} = require('../controllers/adminController');
const { authenticateUser, optionalAuth } = require('../middleware/authMiddleware');
const { requireOwner, requireAdmin } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public listing with optional user context for favorites
router.get('/', optionalAuth, getProperties);

// Owner's properties (must precede /:id)
router.get('/my-properties', authenticateUser, requireOwner, getMyProperties);

// Specific property details
router.get('/:id', optionalAuth, getPropertyById);

// Owner property creation with multiple images upload
router.post(
  '/',
  authenticateUser,
  requireOwner,
  upload.array('images', 10),
  createProperty
);

// Update property (Owner / Admin)
router.put(
  '/:id',
  authenticateUser,
  upload.array('images', 10),
  updateProperty
);

// Delete property (Owner / Admin)
router.delete('/:id', authenticateUser, deleteProperty);

// Admin approval endpoints
router.patch('/:id/approve', authenticateUser, requireAdmin, approveProperty);
router.patch('/:id/reject', authenticateUser, requireAdmin, rejectProperty);

module.exports = router;
