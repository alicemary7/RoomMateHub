const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

/**
 * @desc    Create new inquiry for a property
 * @route   POST /api/inquiries
 * @access  Private (Tenant)
 */
const createInquiry = async (req, res, next) => {
  try {
    const { propertyId, message } = req.body;

    if (!propertyId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide property ID and your message',
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Prevent owner from inquiring on their own property
    if (property.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send an inquiry on your own property',
      });
    }

    const inquiry = await Inquiry.create({
      tenantId: req.user._id,
      ownerId: property.ownerId,
      propertyId: property._id,
      message,
      status: 'Pending',
    });

    const populatedInquiry = await Inquiry.findById(inquiry._id)
      .populate('propertyId', 'title address city monthlyRent images')
      .populate('ownerId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Inquiry sent successfully to owner',
      data: populatedInquiry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current tenant's inquiries
 * @route   GET /api/inquiries/my
 * @access  Private (Tenant)
 */
const getMyInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({ tenantId: req.user._id })
      .populate('propertyId', 'title address city monthlyRent images roomType propertyType')
      .populate('ownerId', 'name email phone profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get inquiries received by property owner
 * @route   GET /api/inquiries/owner
 * @access  Private (Owner)
 */
const getOwnerInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({ ownerId: req.user._id })
      .populate('propertyId', 'title address city monthlyRent images')
      .populate('tenantId', 'name email phone profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Owner responds to an inquiry
 * @route   PATCH /api/inquiries/:id/respond
 * @access  Private (Owner)
 */
const respondInquiry = async (req, res, next) => {
  try {
    const { ownerResponse } = req.body;

    if (!ownerResponse) {
      return res.status(400).json({
        success: false,
        message: 'Response message is required',
      });
    }

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    if (inquiry.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this inquiry',
      });
    }

    inquiry.ownerResponse = ownerResponse;
    inquiry.status = 'Responded';
    await inquiry.save();

    res.json({
      success: true,
      message: 'Response sent to tenant',
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Close an inquiry
 * @route   PATCH /api/inquiries/:id/close
 * @access  Private (Tenant / Owner)
 */
const closeInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    const isAuthorized =
      inquiry.tenantId.toString() === req.user._id.toString() ||
      inquiry.ownerId.toString() === req.user._id.toString();

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to close this inquiry',
      });
    }

    inquiry.status = 'Closed';
    await inquiry.save();

    res.json({
      success: true,
      message: 'Inquiry closed',
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInquiry,
  getMyInquiries,
  getOwnerInquiries,
  respondInquiry,
  closeInquiry,
};
