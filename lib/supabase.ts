import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '@/app/config/envs';

// Create Supabase client with service role key for server-side operations
// Only create if both URL and key are provided to avoid errors during module evaluation
let supabase: SupabaseClient | null = null;

if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Getter function to safely access the Supabase client
function getSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error('Supabase client is not initialized. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  }
  return supabase;
}

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
    const supabaseClient = getSupabase();
    const { data, error } = await supabaseClient.storage
      .from('properties')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabaseClient.storage
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

/**
 * Deletes multiple files from Supabase storage (server-side)
 * @param bucketName - The name of the Supabase storage bucket
 * @param filePaths - Array of file paths relative to the bucket root
 * @returns Number of successfully deleted files
 */
export async function deleteMultipleFromSupabase(bucketName: string, filePaths: string[]): Promise<number> {
  try {
    if (filePaths.length === 0) {
      return 0;
    }

    if (!bucketName) {
      console.error('Bucket name is required for deletion');
      return 0;
    }

    console.log(`Deleting from Supabase bucket "${bucketName}" with paths:`, filePaths);

    // Delete all files at once
    const supabaseClient = getSupabase();
    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .remove(filePaths);

    if (error) {
      console.error('Error deleting files from Supabase:', error);
      console.error('Error message:', error.message);
      console.error('Bucket:', bucketName);
      console.error('Attempted to delete paths:', filePaths);
      return 0;
    }

    console.log(`Successfully deleted files from bucket "${bucketName}". Response:`, data);
    // Return the number of successfully deleted files
    return data?.length || 0;
  } catch (error) {
    console.error('Error deleting multiple files from Supabase:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    return 0;
  }
}
