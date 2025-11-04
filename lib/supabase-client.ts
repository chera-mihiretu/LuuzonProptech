'use client';

import { SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_BUCKET, SUPABASE_URL } from '@/app/config/envs';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Get Supabase credentials from environment variables
const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;
const supabaseBucket = NEXT_PUBLIC_SUPABASE_BUCKET;
// Create Supabase client for client-side operations
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

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
    console.log("supabaseBucket", supabaseBucket);
  try {
    // Generate unique identifier
    const uniqueId = generateUniqueId();
    const fileExtension = getFileExtension(file.name);
    const fileName = `${uniqueId}.${fileExtension}`;
    const filePath = `properties/${fileName}`;

    // Upload to Supabase storage
    const { data, error } = await supabaseClient.storage
    .from(supabaseBucket)
    .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from(supabaseBucket)
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
 * Deletes multiple files from Supabase storage (client-side)
 * @param urls - Array of public URLs to delete
 * @returns Number of successfully deleted files
 */
export async function clientDeleteMultipleFromSupabase(urls: string[]): Promise<number> {
  try {
    if (urls.length === 0) {
      return 0;
    }

    // Extract file paths from URLs by taking the last element after splitting by '/'
    // and prepending 'properties/' to match the storage path format
    const actualPaths = urls.map(url => {
      const fileName = url.split('/').pop() || '';
      return `properties/${fileName}`;
    });

    console.log('Deleting paths (client-side):', actualPaths);

    // Delete all files at once using client-side Supabase client
    const { data, error } = await supabaseClient.storage
      .from(supabaseBucket)
      .remove(actualPaths);

    if (error) {
      console.error('Error deleting files from Supabase:', error);
      return 0;
    }

    // Return the number of successfully deleted files
    return data?.length || 0;
  } catch (error) {
    console.error('Error deleting multiple files from Supabase:', error);
    return 0;
  }
}
