import React, { useState } from 'react';
import { ImageLightbox } from './ImageLightbox';
import { detectMediaType } from '../helpers/mediaTypeDetection';
import styles from './ImageLogGrid.module.css';

// This should match the one in ImageLightbox.
interface MediaItem {
  filename: string;
  url: string;
  type?: 'image' | 'video';
}

interface ImageLogGridProps {
  images: MediaItem[];
  className?: string;
}

export const ImageLogGrid: React.FC<ImageLogGridProps> = ({ images, className }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <>
      <div className={`${styles.gridContainer} ${className ?? ''}`}>
        {images.map((image, index) => {
          const mediaType = detectMediaType(image);
          
          return (
            <button key={index} className={styles.gridItem} onClick={() => openLightbox(index)}>
              {mediaType === 'video' ? (
                <video
                  src={image.url}
                  className={styles.thumbnail}
                  muted
                  autoPlay
                  loop
                  playsInline
                />
              ) : (
                <img src={image.url} alt={image.filename} className={styles.thumbnail} />
              )}
              <span className={styles.filename}>{image.filename}</span>
            </button>
          );
        })}
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={images}
          initialIndex={selectedIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  );
};