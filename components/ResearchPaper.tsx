import React, { useState, useRef } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import styles from './ResearchPaper.module.css';
import { ImageLightbox } from './ImageLightbox';
import { Skeleton } from './Skeleton';

// Helper function to detect media type from file extension
const detectMediaType = (item: { url: string; filename: string }): 'image' | 'video' => {
  const urlLower = (item.url || '').toLowerCase();
  const filenameLower = (item.filename || '').toLowerCase();
  const videoExtensions = ['.mp4', '.webm', '.mov', '.ogg', '.avi'];
  
  const hasVideoExtension = videoExtensions.some(ext => 
    urlLower.endsWith(ext) || filenameLower.endsWith(ext)
  );
  
  return hasVideoExtension ? 'video' : 'image';
};

interface ResearchPaperProps {
  title: string;
  field: string;
  date: string;
  abstract: string;
  methodology: string[];
  keyFindings: string[];
  images?: Array<{
    filename: string;
    url: string;
  }>;
  resources: Array<{
    label: string;
    url: string;
  }>;
  className?: string;
}

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Collapsible.Root open={isOpen} onOpenChange={setIsOpen} className={styles.section}>
      <Collapsible.Trigger className={styles.sectionHeader}>
        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        <h3>{title}</h3>
      </Collapsible.Trigger>
      <Collapsible.Content className={styles.sectionContent}>
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

const ImageThumbnail: React.FC<{ image: { url: string; filename: string }, onClick: () => void }> = ({ image, onClick }) => {
    const [isLoading, setIsLoading] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaType = detectMediaType(image);

    return (
        <div className={styles.imageThumbnailWrapper}>
            {isLoading && <Skeleton className={styles.imageSkeleton} />}
            <button onClick={onClick} className={styles.imageButton} style={{ opacity: isLoading ? 0 : 1 }}>
                {mediaType === 'video' ? (
                    <video
                        ref={videoRef}
                        src={image.url}
                        className={styles.imageThumbnail}
                        muted
                        playsInline
                        preload="metadata"
                        onLoadedMetadata={() => setIsLoading(false)}
                        onError={() => setIsLoading(false)}
                    />
                ) : (
                    <img
                        src={image.url}
                        alt={image.filename}
                        className={styles.imageThumbnail}
                        onLoad={() => setIsLoading(false)}
                        onError={() => setIsLoading(false)}
                    />
                )}
                <span className={styles.imageFilename}>{image.filename}</span>
            </button>
        </div>
    );
};

export const ResearchPaper: React.FC<ResearchPaperProps> = ({
  title,
  field,
  date,
  abstract,
  methodology,
  keyFindings,
  images,
  resources,
  className,
}) => {
  const [lightboxState, setLightboxState] = useState<{ isOpen: boolean; index: number }>({ isOpen: false, index: 0 });

  const openLightbox = (index: number) => {
    setLightboxState({ isOpen: true, index });
  };

  const closeLightbox = () => {
    setLightboxState({ isOpen: false, index: 0 });
  };

  return (
    <div className={`${styles.container} ${className ?? ''}`}>
      <header className={styles.header}>
        <div className={styles.headerLine}>
          <span><span className={styles.headerLabel}>TITLE:</span> <span className={styles.headerValue}>{title}</span></span>
        </div>
        <div className={styles.headerLine}>
          <div className={styles.headerInfo}>
            <span><span className={styles.headerLabel}>FIELD:</span> <span className={styles.headerValue}>{field}</span></span>
            <span className={styles.separator}>|</span>
            <span><span className={styles.headerLabel}>DATE:</span> <span className={styles.headerValue}>{date}</span></span>
          </div>
        </div>
      </header>

      <main className={styles.content}>
        <CollapsibleSection title="ABSTRACT">
          <p className={styles.abstractText}>{abstract}</p>
        </CollapsibleSection>

        <div className={styles.divider} />

        <CollapsibleSection title="METHODOLOGY">
          <ul className={styles.bulletList}>
            {methodology.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CollapsibleSection>

        <div className={styles.divider} />

        <CollapsibleSection title="KEY_FINDINGS">
          <ul className={styles.bulletList}>
            {keyFindings.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CollapsibleSection>

        {images && images.length > 0 && (
          <>
            <div className={styles.divider} />
            <CollapsibleSection title={`PLOTS_&_FIGURES [${images.length} FILES]`}>
              <div className={styles.imageGrid}>
                {images.map((image, index) => (
                  <ImageThumbnail key={index} image={image} onClick={() => openLightbox(index)} />
                ))}
              </div>
            </CollapsibleSection>
          </>
        )}

        <div className={styles.divider} />

        <CollapsibleSection title="RESOURCES">
          <div className={styles.resourcesGrid}>
            {resources.map((resource, index) => (
              <a key={index} href={resource.url} target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>
                <span>{resource.label}</span>
                <ExternalLink size={16} />
              </a>
            ))}
          </div>
        </CollapsibleSection>
      </main>

      {lightboxState.isOpen && images && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxState.index}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
};