const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema(
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
    visitDate: {
      type: Date,
      required: [true, 'Please provide a visit date'],
    },
    visitTime: {
      type: String,
      required: [true, 'Please provide a visit time slot'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

visitSchema.index({ tenantId: 1, visitDate: 1 });
visitSchema.index({ ownerId: 1, visitDate: 1 });
visitSchema.index({ propertyId: 1 });

module.exports = mongoose.model('Visit', visitSchema);
