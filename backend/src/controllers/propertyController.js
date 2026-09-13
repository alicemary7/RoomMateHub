const Property = require('../models/Property');
const Review = require('../models/Review');
const Favorite = require('../models/Favorite');
const { queryProperties } = require('../services/propertyService');
const { uploadPropertyImages, deletePropertyImages } = require('../services/storageService');

/**
 * @desc    Get all properties with filtering, search, pagination
 * @route   GET /api/properties
 * @access  Public
 */
const getProperties = async (req, res, next) => {
  try {
    const result = await queryProperties(req.query, false);

    // If user is logged in, attach isFavorited status
    let userFavorites = new Set();
    if (req.user) {
      const favs = await Favorite.find({ userId: req.user._id }).select('propertyId');
      userFavorites = new Set(favs.map((f) => f.propertyId.toString()));
    }

    // Attach calculated review stats and isFavorited
    const propertyIds = result.properties.map((p) => p._id);
    const reviews = await Review.aggregate([
      { $match: { propertyId: { $in: propertyIds } } },
      {
        $group: {
          _id: '$propertyId',
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const reviewMap = new Map();
    reviews.forEach((r) => {
      reviewMap.set(r._id.toString(), {
        avgRating: Math.round(r.avgRating * 10) / 10,
        totalReviews: r.totalReviews,
      });
    });

    const enhancedProperties = result.properties.map((prop) => {
      const pObj = prop.toObject();
      const stats = reviewMap.get(prop._id.toString()) || { avgRating: 4.8, totalReviews: 0 };
      pObj.avgRating = stats.avgRating;
      pObj.totalReviews = stats.totalReviews;
      pObj.isFavorited = userFavorites.has(prop._id.toString());
      return pObj;
    });

    res.json({
      success: true,
      data: enhancedProperties,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single property by ID
 * @route   GET /api/properties/:id
 * @access  Public
 */
const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('ownerId', 'name email phone profileImage createdAt');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Calculate rating and fetch reviews
    const reviews = await Review.find({ propertyId: property._id })
      .populate('tenantId', 'name profileImage')
      .sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) * 10) / 10
        : 5.0;

    let isFavorited = false;
    if (req.user) {
      const fav = await Favorite.findOne({
        userId: req.user._id,
        propertyId: property._id,
      });
      isFavorited = Boolean(fav);
    }

    const pObj = property.toObject();
    pObj.reviews = reviews;
    pObj.avgRating = avgRating;
    pObj.totalReviews = reviews.length;
    pObj.isFavorited = isFavorited;

    res.json({
      success: true,
      data: pObj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current owner's properties
 * @route   GET /api/properties/my-properties
 * @access  Private (Owner)
 */
const getMyProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ ownerId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new property listing
 * @route   POST /api/properties
 * @access  Private (Owner)
 */
const createProperty = async (req, res, next) => {
  try {
    const {
      title,
      description,
      propertyType,
      roomType,
      genderPreference,
      monthlyRent,
      securityDeposit,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      amenities,
      furnishing,
      availableFrom,
      existingImages,
    } = req.body;

    let amenitiesArr = [];
    if (amenities) {
      amenitiesArr = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
    }

    let initialImages = [];
    if (existingImages) {
      initialImages = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
    }

    // Default sample image if none provided
    if ((!req.files || req.files.length === 0) && initialImages.length === 0) {
      initialImages.push({
        url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
        storagePath: 'defaults/sample-room.jpg',
      });
    }

    // Create property in Mongo first to get ID
    const property = new Property({
      ownerId: req.user._id,
      title,
      description,
      propertyType,
      roomType,
      genderPreference: genderPreference || 'Any',
      monthlyRent: Number(monthlyRent),
      securityDeposit: Number(securityDeposit || 0),
      address,
      city,
      state: state || 'Tamil Nadu',
      pincode: pincode || '',
      latitude: Number(latitude || 13.0827),
      longitude: Number(longitude || 80.2707),
      amenities: amenitiesArr,
      furnishing: furnishing || 'Semi-Furnished',
      availableFrom: availableFrom || Date.now(),
      images: initialImages,
      status: 'Pending',
      isVerified: false,
    });

    await property.save();

    // If files are uploaded via Multer, upload them to Supabase Storage
    if (req.files && req.files.length > 0) {
      const uploadedImages = await uploadPropertyImages(req.files, property._id.toString());
      property.images = [...property.images, ...uploadedImages];
      await property.save();
    }

    res.status(201).json({
      success: true,
      message: 'Property created successfully. Pending admin approval.',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update property listing
 * @route   PUT /api/properties/:id
 * @access  Private (Owner / Admin)
 */
const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Authorization check
    if (
      property.ownerId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property',
      });
    }

    const {
      title,
      description,
      propertyType,
      roomType,
      genderPreference,
      monthlyRent,
      securityDeposit,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      amenities,
      furnishing,
      availableFrom,
      status,
      isVerified,
      existingImages,
    } = req.body;

    if (title) property.title = title;
    if (description) property.description = description;
    if (propertyType) property.propertyType = propertyType;
    if (roomType) property.roomType = roomType;
    if (genderPreference) property.genderPreference = genderPreference;
    if (monthlyRent !== undefined) property.monthlyRent = Number(monthlyRent);
    if (securityDeposit !== undefined) property.securityDeposit = Number(securityDeposit);
    if (address) property.address = address;
    if (city) property.city = city;
    if (state) property.state = state;
    if (pincode) property.pincode = pincode;
    if (latitude) property.latitude = Number(latitude);
    if (longitude) property.longitude = Number(longitude);
    if (furnishing) property.furnishing = furnishing;
    if (availableFrom) property.availableFrom = availableFrom;

    if (amenities) {
      property.amenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
    }

    // Retain existing selected images
    if (existingImages) {
      const parsedExisting = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
      property.images = parsedExisting;
    }

    // Upload new files if uploaded
    if (req.files && req.files.length > 0) {
      const uploadedImages = await uploadPropertyImages(req.files, property._id.toString());
      property.images = [...property.images, ...uploadedImages];
    }

    // Status / verification updates (if owner changes details, resets to Pending unless Admin updates)
    if (req.user.role === 'admin') {
      if (status) property.status = status;
      if (isVerified !== undefined) property.isVerified = isVerified;
    }

    await property.save();

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete property
 * @route   DELETE /api/properties/:id
 * @access  Private (Owner / Admin)
 */
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    if (
      property.ownerId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property',
      });
    }

    // Clean up Supabase images
    if (property.images && property.images.length > 0) {
      await deletePropertyImages(property.images);
    }

    await Property.findByIdAndDelete(req.params.id);

    // Clean up associated favorites & reviews
    await Favorite.deleteMany({ propertyId: req.params.id });
    await Review.deleteMany({ propertyId: req.params.id });

    res.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  getMyProperties,
  createProperty,
  updateProperty,
  deleteProperty,
};
