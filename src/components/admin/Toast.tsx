import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

export type ToastVariant = 'success' | 'error';

export interface ToastMessage {
  id: number;
  variant: ToastVariant;
  text: string;
}

export function useToasts() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    (variant: ToastVariant, text: string) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, variant, text }]);
      const timer = setTimeout(() => dismissToast(id), 4500);
      timers.current.push(timer);
    },
    [dismissToast]
  );

  useEffect(() => {
    const collected = timers.current;
    return () => collected.forEach((timer) => clearTimeout(timer));
  }, []);

  return { toasts, pushToast, dismissToast };
}

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-3 w-[calc(100%-2rem)] max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.25 }}
            className={`flex items-start gap-3 bg-white rounded-xl shadow-lg border-l-4 p-4 pr-3 ${
              toast.variant === 'success' ? 'border-green-500' : 'border-red-500'
            }`}
            role="status"
          >
            {toast.variant === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <p
              className={`text-sm font-medium leading-relaxed flex-1 ${
                toast.variant === 'success' ? 'text-slate-800' : 'text-red-700'
              }`}
            >
              {toast.text}
            </p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
