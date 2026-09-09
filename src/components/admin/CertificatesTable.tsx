import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  Download,
  Eye,
  FileSearch,
  FileText,
  Image as ImageIcon,
  Loader2,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react';
import {
  buildDownloadUrl,
  formatCertificateDate,
  formatFileSize,
  type CertificateRecord,
} from '../../lib/certificateUtils';

interface CertificatesTableProps {
  certificates: CertificateRecord[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onEdit: (record: CertificateRecord) => void;
  onDelete: (record: CertificateRecord) => void;
}

export default function CertificatesTable({ certificates, loading, error, onRetry, onEdit, onDelete }: CertificatesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return certificates;
    return certificates.filter(
      (record) =>
        record.studentName.toLowerCase().includes(term) ||
        record.enrollmentNumber.toLowerCase().includes(term)
    );
  }, [certificates, searchTerm]);

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8" aria-labelledby="certificates-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 id="certificates-heading" className="font-display text-xl font-bold text-slate-900">
            Issued Certificates
          </h3>
          <p className="text-sm text-slate-500">
            {loading ? 'Loading…' : `Showing ${filtered.length} of ${certificates.length} certificate${certificates.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-grow sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="text"
              id="certificate-search"
              autoComplete="off"
              className="w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-sm font-medium text-slate-900"
              placeholder="Search name or enrollment no."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700"
                aria-label="Clear search"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onRetry}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors disabled:opacity-50"
            aria-label="Refresh certificate list"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error ? (
        <div className="flex flex-col items-center gap-4 bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <p className="text-red-700 font-medium max-w-md">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : loading ? (
        <div className="space-y-3" aria-label="Loading certificates">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
            <FileSearch className="w-8 h-8 text-slate-400" />
          </div>
          <p className="font-bold text-slate-800">No certificates yet</p>
          <p className="text-sm text-slate-500 max-w-sm">
            Upload the first student certificate using the form above. It will instantly become available in the
            public "Verify Certificate" section.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-10 text-center">
          <p className="font-semibold text-slate-700 mb-1">No matches for “{searchTerm}”</p>
          <p className="text-sm text-slate-500">Try a different name or enrollment number.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left">
                <tr className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3.5">Certificate</th>
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-5 py-3.5">Enrollment No.</th>
                  <th className="px-5 py-3.5">Uploaded</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((record) => (
                  <tr key={record.id} className="border-t border-slate-100 hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center overflow-hidden shrink-0">
                          {record.fileType === 'image' ? (
                            <img
                              src={record.certificateUrl}
                              alt=""
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileText className="w-5 h-5 text-rose-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 uppercase">{record.fileFormat || 'file'}</p>
                          <p className="text-xs text-slate-500">
                            {formatFileSize(record.fileSizeBytes)} • {record.fileName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{record.studentName}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 font-mono text-xs font-semibold text-slate-700">
                        {record.enrollmentNumber}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{formatCertificateDate(record.uploadedAt)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={record.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          aria-label={`View certificate of ${record.studentName}`}
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <a
                          href={buildDownloadUrl(record.certificateUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          aria-label={`Download certificate of ${record.studentName}`}
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => onEdit(record)}
                          className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          aria-label={`Edit certificate of ${record.studentName}`}
                          title="Edit details"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(record)}
                          className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          aria-label={`Delete certificate of ${record.studentName}`}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((record) => (
              <motion.div key={record.id} layout className="border border-slate-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg border border-slate-200 bg-white flex items-center justify-center overflow-hidden shrink-0">
                    {record.fileType === 'image' ? (
                      <img src={record.certificateUrl} alt="" loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="w-6 h-6 text-rose-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 truncate">{record.studentName}</p>
                    <p className="text-xs font-mono font-semibold text-slate-600 mt-0.5">{record.enrollmentNumber}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          record.fileType === 'pdf'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-teal-50 text-teal-700 border-teal-200'
                        }`}
                      >
                        {record.fileType === 'pdf' ? <FileText className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                        {record.fileFormat || record.fileType}
                      </span>
                      <span>{formatFileSize(record.fileSizeBytes)}</span>
                      <span>•</span>
                      <span>{formatCertificateDate(record.uploadedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-4">
                  <a
                    href={record.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 py-2 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 text-[11px] font-semibold transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </a>
                  <a
                    href={buildDownloadUrl(record.certificateUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 py-2 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 text-[11px] font-semibold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                  <button
                    type="button"
                    onClick={() => onEdit(record)}
                    className="flex flex-col items-center gap-1 py-2 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 text-[11px] font-semibold transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(record)}
                    className="flex flex-col items-center gap-1 py-2 rounded-lg border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 text-[11px] font-semibold transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {loading && certificates.length > 0 && (
        <p className="mt-4 text-xs text-slate-500 flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Refreshing…
        </p>
      )}
    </section>
  );
}
