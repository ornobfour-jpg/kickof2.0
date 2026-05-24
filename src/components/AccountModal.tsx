import React from 'react';
import { Button } from './ui/Button';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueGuest: () => void;
  onLoginClick: () => void;
}

export const AccountModal = ({ isOpen, onClose, onContinueGuest, onLoginClick }: AccountModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border-4 border-brand-green w-full max-w-md p-8 shadow-2xl">
        <h2 className="text-3xl font-heading font-bold italic uppercase tracking-widest mb-2 text-center text-zinc-950">Fast Checkout</h2>
        <p className="text-center text-zinc-600 mb-8 font-medium">Save your details for the next drop, or speed through as a guest.</p>
        
        <div className="space-y-4">
          <Button fullWidth size="lg" onClick={onLoginClick}>Login / Register</Button>
          <Button fullWidth size="lg" variant="outline" onClick={onContinueGuest}>Continue as Guest</Button>
        </div>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-brand-green transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  );
};
