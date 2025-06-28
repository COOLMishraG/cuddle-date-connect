// Cloudinary service for image upload
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration - these should be set in your environment variables
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset';

// Alternative: Direct browser upload using the unsigned upload preset
export const uploadImageToCloudinary = async (file: File, folder: string = 'pets'): Promise<string> => {
  try {
    // Create FormData for the upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);
    
    // Upload directly to Cloudinary from the browser
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary upload error:', errorData);
      throw new Error(`Failed to upload image to Cloudinary: ${errorData.error.message}`);
    }
    
    const data = await response.json();
    
    // Return the secure URL of the uploaded image
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    if (error instanceof Error && error.message.startsWith('Failed to upload image')) {
        throw error;
    }
    throw new Error('Failed to upload image. Please try again.');
  }
};

// Function to generate a Cloudinary URL with transformations
export const getOptimizedImageUrl = (
  publicId: string, 
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  } = {}
): string => {
  const { width = 400, height = 300, crop = 'fill', quality = 'auto', format = 'auto' } = options;
  
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},h_${height},c_${crop},q_${quality},f_${format}/${publicId}`;
};

// Function to extract public ID from Cloudinary URL
export const extractPublicIdFromUrl = (url: string): string => {
  const parts = url.split('/');
  const uploadIndex = parts.findIndex(part => part === 'upload');
  if (uploadIndex === -1) return '';
  
  // Get everything after the transformation parameters
  const afterUpload = parts.slice(uploadIndex + 1);
  const publicIdWithExtension = afterUpload.join('/');
  
  // Remove the file extension
  return publicIdWithExtension.replace(/\.[^/.]+$/, '');
};

// Validate image file
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)'
    };
  }
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Image file size must be less than 10MB'
    };
  }
  
  return { isValid: true };
};
