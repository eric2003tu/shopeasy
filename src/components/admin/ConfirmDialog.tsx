"use client";
import React from 'react';

interface Props {
  open?: boolean;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<Props> = ({ open = false, message = 'Are you sure?', onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-card rounded p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-2">Confirm</h3>
        <p className="text-sm text-muted-foreground mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1 bg-muted rounded">Cancel</button>
          <button onClick={onConfirm} className="px-3 py-1 bg-destructive text-destructive-foreground rounded">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
