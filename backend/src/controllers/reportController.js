const Report = require('../models/Report');
const Property = require('../models/Property');

/**
 * @desc    Submit a report against a property listing
 * @route   POST /api/reports
 * @access  Private (Tenant / Owner)
 */
const createReport = async (req, res, next) => {
  try {
    const { propertyId, reason, description } = req.body;

    if (!propertyId || !reason || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide property ID, reason, and detailed description',
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    const report = await Report.create({
      reportedBy: req.user._id,
      propertyId,
      reason,
      description,
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted. Our moderation team will investigate.',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reports
 * @route   GET /api/reports
 * @access  Private (Admin)
 */
const getReports = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'All') {
      filter.status = status;
    }

    const reports = await Report.find(filter)
      .populate('reportedBy', 'name email phone profileImage')
      .populate({
        path: 'propertyId',
        select: 'title address city monthlyRent images status isVerified ownerId',
        populate: {
          path: 'ownerId',
          select: 'name email phone',
        },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Resolve a report
 * @route   PATCH /api/reports/:id/resolve
 * @access  Private (Admin)
 */
const resolveReport = async (req, res, next) => {
  try {
    const { adminResponse, removeProperty } = req.body;

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    report.status = 'Resolved';
    report.adminResponse = adminResponse || 'Issue resolved by administration.';
    await report.save();

    // If admin requested property deactivation / rejection
    if (removeProperty && report.propertyId) {
      await Property.findByIdAndUpdate(report.propertyId, {
        status: 'Rejected',
      });
    }

    res.json({
      success: true,
      message: 'Report marked as resolved',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reject / Dismiss a report
 * @route   PATCH /api/reports/:id/reject
 * @access  Private (Admin)
 */
const rejectReport = async (req, res, next) => {
  try {
    const { adminResponse } = req.body;

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    report.status = 'Rejected';
    report.adminResponse = adminResponse || 'Report dismissed after review.';
    await report.save();

    res.json({
      success: true,
      message: 'Report dismissed',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReport,
  getReports,
  resolveReport,
  rejectReport,
};
