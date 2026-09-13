const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide an inquiry message'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Responded', 'Closed'],
      default: 'Pending',
    },
    ownerResponse: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

inquirySchema.index({ tenantId: 1, createdAt: -1 });
inquirySchema.index({ ownerId: 1, createdAt: -1 });
inquirySchema.index({ propertyId: 1 });

module.exports = mongoose.model('Inquiry', inquirySchema);
