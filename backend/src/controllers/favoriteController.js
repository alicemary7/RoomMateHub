const Favorite = require('../models/Favorite');
const Property = require('../models/Property');

/**
 * @desc    Add property to favorites
 * @route   POST /api/favorites/:propertyId
 * @access  Private (Tenant)
 */
const addFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    const existing = await Favorite.findOne({
      userId: req.user._id,
      propertyId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Property already added to favorites',
      });
    }

    const favorite = await Favorite.create({
      userId: req.user._id,
      propertyId,
    });

    res.status(201).json({
      success: true,
      message: 'Added to favorites',
      data: favorite,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove property from favorites
 * @route   DELETE /api/favorites/:propertyId
 * @access  Private (Tenant)
 */
const removeFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const result = await Favorite.findOneAndDelete({
      userId: req.user._id,
      propertyId,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Favorite record not found',
      });
    }

    res.json({
      success: true,
      message: 'Removed from favorites',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's favorite properties
 * @route   GET /api/favorites
 * @access  Private (Tenant)
 */
const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .populate({
        path: 'propertyId',
        populate: {
          path: 'ownerId',
          select: 'name email phone profileImage',
        },
      })
      .sort({ createdAt: -1 });

    // Filter out any where property was deleted
    const validFavorites = favorites
      .filter((f) => f.propertyId !== null)
      .map((f) => ({
        favoriteId: f._id,
        savedAt: f.createdAt,
        ...f.propertyId.toObject(),
        isFavorited: true,
      }));

    res.json({
      success: true,
      data: validFavorites,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
};
