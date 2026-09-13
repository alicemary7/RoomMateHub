const { uploadFile, deleteFile } = require('../config/supabase');

/**
 * Upload multiple property images to Supabase Storage
 * @param {Array<Express.Multer.File>} files
 * @param {string} propertyId
 * @returns {Promise<Array<{url: string, storagePath: string}>>}
 */
const uploadPropertyImages = async (files, propertyId) => {
  if (!files || files.length === 0) return [];

  const uploadPromises = files.map(async (file, index) => {
    const ext = file.originalname.split('.').pop() || 'jpg';
    const filename = `property_${propertyId}_${Date.now()}_${index}.${ext}`;
    const storagePath = `properties/${propertyId}/${filename}`;

    const uploaded = await uploadFile(
      'property-images',
      storagePath,
      file.buffer,
      file.mimetype
    );

    return uploaded;
  });

  return await Promise.all(uploadPromises);
};

/**
 * Upload single user profile image
 * @param {Express.Multer.File} file
 * @param {string} userId
 * @returns {Promise<{url: string, storagePath: string}>}
 */
const uploadProfileImage = async (file, userId) => {
  if (!file) return null;

  const ext = file.originalname.split('.').pop() || 'jpg';
  const filename = `user_${userId}_${Date.now()}.${ext}`;
  const storagePath = `profiles/${userId}/${filename}`;

  return await uploadFile(
    'profile-images',
    storagePath,
    file.buffer,
    file.mimetype
  );
};

/**
 * Delete an array of property images
 * @param {Array<{storagePath: string}>} images
 */
const deletePropertyImages = async (images) => {
  if (!images || !Array.isArray(images)) return;

  const deletePromises = images.map((img) => {
    if (img.storagePath) {
      return deleteFile('property-images', img.storagePath);
    }
    return Promise.resolve();
  });

  await Promise.all(deletePromises);
};

module.exports = {
  uploadPropertyImages,
  uploadProfileImage,
  deletePropertyImages,
};
