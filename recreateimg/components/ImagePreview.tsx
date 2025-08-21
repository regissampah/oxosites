
import React from 'react';
import type { ImageDimensions } from '../types';

interface ImagePreviewProps {
  title: string;
  src: string;
  dimensions?: ImageDimensions | null;
  note?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ title, src, dimensions, note }) => {
  return (
    <div className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50 transition-colors duration-300">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">{title}</h3>
      <div className="w-full aspect-video bg-gray-200 dark:bg-gray-900 rounded-md overflow-hidden flex items-center justify-center">
        <img
          src={src}
          alt={title}
          className="w-full h-full object-contain"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://placehold.co/600x400/cccccc/333333?text=Image+Error";
          }}
        />
      </div>
      {dimensions && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Dimensions: {dimensions.width}x{dimensions.height}
        </p>
      )}
      {note && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center italic">
          *{note}
        </p>
      )}
    </div>
  );
};

export default ImagePreview;
