import React, { useState, useEffect, useCallback, useRef, TouchEvent } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { detectMediaType } from '../helpers/mediaTypeDetection';
import styles from './ImageLightbox.module.css';

interface MediaItem {
  filename: string;
  url: string;
  type?: 'image' | 'video';
}

interface ImageLightboxProps {
  images: MediaItem[];
  initialIndex: number;
  onClose: () => void;
  className?: string;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  initialIndex,
  onClose,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [imageKey, setImageKey] = useState(0);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const pauseAndResetVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      console.log('Video paused and reset');
    }
  }, []);

  const handleClose = useCallback(() => {
    pauseAndResetVideo();
    setIsClosing(true);
    setTimeout(onClose, 300); // Match animation duration
  }, [onClose, pauseAndResetVideo]);

  const nextImage = useCallback(() => {
    if (isAnimating) return;
    pauseAndResetVideo();
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setImageKey(prev => prev + 1);
    setTimeout(() => setIsAnimating(false), 300);
  }, [images.length, isAnimating, pauseAndResetVideo]);

  const prevImage = useCallback(() => {
    if (isAnimating) return;
    pauseAndResetVideo();
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    setImageKey(prev => prev + 1);
    setTimeout(() => setIsAnimating(false), 300);
  }, [images.length, isAnimating, pauseAndResetVideo]);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swiped left, show next image
      nextImage();
    }
    if (touchEndX.current - touchStartX.current > 50) {
      // Swiped right, show previous image
      prevImage();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleClose, nextImage, prevImage]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Focus Trap
  useEffect(() => {
    const lightboxNode = lightboxRef.current;
    if (!lightboxNode) return;

    const focusableElements = lightboxNode.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleTabKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    lightboxNode.addEventListener('keydown', handleTabKeyPress);
    return () => lightboxNode.removeEventListener('keydown', handleTabKeyPress);
  }, []);

  // Preload adjacent media
  useEffect(() => {
    if (images.length > 1) {
      const nextIndex = (currentIndex + 1) % images.length;
      const prevIndex = (currentIndex - 1 + images.length) % images.length;
      
      const nextItem = images[nextIndex];
      const prevItem = images[prevIndex];
      
      // Only preload images, not videos
      if (detectMediaType(nextItem) === 'image') {
        const nextImg = new Image();
        nextImg.src = nextItem.url;
      }

      if (detectMediaType(prevItem) === 'image') {
        const prevImg = new Image();
        prevImg.src = prevItem.url;
      }
    }
  }, [currentIndex, images]);

  const currentItem = images[currentIndex];
  const currentMediaType = detectMediaType(currentItem);

  return createPortal(
    <div
      ref={lightboxRef}
      className={`${styles.overlay} ${isClosing ? styles.closing : ''} ${className ?? ''}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Media viewer"
    >
      <div className={styles.header}>
        <div className={styles.leftInfo}>
          <span className={styles.filename}>{currentItem.filename}</span>
          <span className={styles.counter}>{currentIndex + 1}/{images.length}</span>
        </div>
        <div className={styles.headerNav}>
            <button onClick={(e) => { e.stopPropagation(); prevImage(); }} aria-label="Previous item" className={styles.navButton}>
                <ArrowLeft size={20} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); nextImage(); }} aria-label="Next item" className={styles.navButton}>
                <ArrowRight size={20} />
            </button>
        </div>
        <button onClick={(e) => { e.stopPropagation(); handleClose(); }} aria-label="Close media viewer" className={styles.closeButton}>
          <X size={24} />
        </button>
      </div>

      <button
        className={`${styles.sideNav} ${styles.prev}`}
        onClick={(e) => { e.stopPropagation(); prevImage(); }}
        aria-label="Previous item"
      >
        <ArrowLeft size={32} />
      </button>

      <div 
        className={styles.imageContainer} 
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {currentMediaType === 'video' ? (
          <video
            key={imageKey}
            ref={videoRef}
            src={currentItem.url}
            className={`${styles.image} ${styles.video} ${isAnimating ? styles.animating : ''}`}
            controls
            autoPlay
            muted={false}
            playsInline
          />
        ) : (
          <img
            key={imageKey}
            src={currentItem.url}
            alt={currentItem.filename}
            className={`${styles.image} ${isAnimating ? styles.animating : ''}`}
          />
        )}
      </div>

      <button
        className={`${styles.sideNav} ${styles.next}`}
        onClick={(e) => { e.stopPropagation(); nextImage(); }}
        aria-label="Next item"
      >
        <ArrowRight size={32} />
      </button>
    </div>,
    document.body
  );
};