"use client";

import React from 'react';
import { AlertCircle, CheckCircle2, HelpCircle, X } from 'lucide-react';

interface CustomModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'confirm' | 'info' | 'success' | 'danger';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export default function CustomModal({
  isOpen,
  title,
  message,
  type = 'confirm',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: CustomModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-100 transform transition-all animate-scaleUp">
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center space-x-4 mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            type === 'danger' ? 'bg-red-50 text-red-600' :
            type === 'success' ? 'bg-emerald-50 text-emerald-600' :
            type === 'info' ? 'bg-blue-50 text-blue-600' :
            'bg-gold-50 text-gold-600'
          }`}>
            {type === 'danger' && <AlertCircle className="w-6 h-6" />}
            {type === 'success' && <CheckCircle2 className="w-6 h-6" />}
            {type === 'info' && <HelpCircle className="w-6 h-6" />}
            {type === 'confirm' && <HelpCircle className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900">{title}</h3>
          </div>
        </div>

        <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex items-center justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 font-medium text-sm hover:bg-neutral-50 transition-colors"
            >
              {cancelText}
            </button>
          )}
          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              className={`px-6 py-2.5 rounded-xl font-medium text-sm text-white shadow-md transition-all active:scale-95 ${
                type === 'danger'
                  ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
                  : 'bg-gold-500 hover:bg-gold-600 shadow-gold-500/20'
              }`}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
