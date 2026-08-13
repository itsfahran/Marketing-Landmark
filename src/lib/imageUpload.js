import { getSupabaseClient } from './supabase';

export async function uploadImage(file, bucket = 'portfolio-images') {
  if (!file) return null;

  try {
    const supabase = getSupabaseClient();
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `uploads/${fileName}`;

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Image upload error:', error);
    throw new Error('Failed to upload image: ' + error.message);
  }
}

export async function deleteImage(imageUrl, bucket = 'portfolio-images') {
  if (!imageUrl) return;

  try {
    const supabase = getSupabaseClient();

    // Extract file path from URL
    const urlParts = imageUrl.split('/storage/v1/object/public/');
    if (urlParts.length < 2) return;

    const filePath = urlParts[1].split('/').slice(1).join('/');

    await supabase.storage
      .from(bucket)
      .remove([filePath]);
  } catch (error) {
    console.error('Image delete error:', error);
  }
}
