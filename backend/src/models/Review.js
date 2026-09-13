const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate review by same tenant on same property
reviewSchema.index({ tenantId: 1, propertyId: 1 }, { unique: true });
reviewSchema.index({ propertyId: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
