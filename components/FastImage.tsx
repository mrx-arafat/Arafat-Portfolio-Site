"use client";

import Image from 'next/image';
import { useState } from 'react';

interface FastImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export default function FastImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority = false,
  sizes,
  onLoad,
  onError,
  placeholder,
  blurDataURL
}: FastImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleLoad = () => {
    setImageLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    setImageLoading(false);
    onError?.();
  };

  if (imageError) {
    return (
      <div className={`flex items-center justify-center bg-[#1a1b26] text-[#2ed573]/50 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 opacity-50">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21,15 16,10 5,21"/>
            </svg>
          </div>
          <span className="text-xs">Failed to load</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {imageLoading && (
        <div className={`absolute inset-0 bg-[#1a1b26] flex items-center justify-center z-10 ${className}`}>
          <div className="w-6 h-6 border-2 border-[#2ed573]/30 border-t-[#2ed573] rounded-full animate-spin"></div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className={`${className} ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        priority={priority}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        unoptimized={true} // Always disable optimization for fast loading
        placeholder={placeholder}
        blurDataURL={blurDataURL}
      />
    </>
  );
}
