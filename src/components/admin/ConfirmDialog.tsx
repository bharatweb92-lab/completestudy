import React from 'react';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import AdminModal from './AdminModal';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Generic confirmation dialog used for destructive or important actions. */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AdminModal open={open} onClose={busy ? () => undefined : onCancel}>
      <div className="p-6 sm:p-8">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
            destructive ? 'bg-red-50 border border-red-100' : 'bg-indigo-50 border border-indigo-100'
          }`}
        >
          {destructive ? (
            <Trash2 className="w-7 h-7 text-red-600" />
          ) : (
            <AlertTriangle className="w-7 h-7 text-indigo-600" />
          )}
        </div>
        <h3 className="font-display text-xl font-bold text-slate-900 mb-2 pr-8">{title}</h3>
        <p className="text-slate-600 leading-relaxed mb-8">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="flex-1 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold transition-colors disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            id="confirm-dialog-confirm"
            onClick={onConfirm}
            disabled={busy}
            className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-semibold transition-colors disabled:opacity-60 ${
              destructive ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </AdminModal>
  );
}
