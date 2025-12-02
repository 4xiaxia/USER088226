
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, children }) => {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-center items-end sm:items-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity animate-fade-in" 
        onClick={onClose} 
      />
      
      {/* Sheet Content */}
      <div className="relative w-full max-w-[1200px] h-[90vh] bg-white rounded-t-[32px] overflow-hidden shadow-2xl pointer-events-auto animate-slide-up-sheet flex flex-col">
          {/* Drag Handle Area */}
          <div 
            className="flex-shrink-0 w-full flex justify-center pt-4 pb-2 bg-white z-10 cursor-pointer" 
            onClick={onClose}
          >
             <div className="w-12 h-1.5 bg-stone-300 rounded-full" />
          </div>
          
          {/* Scrollable Content */}
          <div className="flex-grow overflow-y-auto scrollbar-hide pb-safe">
            {children}
          </div>
      </div>
    </div>,
    document.body
  );
};

export default BottomSheet;
