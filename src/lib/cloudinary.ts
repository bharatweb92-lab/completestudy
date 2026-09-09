/**
 * Cloudinary upload helper (browser → Cloudinary REST upload API).
 * Uses an UNSIGNED upload preset so no secret API key is ever exposed
 * in the frontend. See README.md for how to create the preset.
 */
import { cloudinaryCloudName, cloudinaryUploadPreset, isCloudinaryConfigured } from './config';

export const CLOUDINARY_NOT_CONFIGURED_MESSAGE =
  'Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your environment (see README.md).';

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
  format: string;
  bytes?: number;
}

export function uploadCertificateToCloudinary(
  file: File,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured()) {
    return Promise.reject(new Error(CLOUDINARY_NOT_CONFIGURED_MESSAGE));
  }

  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    // "auto" resource type accepts both images and PDF documents.
    const url = `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/auto/upload`;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      let response: Record<string, unknown> = {};
      try {
        response = JSON.parse(xhr.responseText as string) as Record<string, unknown>;
      } catch {
        // handled below
      }
      if (xhr.status >= 200 && xhr.status < 300 && typeof response.secure_url === 'string') {
        resolve({
          secureUrl: response.secure_url,
          publicId: typeof response.public_id === 'string' ? response.public_id : '',
          format: typeof response.format === 'string' ? response.format : '',
          bytes: typeof response.bytes === 'number' ? response.bytes : undefined,
        });
      } else {
        reject(new Error(friendlyCloudinaryError(xhr.status, response)));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error while uploading the file to Cloudinary. Please check your internet connection and try again.'));
    };

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryUploadPreset as string);
    xhr.send(formData);
  });
}

function friendlyCloudinaryError(status: number, response: Record<string, unknown>): string {
  const apiError = response.error as { message?: string } | undefined;
  const message = apiError && typeof apiError.message === 'string' ? apiError.message : '';
  if (message.includes('upload_preset')) {
    return 'Cloudinary rejected the upload preset. Check that the preset name is correct and its signing mode is "Unsigned" (see README.md).';
  }
  if (status === 401 || status === 403) {
    return 'Cloudinary rejected the upload. Check your cloud name and upload preset settings.';
  }
  if (status === 400) {
    return `Cloudinary rejected the file. ${message || 'Make sure the preset allows PDF and image files.'}`;
  }
  return `Upload failed (Cloudinary error ${status}). ${message}`.trim();
}
