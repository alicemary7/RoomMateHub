const Property = require('../models/Property');

/**
 * Builds and executes property search and filtering query
 * @param {Object} queryParams - Express req.query
 * @param {boolean} isAdminOrOwner - whether to allow non-approved status
 */
const queryProperties = async (queryParams, isAdminOrOwner = false) => {
  const {
    city,
    search,
    minRent,
    maxRent,
    propertyType,
    roomType,
    genderPreference,
    furnishing,
    amenities,
    isVerified,
    status,
    sortBy,
    page = 1,
    limit = 12,
  } = queryParams;

  const filter = {};

  // Status filtering (default to 'Approved' for public search unless specified by admin/owner)
  if (!isAdminOrOwner) {
    filter.status = 'Approved';
  } else if (status) {
    filter.status = status;
  }

  // Location / City filter
  if (city && city.trim() !== '' && city !== 'All') {
    filter.city = { $regex: new RegExp(`^${city.trim()}`, 'i') };
  }

  // General text search (title, address, city, description)
  if (search && search.trim() !== '') {
    const searchRegex = new RegExp(search.trim(), 'i');
    filter.$or = [
      { title: searchRegex },
      { address: searchRegex },
      { city: searchRegex },
      { description: searchRegex },
    ];
  }

  // Rent Range
  if (minRent || maxRent) {
    filter.monthlyRent = {};
    if (minRent) filter.monthlyRent.$gte = Number(minRent);
    if (maxRent) filter.monthlyRent.$lte = Number(maxRent);
  }

  // Property Type
  if (propertyType && propertyType !== 'All') {
    if (Array.isArray(propertyType)) {
      filter.propertyType = { $in: propertyType };
    } else {
      filter.propertyType = propertyType;
    }
  }

  // Room Type
  if (roomType && roomType !== 'All') {
    if (Array.isArray(roomType)) {
      filter.roomType = { $in: roomType };
    } else {
      filter.roomType = roomType;
    }
  }

  // Gender Preference
  if (genderPreference && genderPreference !== 'All') {
    filter.genderPreference = genderPreference;
  }

  // Furnishing
  if (furnishing && furnishing !== 'All') {
    filter.furnishing = furnishing;
  }

  // Verified Only
  if (isVerified === 'true' || isVerified === true) {
    filter.isVerified = true;
  }

  // Amenities Filter (Property must contain all requested amenities)
  if (amenities) {
    const amenitiesList = Array.isArray(amenities)
      ? amenities
      : amenities.split(',').map((a) => a.trim());
    if (amenitiesList.length > 0) {
      filter.amenities = { $all: amenitiesList };
    }
  }

  // Sorting
  let sortOption = { createdAt: -1 };
  if (sortBy === 'price_asc') sortOption = { monthlyRent: 1 };
  if (sortBy === 'price_desc') sortOption = { monthlyRent: -1 };
  if (sortBy === 'newest') sortOption = { createdAt: -1 };
  if (sortBy === 'oldest') sortOption = { createdAt: 1 };

  // Pagination calculation
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
  const skip = (pageNum - 1) * limitNum;

  const total = await Property.countDocuments(filter);
  const properties = await Property.find(filter)
    .populate('ownerId', 'name email phone profileImage')
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  return {
    properties,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      hasMore: pageNum * limitNum < total,
    },
  };
};

module.exports = { queryProperties };
