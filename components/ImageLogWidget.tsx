import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./ImageLogWidget.module.css";
import { WindowId } from "../helpers/portfolioData";

interface MediaItem {
  filename: string;
  url: string;
  type?: "image" | "video";
}

import { useQuery } from '@tanstack/react-query';
import { sanityClient } from '../helpers/sanity';


interface ImageLogWidgetProps {
  className?: string;
  openWindow?: (id: WindowId) => void;
}

export const ImageLogWidget: React.FC<ImageLogWidgetProps> = ({
  className,
  openWindow,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageKey, setImageKey] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { data: imageLogData = [], isLoading } = useQuery({
    queryKey: ['imageLog'],
    queryFn: async () => {
      const result = await sanityClient.fetch(`*[_type == "imageLog"] | order(_createdAt desc)`);
      return result as MediaItem[];
    }
  });

  const advanceSlide = useCallback(() => {
    if (imageLogData.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageLogData.length);
    setImageKey((prev) => prev + 1);
  }, [imageLogData]);

  useEffect(() => {
    const startInterval = () => {
      intervalRef.current = setInterval(advanceSlide, 4000);
    };

    const stopInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    if (!isHovered) {
      startInterval();
    } else {
      stopInterval();
    }

    return () => stopInterval();
  }, [isHovered, advanceSlide]);

  const handleClick = () => {
    if (openWindow) {
      openWindow("IMAGE_LOG");
    }
  };

  if (isLoading || imageLogData.length === 0) {
    return <div className={`${styles.container} ${className || ""}`}><h3 className={styles.title}>LOADING...</h3></div>;
  }

  const currentImage = imageLogData[currentIndex];

  return (
    <div
      className={`${styles.container} ${className || ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className={styles.title}>IMAGE LOG</h3>
      <div className={styles.header}>
        <span className={styles.filename}>{currentImage.filename}</span>
        <span className={styles.counter}>
          {currentIndex + 1}/{imageLogData.length}
        </span>
      </div>
      <div className={styles.imageWrapper} onClick={handleClick}>
        {currentImage.type === "video" ? (
          <video
            key={imageKey}
            src={currentImage.url}
            className={styles.image}
            muted
            autoPlay
            loop
            playsInline
          />
        ) : (
          <img
            key={imageKey}
            src={currentImage.url}
            alt={currentImage.filename}
            className={styles.image}
          />
        )}
      </div>
    </div>
  );
};
