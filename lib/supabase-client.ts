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

