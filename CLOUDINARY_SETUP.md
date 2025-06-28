# Cloud Image Upload Setup Guide

This application uses Cloudinary for cloud-based image storage. Follow these steps to set up image upload functionality:

## 1. Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/) and sign up for a free account
2. After signing up, you'll be taken to your dashboard

## 2. Get Your Credentials

From your Cloudinary Dashboard, note down:
- **Cloud Name**: Found in the top-left of your dashboard
- **Upload Preset**: You'll need to create this (see step 3)

## 3. Create an Upload Preset

1. In your Cloudinary dashboard, go to **Settings** > **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure the preset:
   - **Preset name**: Choose a name (e.g., `pet-photos`)
   - **Signing Mode**: Select **Unsigned** (for direct browser uploads)
   - **Folder**: Set to `pets` (optional, for organization)
   - **Allowed formats**: Select `jpg`, `png`, `gif`, `webp`
   - **Max file size**: Set to `10000000` (10MB)
   - **Image transformations**: 
     - Quality: `auto`
     - Format: `auto`
5. Click **Save**

## 4. Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Update the following variables in your `.env` file:
   ```
   VITE_CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
   VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset-name
   ```

## 5. Test the Upload

1. Start your development server: `npm run dev`
2. Go to your profile page
3. Try adding a pet with a photo
4. The image should upload to Cloudinary and display correctly

## Features

- **Direct Browser Upload**: Images are uploaded directly from the browser to Cloudinary
- **Automatic Optimization**: Images are automatically optimized for web delivery
- **Error Handling**: Proper error handling for failed uploads
- **File Validation**: File type and size validation before upload
- **Fallback Images**: Graceful fallback to placeholder images if cloud images fail to load

## Troubleshooting

### Upload Failed Error
- Check that your Cloud Name and Upload Preset are correct in the `.env` file
- Ensure the upload preset is set to "Unsigned" mode
- Check browser console for detailed error messages

### Images Not Displaying
- Verify the Cloudinary URLs are correct
- Check browser network tab to see if images are loading
- Ensure proper error handling with fallback to placeholder images

### File Too Large Error
- Default max size is 10MB
- Adjust the max file size in your Cloudinary upload preset if needed

## Security Notes

- The current setup uses unsigned uploads for simplicity
- For production, consider implementing signed uploads through your backend
- Set appropriate upload restrictions in your Cloudinary preset
- Monitor your Cloudinary usage to stay within free tier limits
