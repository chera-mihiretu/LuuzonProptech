import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '@/app/config/envs';

// Create Supabase client with service role key for server-side operations
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Generates a random UUID for file naming
 * Uses uuid library to generate UUID v4
 */
function generateUniqueId(): string {
  return uuidv4();
}

/**
 * Gets file extension from filename
 */
function getFileExtension(filename: string): string {
  return filename.split('.').pop() || '';
}

/**
 * Uploads a file to Supabase storage bucket under /properties folder
 * @param file - The file to upload
 * @returns The public URL of the uploaded file
 */
export async function uploadToSupabase(file: File): Promise<string> {
  try {
    // Generate unique identifier
    const uniqueId = generateUniqueId();
    const fileExtension = getFileExtension(file.name);
    const fileName = `${uniqueId}.${fileExtension}`;
    const filePath = `properties/${fileName}`;

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('properties')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('properties')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get public URL for uploaded file');
    }

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading to Supabase:', error);
    throw error;
  }
}

/**
 * Uploads multiple files to Supabase storage
 * @param files - Array of files to upload
 * @returns Array of public URLs for the uploaded files
 */
export async function uploadMultipleToSupabase(files: File[]): Promise<string[]> {
  try {
    const uploadPromises = files.map(file => uploadToSupabase(file));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading multiple files to Supabase:', error);
    throw error;
  }
}

