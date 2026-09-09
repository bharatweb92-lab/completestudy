import React, { useEffect, useState } from 'react';
import { Loader2, Pencil, User, Hash } from 'lucide-react';
import AdminModal from './AdminModal';
import {
  friendlyErrorMessage,
  validateEnrollmentNumber,
  validateStudentName,
  type CertificateRecord,
} from '../../lib/certificateUtils';

interface EditCertificateDialogProps {
  record: CertificateRecord | null;
  busy?: boolean;
  onSave: (studentName: string, enrollmentNumber: string) => Promise<void> | void;
  onClose: () => void;
}

/** Edit a certificate's student name / enrollment number (file stays unchanged). */
export default function EditCertificateDialog({ record, onSave, onClose }: EditCertificateDialogProps) {
  const [studentName, setStudentName] = useState('');
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (record) {
      setStudentName(record.studentName);
      setEnrollmentNumber(record.enrollmentNumber);
      setError(null);
      setSaving(false);
    }
  }, [record]);

  const open = record !== null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!record || saving) return;
    setError(null);

    const nameError = validateStudentName(studentName);
    if (nameError) {
      setError(nameError);
      return;
    }
    const enrollmentError = validateEnrollmentNumber(enrollmentNumber);
    if (enrollmentError) {
      setError(enrollmentError);
      return;
    }

    setSaving(true);
    try {
      await onSave(studentName, enrollmentNumber);
    } catch (saveError) {
      setError(friendlyErrorMessage(saveError));
      setSaving(false);
    }
  };

  return (
    <AdminModal open={open} onClose={saving ? () => undefined : onClose}>
      {record && (
        <form onSubmit={handleSave} className="p-6 sm:p-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-5">
            <Pencil className="w-7 h-7 text-indigo-600" />
          </div>
          <h3 className="font-display text-xl font-bold text-slate-900 mb-1 pr-8">Edit Certificate Details</h3>
          <p className="text-slate-600 text-sm mb-6">
            Update the student name or enrollment number. The certificate file itself is not changed.
          </p>

          <div className="space-y-5">
            <div>
              <label htmlFor="edit-student-name" className="block text-sm font-bold text-slate-700 mb-2">
                Student Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="edit-student-name"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all font-medium text-slate-900"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="edit-enrollment-number" className="block text-sm font-bold text-slate-700 mb-2">
                Enrollment Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Hash className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="edit-enrollment-number"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all font-medium text-slate-900 font-mono uppercase"
                  value={enrollmentNumber}
                  onChange={(e) => setEnrollmentNumber(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="edit-dialog-save"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors disabled:opacity-60"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      )}
    </AdminModal>
  );
}
