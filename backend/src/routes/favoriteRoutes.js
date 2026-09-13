const express = require('express');
const router = express.Router();
const {
  addFavorite,
  removeFavorite,
  getFavorites,
} = require('../controllers/favoriteController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { requireTenant } = require('../middleware/roleMiddleware');

router.use(authenticateUser);

router.get('/', requireTenant, getFavorites);
router.post('/:propertyId', requireTenant, addFavorite);
router.delete('/:propertyId', requireTenant, removeFavorite);

module.exports = router;
