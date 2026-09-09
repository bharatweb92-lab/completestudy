import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Hash,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Download,
  ExternalLink,
  FileText,
  Phone,
  Settings,
} from 'lucide-react';
import { ACADEMY_DATA } from '../data';
import { isFirebaseConfigured } from '../lib/config';
import {
  buildDownloadUrl,
  formatCertificateDate,
  formatFileSize,
  friendlyErrorMessage,
  normalizeEnrollmentNumber,
  type CertificateRecord,
} from '../lib/certificateUtils';

type VerifyStatus = 'idle' | 'searching' | 'found' | 'not-found' | 'error';

export default function VerifyCertificate() {
  const [enrollmentInput, setEnrollmentInput] = useState('');
  const [status, setStatus] = useState<VerifyStatus>('idle');
  const [record, setRecord] = useState<CertificateRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const firebaseReady = isFirebaseConfigured();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeEnrollmentNumber(enrollmentInput);
    if (!normalized || status === 'searching') return;

    setStatus('searching');
    setRecord(null);
    setErrorMessage('');
    try {
      // Loaded on demand so the Firestore SDK is not part of the homepage bundle.
      const { findCertificateByEnrollmentNumber } = await import('../lib/certificates');
      const found = await findCertificateByEnrollmentNumber(normalized);
      if (found) {
        setRecord(found);
        setStatus('found');
      } else {
        setStatus('not-found');
      }
    } catch (error) {
      setErrorMessage(friendlyErrorMessage(error));
      setStatus('error');
    }
  };

  return (
    <section id="verify" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold uppercase tracking-wider mb-4 border border-teal-100">
            <ShieldCheck className="w-4 h-4" />
            Certificate Verification
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
            Verify & Download Your Certificate
          </h2>
          <p className="text-lg text-slate-600">
            Every certificate we issue is stored digitally. Enter the enrollment number given by the academy to
            view and download your certificate instantly.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {!firebaseReady ? (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-5">
                <Settings className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
                Online verification is being set up
              </h3>
              <p className="text-slate-600 mb-6">
                Certificate verification will be available here shortly. Until then, please contact the academy
                and we will share your certificate directly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`tel:${ACADEMY_DATA.phone.replace(/\s+/g, '')}`}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call {ACADEMY_DATA.phone}
                </a>
                <a
                  href={`https://wa.me/${ACADEMY_DATA.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                    'Hello Complete Study, I want a copy of my certificate. My enrollment number is: '
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
                >
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Hash className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    id="verify-enrollment"
                    name="verify-enrollment"
                    autoComplete="off"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all font-medium text-slate-900"
                    placeholder="Enter enrollment number e.g. CS/2025/001"
                    value={enrollmentInput}
                    onChange={(e) => setEnrollmentInput(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  id="verify-button"
                  disabled={status === 'searching' || !enrollmentInput.trim()}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors shadow-lg shadow-indigo-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'searching' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    'Verify Certificate')
                  }
                </button>
              </form>
              <p className="text-xs text-center text-slate-500 font-medium mt-3">
                The enrollment number is printed on your admission receipt and certificate.
              </p>

              <AnimatePresence mode="wait">
                {status === 'found' && record && (
                  <motion.div
                    key="found"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="mt-8"
                  >
                    <div className="bg-white border border-green-200 rounded-3xl overflow-hidden shadow-lg shadow-green-100/50">
                      <div className="bg-green-50 px-6 sm:px-8 py-5 flex items-center gap-3 border-b border-green-100">
                        <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                        <p className="font-bold text-green-800">Certificate Verified</p>
                      </div>
                      <div className="p-6 sm:p-8">
                        <h3 className="font-display text-2xl font-bold text-slate-900 mb-3">{record.studentName}</h3>
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                          <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 font-mono text-sm font-semibold text-slate-700">
                            {record.enrollmentNumber}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                              record.fileType === 'pdf'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-teal-50 text-teal-700 border-teal-200'
                            }`}
                          >
                            {record.fileType === 'pdf' ? 'PDF Certificate' : 'Image Certificate'}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            Issued {formatCertificateDate(record.uploadedAt)} • {formatFileSize(record.fileSizeBytes)}
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <a
                            href={record.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Certificate
                          </a>
                          <a
                            href={buildDownloadUrl(record.certificateUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-semibold transition-colors"
                          >
                            <Download className="w-4 h-4 text-indigo-600" />
                            Download
                          </a>
                        </div>

                        {record.fileType === 'image' && (
                          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-center">
                            <img
                              src={record.certificateUrl}
                              alt={`Certificate of ${record.studentName}`}
                              loading="lazy"
                              className="max-h-[480px] w-auto max-w-full rounded-xl shadow-sm"
                            />
                          </div>
                        )}
                        {record.fileType === 'pdf' && (
                          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-600">
                            <FileText className="w-6 h-6 text-rose-500 shrink-0" />
                            <p className="text-sm">
                              This certificate is a PDF document. Use the buttons above to open or download it.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {status === 'not-found' && (
                  <motion.div
                    key="not-found"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="mt-8 flex gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-6"
                  >
                    <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-amber-900 mb-1">No certificate found</h3>
                      <p className="text-sm text-amber-800 leading-relaxed">
                        We could not find a certificate for enrollment number{' '}
                        <span className="font-mono font-semibold">{normalizeEnrollmentNumber(enrollmentInput)}</span>.
                        Please double-check the number, or contact us at{' '}
                        <a href={`tel:${ACADEMY_DATA.phone.replace(/\s+/g, '')}`} className="font-semibold underline">
                          {ACADEMY_DATA.phone}
                        </a>{' '}
                        for help.
                      </p>
                    </div>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="mt-8 flex gap-4 bg-red-50 border border-red-200 rounded-2xl p-6"
                  >
                    <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-red-900 mb-1">Verification failed</h3>
                      <p className="text-sm text-red-800 leading-relaxed">{errorMessage}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
