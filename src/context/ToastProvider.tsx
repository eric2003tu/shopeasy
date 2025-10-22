"use client";
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { FiCheckCircle, FiInfo, FiAlertCircle, FiX } from 'react-icons/fi';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number; // ms, 0 = persistent
}

interface ToastContextValue {
  toast: (item: Omit<ToastItem, 'id'>) => string;
  remove: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setItems((s) => s.filter((i) => i.id !== id));
  }, []);

  const toast = useCallback((item: Omit<ToastItem, 'id'>) => {
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
    const newItem: ToastItem = { id, duration: 4000, ...item };
    setItems((s) => [newItem, ...s]);
    if (newItem.duration && newItem.duration > 0) {
      setTimeout(() => remove(id), newItem.duration);
    }
    return id;
  }, [remove]);

  const value = useMemo(() => ({ toast, remove }), [toast, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {items.map((it) => (
          <ToastView key={it.id} item={it} onClose={() => remove(it.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const iconFor = (type?: ToastType) => {
  switch (type) {
    case 'success': return <FiCheckCircle className="text-green-600" />;
    case 'error': return <FiAlertCircle className="text-red-600" />;
    case 'warning': return <FiAlertCircle className="text-yellow-600" />;
    default: return <FiInfo className="text-blue-600" />;
  }
};

const ToastView: React.FC<{ item: ToastItem; onClose: () => void }> = ({ item, onClose }) => {
  useEffect(() => {
    if (item.duration && item.duration > 0) {
      const id = setTimeout(onClose, item.duration);
      return () => clearTimeout(id);
    }
  }, [item.duration, onClose]);

  return (
    <div className="max-w-sm w-full bg-white shadow-lg rounded-md border border-gray-200 overflow-hidden">
      <div className="p-3 flex items-start gap-3">
        <div className="pt-0.5">{iconFor(item.type)}</div>
        <div className="flex-1">
          {item.title && <div className="font-medium text-gray-900">{item.title}</div>}
          {item.description && <div className="text-sm text-gray-600">{item.description}</div>}
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-2"><FiX /></button>
      </div>
    </div>
  );
};
