/**
 * Certificate service — Firestore (data) + Cloudinary (files).
 *
 * Firestore collection: `certificates`
 * Document fields:
 *   studentName        string   – student's full name
 *   enrollmentNumber   string   – unique, normalized (trimmed + uppercase)
 *   certificateUrl     string   – Cloudinary secure URL of the uploaded file
 *   certificatePublicId string  – Cloudinary public_id (for reference)
 *   fileType           'pdf' | 'image'
 *   fileFormat         string   – e.g. 'pdf' | 'png' | 'jpg'
 *   fileName           string   – original file name
 *   fileSizeBytes      number
 *   uploadedAt         timestamp (serverTimestamp)
 */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { getFirebaseDb } from './firebase';
import { uploadCertificateToCloudinary, type CloudinaryUploadResult } from './cloudinary';
import { isFirebaseConfigured } from './config';
import {
  detectCertificateFileType,
  normalizeEnrollmentNumber,
  normalizeStudentName,
  validateCertificateFile,
  validateEnrollmentNumber,
  validateStudentName,
  type CertificateFileType,
  type CertificateRecord,
} from './certificateUtils';

export const CERTIFICATES_COLLECTION = 'certificates';

export const FIREBASE_NOT_CONFIGURED_MESSAGE =
  'Firebase is not configured. Add your Firebase web app config to the environment variables (see README.md).';

/** Thrown when uploading for an enrollment number that already has a certificate. */
export class EnrollmentExistsError extends Error {
  readonly existingRecord: CertificateRecord;

  constructor(record: CertificateRecord) {
    super(`A certificate already exists for enrollment number ${record.enrollmentNumber}.`);
    this.name = 'EnrollmentExistsError';
    this.existingRecord = record;
  }
}

function snapshotToRecord(snapshot: QueryDocumentSnapshot<DocumentData>): CertificateRecord {
  const data = snapshot.data();
  const rawUploadedAt = data.uploadedAt as { toDate?: () => Date } | undefined;
  return {
    id: snapshot.id,
    studentName: typeof data.studentName === 'string' ? data.studentName : '',
    enrollmentNumber: typeof data.enrollmentNumber === 'string' ? data.enrollmentNumber : '',
    certificateUrl: typeof data.certificateUrl === 'string' ? data.certificateUrl : '',
    certificatePublicId: typeof data.certificatePublicId === 'string' ? data.certificatePublicId : '',
    fileType: data.fileType === 'pdf' ? 'pdf' : 'image',
    fileFormat: typeof data.fileFormat === 'string' ? data.fileFormat : '',
    fileName: typeof data.fileName === 'string' ? data.fileName : '',
    fileSizeBytes: typeof data.fileSizeBytes === 'number' ? data.fileSizeBytes : 0,
    uploadedAt: rawUploadedAt && typeof rawUploadedAt.toDate === 'function' ? rawUploadedAt.toDate() : null,
  };
}

export async function findCertificateByEnrollmentNumber(enrollmentNumber: string): Promise<CertificateRecord | null> {
  if (!isFirebaseConfigured()) throw new Error(FIREBASE_NOT_CONFIGURED_MESSAGE);
  const normalized = normalizeEnrollmentNumber(enrollmentNumber);
  if (!normalized) return null;

  const db = getFirebaseDb();
  const q = query(
    collection(db, CERTIFICATES_COLLECTION),
    where('enrollmentNumber', '==', normalized),
    limit(1)
  );
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : snapshotToRecord(snapshot.docs[0]);
}

export async function listCertificates(): Promise<CertificateRecord[]> {
  if (!isFirebaseConfigured()) throw new Error(FIREBASE_NOT_CONFIGURED_MESSAGE);

  const db = getFirebaseDb();
  const snapshot = await getDocs(collection(db, CERTIFICATES_COLLECTION));
  const records = snapshot.docs.map(snapshotToRecord);
  // Sort on the client so records missing a timestamp are still shown.
  records.sort((a, b) => (b.uploadedAt?.getTime() ?? 0) - (a.uploadedAt?.getTime() ?? 0));
  return records;
}

