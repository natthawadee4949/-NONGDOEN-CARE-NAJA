import React from 'react';
import { X } from 'lucide-react';

interface ImageLightboxModalProps {
  imageUrl: string | null;
  caption: string;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  imageUrl,
  caption,
  onClose,
}) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full flex flex-col items-center animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <img
          src={imageUrl}
          alt={caption}
          className="max-h-[75vh] w-auto max-w-full rounded-2xl shadow-2xl object-contain border border-white/20"
        />

        {caption && (
          <p className="text-white font-bold text-sm mt-3 text-center drop-shadow-md">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
};
