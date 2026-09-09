import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Award, FileText, Globe, Image as ImageIcon, LogOut, Settings } from 'lucide-react';
import { ACADEMY_DATA } from '../../data';
import { adminLogout } from '../../lib/adminAuth';
import { isCloudinaryConfigured, isFirebaseConfigured } from '../../lib/config';
import {
  deleteCertificate,
  listCertificates,
  updateCertificateDetails,
} from '../../lib/certificates';
import {
  friendlyErrorMessage,
  normalizeEnrollmentNumber,
  normalizeStudentName,
  type CertificateRecord,
} from '../../lib/certificateUtils';
import UploadCertificateForm from '../../components/admin/UploadCertificateForm';
import CertificatesTable from '../../components/admin/CertificatesTable';
import EditCertificateDialog from '../../components/admin/EditCertificateDialog';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { ToastContainer, useToasts } from '../../components/admin/Toast';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { toasts, pushToast, dismissToast } = useToasts();

  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [recordToEdit, setRecordToEdit] = useState<CertificateRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<CertificateRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const firebaseReady = isFirebaseConfigured();
  const cloudinaryReady = isCloudinaryConfigured();

  const loadCertificates = useCallback(async (showSpinner = true) => {
    if (!isFirebaseConfigured()) {
      setCertificates([]);
      setLoading(false);
      setListError(null);
      return;
    }
    if (showSpinner) setLoading(true);
    setListError(null);
    try {
      const records = await listCertificates();
      setCertificates(records);
    } catch (error) {
      setListError(friendlyErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCertificates();
  }, [loadCertificates]);

  const stats = useMemo(
    () => ({
      total: certificates.length,
      pdf: certificates.filter((record) => record.fileType === 'pdf').length,
      image: certificates.filter((record) => record.fileType === 'image').length,
    }),
    [certificates]
  );

  const handleUploaded = useCallback(
    async (_record: CertificateRecord, replaced: boolean) => {
      pushToast(
        'success',
        replaced ? 'Certificate replaced successfully.' : 'Certificate uploaded successfully.'
      );
      await loadCertificates(false);
    },
    [loadCertificates, pushToast]
  );

  const handleEditSave = useCallback(
    async (studentName: string, enrollmentNumber: string) => {
      if (!recordToEdit) return;
      await updateCertificateDetails(recordToEdit.id, {
        studentName: normalizeStudentName(studentName),
        enrollmentNumber: normalizeEnrollmentNumber(enrollmentNumber),
      });
      setRecordToEdit(null);
      pushToast('success', 'Certificate details updated.');
      await loadCertificates(false);
    },
    [recordToEdit, loadCertificates, pushToast]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!recordToDelete) return;
    setDeleting(true);
    try {
      await deleteCertificate(recordToDelete.id);
      pushToast('success', `Certificate for ${recordToDelete.studentName} was deleted.`);
      setRecordToDelete(null);
      await loadCertificates(false);
    } catch (error) {
      pushToast('error', friendlyErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  }, [recordToDelete, loadCertificates, pushToast]);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={ACADEMY_DATA.logo}
              alt="Complete Study logo"
              className="h-9 w-9 object-cover rounded-full border border-slate-200 shrink-0"
            />
            <div className="min-w-0">
              <p className="font-display font-bold text-indigo-900 uppercase leading-tight tracking-tight truncate">
                {ACADEMY_DATA.name}
              </p>
              <p className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">Certificate Manager</p>
            </div>
            <span className="hidden sm:inline-flex ml-2 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
              Admin Panel
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Globe className="w-4 h-4 text-indigo-600" />
              View Website
            </Link>
            <button
              type="button"
              id="logout-button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Configuration warnings */}
        {!firebaseReady && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-bold mb-1">Firebase is not configured</p>
              <p className="leading-relaxed">
                Certificate data is stored in Firebase Firestore. Add your Firebase web app config to the
                environment variables (<span className="font-mono text-xs">VITE_FIREBASE_*</span>) — see{' '}
                <span className="font-semibold">README.md</span> for step-by-step instructions. The certificate
                list and uploads stay disabled until then.
              </p>
            </div>
          </div>
        )}
        {!cloudinaryReady && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-bold mb-1">Cloudinary is not configured</p>
              <p className="leading-relaxed">
                Certificate files (PDF/images) are uploaded to Cloudinary. Add{' '}
                <span className="font-mono text-xs">VITE_CLOUDINARY_CLOUD_NAME</span> and{' '}
                <span className="font-mono text-xs">VITE_CLOUDINARY_UPLOAD_PRESET</span> to the environment
                variables (see <span className="font-semibold">README.md</span>). Uploads stay disabled until
                then.
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-slate-900 leading-none">{stats.total}</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Total Certificates</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-slate-900 leading-none">{stats.pdf}</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">PDF Certificates</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-slate-900 leading-none">{stats.image}</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Image Certificates</p>
            </div>
          </div>
        </div>

        <UploadCertificateForm onUploaded={handleUploaded} />

        <CertificatesTable
          certificates={certificates}
          loading={loading}
          error={listError}
          onRetry={() => loadCertificates()}
          onEdit={setRecordToEdit}
          onDelete={setRecordToDelete}
        />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p className="flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5" />
            {ACADEMY_DATA.name} — Admin Panel
          </p>
          <p>Data: Firebase Firestore • Files: Cloudinary</p>
        </div>
      </footer>

      {/* Dialogs & toasts */}
      <EditCertificateDialog record={recordToEdit} onSave={handleEditSave} onClose={() => setRecordToEdit(null)} />
      <ConfirmDialog
        open={recordToDelete !== null}
        title="Delete this certificate?"
        message={
          recordToDelete
            ? `This will permanently remove the certificate record for ${recordToDelete.studentName} (${recordToDelete.enrollmentNumber}) from the database. Students will no longer be able to verify or download it. The uploaded file itself remains in Cloudinary storage. This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete Certificate"
        destructive
        busy={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setRecordToDelete(null)}
      />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
