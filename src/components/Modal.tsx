import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showUpdate?: boolean;
  onUpdate?: () => void;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, showUpdate, onUpdate, maxWidth = "max-w-md" }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`w-full ${maxWidth} bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] overflow-hidden relative z-10 flex flex-col`}
          >
            <div className="p-8 pb-4 flex items-center justify-between">
              <button 
                onClick={onClose}
                className="p-2 hover:bg-[#ffebeb] text-[#141414] hover:text-[#E32E26] rounded-full transition-colors"
                id="modal-close-btn"
              >
                <X size={24} strokeWidth={2.5} />
              </button>
              {title && (
                <h2 className="text-2xl font-black text-[#141414] absolute left-1/2 -translate-x-1/2 pointer-events-none">
                  {title}
                </h2>
              )}
              <div className="w-10" /> {/* Spacer */}
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-8 pt-2">
              {children}
            </div>

            {showUpdate && (
              <div className="p-8 pt-4 flex justify-center">
                <button
                  onClick={onUpdate}
                  className="w-full max-w-[200px] bg-black text-white py-4 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-[#E32E26] transition-all active:scale-95 shadow-xl"
                  id="modal-update-btn"
                >
                  Update
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
