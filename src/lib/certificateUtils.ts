/**
 * Shared types and pure helpers for the certificate feature.
 * No SDK imports here — safe to use from the public website bundle.
 */

export type CertificateFileType = 'pdf' | 'image';

export interface CertificateRecord {
  id: string;
  studentName: string;
  enrollmentNumber: string;
  certificateUrl: string;
  certificatePublicId: string;
  fileType: CertificateFileType;
  fileFormat: string;
  fileName: string;
  fileSizeBytes: number;
  uploadedAt: Date | null;
}

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ACCEPTED_FILE_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];

export function normalizeStudentName(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function normalizeEnrollmentNumber(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, ' ');
}

export function validateStudentName(value: string): string | null {
  const normalized = normalizeStudentName(value);
  if (normalized.length < 2) return 'Please enter the student name (at least 2 characters).';
  if (normalized.length > 100) return 'Student name is too long (maximum 100 characters).';
  return null;
}

export function validateEnrollmentNumber(value: string): string | null {
  const normalized = normalizeEnrollmentNumber(value);
  if (normalized.length < 3) return 'Enrollment number must be at least 3 characters.';
  if (normalized.length > 50) return 'Enrollment number is too long (maximum 50 characters).';
  if (!/^[A-Z0-9][A-Z0-9\/\-\. ]*$/.test(normalized)) {
    return 'Enrollment number can only contain letters, numbers, spaces, "/", "-" and ".".';
  }
  return null;
}

export function validateCertificateFile(file: File): string | null {
  const extensionOk = ACCEPTED_FILE_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));
  const mimeOk = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'].includes(file.type);
  if (!extensionOk && !mimeOk) {
    return 'Invalid file type. Only PDF, PNG, JPG and WEBP files are allowed.';
  }
  if (file.size === 0) return 'The selected file is empty.';
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File is too large. Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`;
  }
  return null;
}

export function detectCertificateFileType(file: File, uploadedFormat?: string): CertificateFileType {
  if (file.type === 'application/pdf' || uploadedFormat === 'pdf') return 'pdf';
  return 'image';
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatCertificateDate(date: Date | null): string {
  if (!date) return '—';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Cloudinary delivery flag that forces the browser to download instead of opening inline. */
export function buildDownloadUrl(url: string): string {
  if (!url) return url;
  return `${url}${url.includes('?') ? '&' : '?'}fl_attachment`;
}

/** Maps backend/network errors to a message that is safe and useful to show users. */
export function friendlyErrorMessage(error: unknown): string {
  const code = (error as { code?: string } | null)?.code ?? '';
  if (code === 'permission-denied') {
    return 'Permission denied by Firestore. Make sure the Firestore database has been created and the rules from firestore.rules are published (see README.md).';
  }
  if (code === 'failed-precondition') {
    return 'The Firestore database is not ready yet. Create the Firestore database in the Firebase console (see README.md).';
  }
  if (code === 'unavailable') {
    return 'Cannot reach Firestore right now. Please check your internet connection and try again.';
  }
  if (error instanceof Error && error.message) return error.message;
  return 'Something went wrong. Please try again.';
}
