import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CloudUpload, FileText, Image as ImageIcon, Loader2, Send, User, Hash, X } from 'lucide-react';
import { uploadCertificate, EnrollmentExistsError } from '../../lib/certificates';
import { isCloudinaryConfigured, isFirebaseConfigured } from '../../lib/config';
import {
  ACCEPTED_FILE_EXTENSIONS,
  MAX_FILE_SIZE_MB,
  detectCertificateFileType,
  formatFileSize,
  friendlyErrorMessage,
  validateCertificateFile,
  validateEnrollmentNumber,
  validateStudentName,
  type CertificateRecord,
} from '../../lib/certificateUtils';
import ConfirmDialog from './ConfirmDialog';

interface UploadCertificateFormProps {
  /** Called after a successful upload; receives the record and whether it replaced an existing one. */
  onUploaded: (record: CertificateRecord, replacedExisting: boolean) => void;
}

const ACCEPT_ATTRIBUTE = [...ACCEPTED_FILE_EXTENSIONS, 'application/pdf', 'image/png', 'image/jpeg', 'image/webp'].join(',');

export default function UploadCertificateForm({ onUploaded }: UploadCertificateFormProps) {
  const [studentName, setStudentName] = useState('');
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [recordToReplace, setRecordToReplace] = useState<CertificateRecord | null>(null);
  const [replacing, setReplacing] = useState(false);

  const firebaseReady = isFirebaseConfigured();
  const cloudinaryReady = isCloudinaryConfigured();
  const canUpload = firebaseReady && cloudinaryReady;

  const nameError = studentName ? validateStudentName(studentName) : null;
  const enrollmentError = enrollmentNumber ? validateEnrollmentNumber(enrollmentNumber) : null;
  const submitDisabled =
    uploading || replacing || !canUpload || !file || !studentName.trim() || !enrollmentNumber.trim() || Boolean(nameError) || Boolean(enrollmentError);

  const handleFileChange = (selected: File | null) => {
    setError(null);
    setFilePreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (!selected) {
      setFile(null);
      return;
    }
    const fileError = validateCertificateFile(selected);
    if (fileError) {
      setFile(null);
      setError(fileError);
      return;
    }
    setFile(selected);
    if (detectCertificateFileType(selected) === 'image') {
      setFilePreviewUrl(URL.createObjectURL(selected));
    }
  };

  const resetForm = () => {
    setStudentName('');
    setEnrollmentNumber('');
    handleFileChange(null);
    setProgress(0);
  };

  const runUpload = async (overwrite: boolean) => {
    if (!file) return;
    setError(null);
    setUploading(true);
    setProgress(0);
    try {
      const record = await uploadCertificate({
        studentName,
        enrollmentNumber,
        file,
        overwrite,
        onUploadProgress: setProgress,
      });
      onUploaded(record, overwrite);
      resetForm();
    } catch (uploadError) {
      if (uploadError instanceof EnrollmentExistsError) {
        setRecordToReplace(uploadError.existingRecord);
      } else {
        setError(friendlyErrorMessage(uploadError));
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitDisabled) {
      runUpload(false);
    }
  };

  const handleReplaceConfirm = async () => {
    if (!recordToReplace) return;
    setRecordToReplace(null);
    setReplacing(true);
    try {
      await runUpload(true);
    } finally {
      setReplacing(false);
    }
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8" aria-labelledby="upload-certificate-heading">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
          <CloudUpload className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 id="upload-certificate-heading" className="font-display text-xl font-bold text-slate-900">
            Upload Student Certificate
          </h3>
          <p className="text-sm text-slate-500">PDF or image file — stored securely on Cloudinary.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="student-name" className="block text-sm font-bold text-slate-700 mb-2">
              Student Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                id="student-name"
                autoComplete="off"
                disabled={uploading || replacing}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all font-medium text-slate-900 disabled:opacity-60"
                placeholder="e.g. Rahul Kumar"
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  setError(null);
                }}
              />
            </div>
            {nameError && <p className="mt-2 text-xs font-medium text-red-600">{nameError}</p>}
          </div>

          <div>
            <label htmlFor="enrollment-number" className="block text-sm font-bold text-slate-700 mb-2">
              Enrollment Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Hash className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                id="enrollment-number"
                autoComplete="off"
                disabled={uploading || replacing}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all font-medium text-slate-900 font-mono uppercase disabled:opacity-60"
                placeholder="e.g. CS/2025/001"
                value={enrollmentNumber}
                onChange={(e) => {
                  setEnrollmentNumber(e.target.value);
                  setError(null);
                }}
              />
            </div>
            {enrollmentError && <p className="mt-2 text-xs font-medium text-red-600">{enrollmentError}</p>}
          </div>
        </div>

        {/* File picker */}
        <div>
          <label htmlFor="certificate-file" className="block text-sm font-bold text-slate-700 mb-2">
            Certificate File
          </label>
          <input
            type="file"
            id="certificate-file"
            className="hidden"
            accept={ACCEPT_ATTRIBUTE}
            disabled={uploading || replacing}
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          />

          {!file ? (
            <label
              htmlFor="certificate-file"
              className="group cursor-pointer flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-2xl px-6 py-8 text-center hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors"
            >
              <CloudUpload className="w-10 h-10 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <p className="font-semibold text-slate-700">
                Click to choose the certificate file
                <span className="block sm:inline sm:ml-1 text-slate-500 font-normal">(PDF, PNG, JPG, WEBP)</span>
              </p>
              <p className="text-xs text-slate-500">Maximum file size: {MAX_FILE_SIZE_MB} MB</p>
            </label>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-4 border rounded-2xl p-4 ${
                uploading || replacing ? 'border-slate-200 bg-slate-50' : 'border-indigo-200 bg-indigo-50/50'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                {filePreviewUrl ? (
                  <img src={filePreviewUrl} alt="Selected certificate preview" className="w-full h-full object-cover" />
                ) : (
                  <FileText className="w-6 h-6 text-rose-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-800 truncate">{file.name}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  {filePreviewUrl ? (
                    <>
                      <ImageIcon className="w-3.5 h-3.5" /> Image • {formatFileSize(file.size)}
                    </>
                  ) : (
                    <>
                      <FileText className="w-3.5 h-3.5" /> PDF document • {formatFileSize(file.size)}
                    </>
                  )}
                </p>
              </div>
              {!uploading && !replacing && (
                <button
                  type="button"
                  onClick={() => handleFileChange(null)}
                  className="p-2 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                  aria-label="Remove selected file"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </motion.div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
            <X className="w-4 h-4 mt-0.5 shrink-0" />
            {error}
          </p>
        )}

        <div>
          <button
            type="submit"
            id="upload-button"
            disabled={submitDisabled}
            title={!canUpload ? 'Cloudinary and Firebase must be configured first (see README.md)' : undefined}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-indigo-600/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
          >
            {uploading || replacing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading… {progress > 0 ? `${progress}%` : ''}
              </>
            ) : (
              <>
                Upload Certificate
                <Send className="w-4 h-4" />
              </>
            )}
          </button>

          <AnimatePresence>
            {(uploading || replacing) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-200"
                    style={{ width: `${Math.max(progress, 4)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 font-medium mt-2 text-center">
                  Sending file to Cloudinary — please don't close this page.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>

      <ConfirmDialog
        open={recordToReplace !== null}
        title="Replace existing certificate?"
        message={
          recordToReplace
            ? `A certificate for enrollment number ${recordToReplace.enrollmentNumber} (${recordToReplace.studentName}) already exists. Uploading again will replace the record — students will immediately see the new file. The old file remains in Cloudinary storage.`
            : ''
        }
        confirmLabel="Replace Certificate"
        busy={replacing}
        onConfirm={handleReplaceConfirm}
        onCancel={() => setRecordToReplace(null)}
      />
    </section>
  );
}
