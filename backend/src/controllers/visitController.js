const Visit = require('../models/Visit');
const Property = require('../models/Property');

/**
 * @desc    Schedule a property visit
 * @route   POST /api/visits
 * @access  Private (Tenant)
 */
const createVisit = async (req, res, next) => {
  try {
    const { propertyId, visitDate, visitTime, notes } = req.body;

    if (!propertyId || !visitDate || !visitTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide property ID, visit date, and preferred time slot',
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    if (property.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot schedule a visit on your own property',
      });
    }

    const visit = await Visit.create({
      tenantId: req.user._id,
      ownerId: property.ownerId,
      propertyId: property._id,
      visitDate: new Date(visitDate),
      visitTime,
      notes: notes || '',
      status: 'Pending',
    });

    const populatedVisit = await Visit.findById(visit._id)
      .populate('propertyId', 'title address city monthlyRent images')
      .populate('ownerId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Visit request submitted. Waiting for owner confirmation.',
      data: populatedVisit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged in tenant's visits
 * @route   GET /api/visits/my
 * @access  Private (Tenant)
 */
const getMyVisits = async (req, res, next) => {
  try {
    const visits = await Visit.find({ tenantId: req.user._id })
      .populate('propertyId', 'title address city monthlyRent images roomType propertyType')
      .populate('ownerId', 'name email phone profileImage')
      .sort({ visitDate: 1 });

    res.json({
      success: true,
      data: visits,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get owner's visit requests
 * @route   GET /api/visits/owner
 * @access  Private (Owner)
 */
const getOwnerVisits = async (req, res, next) => {
  try {
    const visits = await Visit.find({ ownerId: req.user._id })
      .populate('propertyId', 'title address city monthlyRent images')
      .populate('tenantId', 'name email phone profileImage')
      .sort({ visitDate: 1 });

    res.json({
      success: true,
      data: visits,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Owner accepts a visit request
 * @route   PATCH /api/visits/:id/accept
 * @access  Private (Owner)
 */
const acceptVisit = async (req, res, next) => {
  try {
    const visit = await Visit.findById(req.params.id);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: 'Visit not found',
      });
    }

    if (visit.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to manage this visit',
      });
    }

    visit.status = 'Accepted';
    await visit.save();

    res.json({
      success: true,
      message: 'Visit request accepted',
      data: visit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Owner rejects a visit request
 * @route   PATCH /api/visits/:id/reject
 * @access  Private (Owner)
 */
const rejectVisit = async (req, res, next) => {
  try {
    const visit = await Visit.findById(req.params.id);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: 'Visit not found',
      });
    }

    if (visit.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to manage this visit',
      });
    }

    visit.status = 'Rejected';
    await visit.save();

    res.json({
      success: true,
      message: 'Visit request rejected',
      data: visit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark visit as completed
 * @route   PATCH /api/visits/:id/complete
 * @access  Private (Owner / Tenant)
 */
const completeVisit = async (req, res, next) => {
  try {
    const visit = await Visit.findById(req.params.id);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: 'Visit not found',
      });
    }

    const isAuthorized =
      visit.ownerId.toString() === req.user._id.toString() ||
      visit.tenantId.toString() === req.user._id.toString();

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this visit',
      });
    }

    visit.status = 'Completed';
    await visit.save();

    res.json({
      success: true,
      message: 'Visit marked as completed',
      data: visit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel visit request
 * @route   PATCH /api/visits/:id/cancel
 * @access  Private (Tenant / Owner)
 */
const cancelVisit = async (req, res, next) => {
  try {
    const visit = await Visit.findById(req.params.id);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: 'Visit not found',
      });
    }

    const isAuthorized =
      visit.ownerId.toString() === req.user._id.toString() ||
      visit.tenantId.toString() === req.user._id.toString();

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this visit',
      });
    }

    visit.status = 'Cancelled';
    await visit.save();

    res.json({
      success: true,
      message: 'Visit cancelled',
      data: visit,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVisit,
  getMyVisits,
  getOwnerVisits,
  acceptVisit,
  rejectVisit,
  completeVisit,
  cancelVisit,
};
