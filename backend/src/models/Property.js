const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a property title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
    },
    propertyType: {
      type: String,
      enum: ['PG', 'Hostel', 'Apartment', 'House', 'Shared Room'],
      required: [true, 'Please select a property type'],
    },
    roomType: {
      type: String,
      enum: ['Single', 'Double Sharing', 'Triple Sharing', 'Multiple Sharing'],
      required: [true, 'Please select a room type'],
    },
    genderPreference: {
      type: String,
      enum: ['Male', 'Female', 'Any'],
      default: 'Any',
    },
    monthlyRent: {
      type: Number,
      required: [true, 'Please provide monthly rent'],
      min: [0, 'Monthly rent must be a positive number'],
    },
    securityDeposit: {
      type: Number,
      default: 0,
      min: [0, 'Security deposit must be positive'],
    },
    address: {
      type: String,
      required: [true, 'Please provide property address'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true,
    },
    state: {
      type: String,
      default: 'Tamil Nadu',
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    latitude: {
      type: Number,
      default: 13.0827,
    },
    longitude: {
      type: Number,
      default: 80.2707,
    },
    amenities: {
      type: [String],
      default: [],
    },
    furnishing: {
      type: String,
      enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
      default: 'Semi-Furnished',
    },
    availableFrom: {
      type: Date,
      default: Date.now,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        storagePath: {
          type: String,
          default: '',
        },
      },
    ],
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Unavailable'],
      default: 'Pending',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// MongoDB indexes for performant search & filtering
propertySchema.index({ city: 1 });
propertySchema.index({ monthlyRent: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ roomType: 1 });
propertySchema.index({ genderPreference: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ isVerified: 1 });
propertySchema.index({ createdAt: -1 });

// Virtual for reviews calculation
propertySchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'propertyId',
  justOne: false,
});

module.exports = mongoose.model('Property', propertySchema);
