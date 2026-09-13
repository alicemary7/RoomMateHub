const User = require('../models/User');
const Property = require('../models/Property');
const Report = require('../models/Report');
const Inquiry = require('../models/Inquiry');
const Visit = require('../models/Visit');

/**
 * @desc    Get Admin dashboard KPI statistics
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalTenants,
      totalOwners,
      totalProperties,
      pendingProperties,
      approvedProperties,
      rejectedProperties,
      totalReports,
      pendingReports,
      totalVisits,
      totalInquiries,
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      User.countDocuments({ role: 'tenant' }),
      User.countDocuments({ role: 'owner' }),
      Property.countDocuments(),
      Property.countDocuments({ status: 'Pending' }),
      Property.countDocuments({ status: 'Approved' }),
      Property.countDocuments({ status: 'Rejected' }),
      Report.countDocuments(),
      Report.countDocuments({ status: 'Pending' }),
      Visit.countDocuments(),
      Inquiry.countDocuments(),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalTenants,
        totalOwners,
        totalProperties,
        pendingProperties,
        approvedProperties,
        rejectedProperties,
        totalReports,
        pendingReports,
        totalVisits,
        totalInquiries,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users with search and role filter
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    const filter = {};

    if (role && role !== 'All') {
      filter.role = role;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
    }

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle user active/deactivated status
 * @route   PATCH /api/admin/users/:id/toggle-status
 * @access  Private (Admin)
 */
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate admin accounts',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve property listing
 * @route   PATCH /api/properties/:id/approve
 * @access  Private (Admin)
 */
const approveProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved' },
      { new: true }
    ).populate('ownerId', 'name email phone');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    res.json({
      success: true,
      message: 'Property approved successfully and is now publicly visible',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reject property listing
 * @route   PATCH /api/properties/:id/reject
 * @access  Private (Admin)
 */
const rejectProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected' },
      { new: true }
    ).populate('ownerId', 'name email phone');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    res.json({
      success: true,
      message: 'Property rejected',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle verified badge for property
 * @route   PATCH /api/admin/properties/:id/verify
 * @access  Private (Admin)
 */
const togglePropertyVerified = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    property.isVerified = !property.isVerified;
    await property.save();

    res.json({
      success: true,
      message: `Property verification status updated to ${property.isVerified ? 'Verified' : 'Unverified'}`,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all properties for admin moderation
 * @route   GET /api/admin/properties
 * @access  Private (Admin)
 */
const getAllPropertiesAdmin = async (req, res, next) => {
  try {
    const { status, city, search } = req.query;
    const filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (city && city !== 'All') {
      filter.city = { $regex: new RegExp(city, 'i') };
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: regex }, { address: regex }, { city: regex }];
    }

    const properties = await Property.find(filter)
      .populate('ownerId', 'name email phone profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  approveProperty,
  rejectProperty,
  togglePropertyVerified,
  getAllPropertiesAdmin,
};
