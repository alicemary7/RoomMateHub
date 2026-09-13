const Review = require('../models/Review');
const Property = require('../models/Property');

/**
 * @desc    Add review for a property
 * @route   POST /api/reviews
 * @access  Private (Tenant)
 */
const createReview = async (req, res, next) => {
  try {
    const { propertyId, rating, comment } = req.body;

    if (!propertyId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide property ID, rating (1-5), and review comment',
      });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5',
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Check duplicate
    const existing = await Review.findOne({
      tenantId: req.user._id,
      propertyId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this property',
      });
    }

    const review = await Review.create({
      tenantId: req.user._id,
      propertyId,
      rating: numRating,
      comment,
    });

    const populatedReview = await Review.findById(review._id).populate(
      'tenantId',
      'name profileImage'
    );

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reviews for a specific property
 * @route   GET /api/properties/:propertyId/reviews
 * @access  Public
 */
const getPropertyReviews = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const reviews = await Review.find({ propertyId })
      .populate('tenantId', 'name profileImage')
      .sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) * 10) / 10
        : 5.0;

    res.json({
      success: true,
      data: {
        reviews,
        avgRating,
        totalReviews: reviews.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getPropertyReviews,
};