export interface UploadCertificateOptions {
  studentName: string;
  enrollmentNumber: string;
  file: File;
  /** When true, an existing certificate for the same enrollment number is replaced. */
  overwrite?: boolean;
  onUploadProgress?: (percent: number) => void;
}

export async function uploadCertificate(options: UploadCertificateOptions): Promise<CertificateRecord> {
  const { file, overwrite = false, onUploadProgress } = options;
  if (!isFirebaseConfigured()) throw new Error(FIREBASE_NOT_CONFIGURED_MESSAGE);

  const studentName = normalizeStudentName(options.studentName);
  const enrollmentNumber = normalizeEnrollmentNumber(options.enrollmentNumber);

  const nameError = validateStudentName(studentName);
  if (nameError) throw new Error(nameError);
  const enrollmentError = validateEnrollmentNumber(enrollmentNumber);
  if (enrollmentError) throw new Error(enrollmentError);
  const fileError = validateCertificateFile(file);
  if (fileError) throw new Error(fileError);

  const existing = await findCertificateByEnrollmentNumber(enrollmentNumber);
  if (existing && !overwrite) {
    throw new EnrollmentExistsError(existing);
  }

  const upload: CloudinaryUploadResult = await uploadCertificateToCloudinary(file, onUploadProgress);
  const fileType: CertificateFileType = detectCertificateFileType(file, upload.format);
  const fileFormat = (upload.format || file.name.split('.').pop() || '').toLowerCase();

  const recordData = {
    studentName,
    enrollmentNumber,
    certificateUrl: upload.secureUrl,
    certificatePublicId: upload.publicId,
    fileType,
    fileFormat,
    fileName: file.name,
    fileSizeBytes: upload.bytes ?? file.size,
    uploadedAt: serverTimestamp(),
  };

  const db = getFirebaseDb();
  let recordId: string;
  if (existing) {
    await updateDoc(doc(db, CERTIFICATES_COLLECTION, existing.id), recordData);
    recordId = existing.id;
  } else {
    const docRef = await addDoc(collection(db, CERTIFICATES_COLLECTION), recordData);
    recordId = docRef.id;
  }

  return {
    id: recordId,
    studentName,
    enrollmentNumber,
    certificateUrl: upload.secureUrl,
    certificatePublicId: upload.publicId,
    fileType,
    fileFormat,
    fileName: file.name,
    fileSizeBytes: recordData.fileSizeBytes,
    uploadedAt: new Date(),
  };
}

export async function updateCertificateDetails(
  id: string,
  input: { studentName: string; enrollmentNumber: string }
): Promise<void> {
  if (!isFirebaseConfigured()) throw new Error(FIREBASE_NOT_CONFIGURED_MESSAGE);

  const studentName = normalizeStudentName(input.studentName);
  const enrollmentNumber = normalizeEnrollmentNumber(input.enrollmentNumber);

  const nameError = validateStudentName(studentName);
  if (nameError) throw new Error(nameError);
  const enrollmentError = validateEnrollmentNumber(enrollmentNumber);
  if (enrollmentError) throw new Error(enrollmentError);

  // Keep enrollment numbers unique.
  const existing = await findCertificateByEnrollmentNumber(enrollmentNumber);
  if (existing && existing.id !== id) {
    throw new Error(`Enrollment number ${enrollmentNumber} is already used by another certificate (${existing.studentName}).`);
  }

  const db = getFirebaseDb();
  await updateDoc(doc(db, CERTIFICATES_COLLECTION, id), { studentName, enrollmentNumber });
}

export async function deleteCertificate(id: string): Promise<void> {
  if (!isFirebaseConfigured()) throw new Error(FIREBASE_NOT_CONFIGURED_MESSAGE);
  const db = getFirebaseDb();
  await deleteDoc(doc(db, CERTIFICATES_COLLECTION, id));
}
