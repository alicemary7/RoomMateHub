const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes('xyzcompany') &&
  !supabaseKey.includes('dummy')
);

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log('[Supabase] Initialized Supabase client successfully');
  } catch (err) {
    console.warn('[Supabase] Failed to initialize Supabase client:', err.message);
  }
} else {
  console.log('[Supabase] Running with mock/local file storage fallback (Set real SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env for production)');
}

/**
 * Uploads a file buffer to Supabase Storage or fallback storage
 * @param {string} bucket - 'property-images' or 'profile-images'
 * @param {string} storagePath - e.g., 'properties/123/image-1.jpg'
 * @param {Buffer} fileBuffer - Buffer from Multer
 * @param {string} mimeType - e.g., 'image/jpeg'
 * @returns {Promise<{ url: string, storagePath: string }>}
 */
const uploadFile = async (bucket, storagePath, fileBuffer, mimeType = 'image/jpeg') => {
  if (supabase && isSupabaseConfigured) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Supabase Storage error: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath);

    return {
      url: publicUrlData.publicUrl,
      storagePath,
    };
  }

  // Fallback: Store locally in public/uploads and return accessible URL
  const uploadDir = path.join(__dirname, '../../public/uploads', bucket);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const safeFileName = `${Date.now()}-${path.basename(storagePath)}`;
  const localFilePath = path.join(uploadDir, safeFileName);
  fs.writeFileSync(localFilePath, fileBuffer);

  const port = process.env.PORT || 5000;
  const publicUrl = `http://localhost:${port}/uploads/${bucket}/${safeFileName}`;

  return {
    url: publicUrl,
    storagePath: `${bucket}/${safeFileName}`,
  };
};

/**
 * Deletes a file from Supabase Storage or fallback storage
 * @param {string} bucket
 * @param {string} storagePath
 */
const deleteFile = async (bucket, storagePath) => {
  if (!storagePath) return;

  if (supabase && isSupabaseConfigured) {
    const { error } = await supabase.storage.from(bucket).remove([storagePath]);
    if (error) {
      console.warn(`[Supabase] Failed to delete file ${storagePath}:`, error.message);
    }
  } else {
    // Local fallback deletion
    try {
      const localFilePath = path.join(__dirname, '../../public/uploads', storagePath);
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (e) {
      console.warn(`[Storage] Failed to delete local file ${storagePath}:`, e.message);
    }
  }
};

module.exports = {
  supabase,
  isSupabaseConfigured,
  uploadFile,
  deleteFile,
};
