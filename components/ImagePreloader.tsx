"use client";

import { useEffect } from 'react';
import Image from 'next/image';

interface ImagePreloaderProps {
  images: string[];
  currentIndex: number;
}

export default function ImagePreloader({ images, currentIndex }: ImagePreloaderProps) {
  useEffect(() => {
    // Preload next and previous images
    const preloadIndexes = [
      (currentIndex + 1) % images.length,
      (currentIndex - 1 + images.length) % images.length,
      (currentIndex + 2) % images.length, // Preload one more ahead
    ];

    preloadIndexes.forEach((index) => {
      if (images[index]) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = images[index];
        document.head.appendChild(link);
        
        // Clean up after a delay
        setTimeout(() => {
          if (document.head.contains(link)) {
            document.head.removeChild(link);
          }
        }, 10000);
      }
    });
  }, [images, currentIndex]);

  return (
    <div style={{ display: 'none' }}>
      {/* Hidden preload images */}
      {images.map((src, index) => {
        const shouldPreload = Math.abs(index - currentIndex) <= 2;
        if (!shouldPreload || index === currentIndex) return null;
        
        return (
          <Image
            key={`preload-${index}`}
            src={src}
            alt=""
            width={1}
            height={1}
            priority={false}
            quality={50}
            onLoad={() => {}}
            onError={() => {}}
          />
        );
      })}
    </div>
  );
}
