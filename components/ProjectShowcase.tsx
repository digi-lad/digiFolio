import React, { useState, useRef } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDown, ChevronRight, CheckCircle2, Zap, ExternalLink } from 'lucide-react';
import styles from './ProjectShowcase.module.css';
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

interface ProjectShowcaseProps {
  name: string;
  type: string;
  status: 'COMPLETED' | 'ACTIVE' | 'ONGOING';
  timeframe: string;
  bootSequence: string;
  sysSpecs: string[];
  buildLog: Array<{
    title: string;
    desc?: string;
  }>;
  images?: Array<{
    filename: string;
    url: string;
  }>;
  accessPoints: Array<{
    label: string;
    url: string;
  }>;
  className?: string;
}

const StatusBadge: React.FC<{ status: ProjectShowcaseProps['status'] }> = ({ status }) => {
  if (status === 'COMPLETED') {
    return <span className={`${styles.statusBadge} ${styles.completed}`}><CheckCircle2 size={14} /> COMPLETED</span>;
  }
  return <span className={`${styles.statusBadge} ${styles.active}`}><Zap size={14} /> {status}</span>;
};

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

const BuildLogEntry: React.FC<{ log: ProjectShowcaseProps['buildLog'][0] }> = ({ log }) => {
  const [isDescOpen, setIsDescOpen] = useState(false);

  if (!log.desc) {
    return (
      <div className={styles.logEntry}>
        <p>
          <span className={styles.logLabel}>LOG:</span>
          {log.title}
        </p>
      </div>
    );
  }

  return (
    <Collapsible.Root open={isDescOpen} onOpenChange={setIsDescOpen} className={styles.logEntry}>
      <Collapsible.Trigger asChild>
        <button className={styles.logTrigger}>
          <p>
            <span className={styles.logLabel}>LOG:</span>
            {log.title}
          </p>
        </button>
      </Collapsible.Trigger>
      <Collapsible.Content className={styles.logDescContent}>
        <p className={styles.logDesc}>
          <span className={styles.logLabel}>DESC:</span>
          {log.desc}
        </p>
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

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({
  name,
  type,
  status,
  timeframe,
  bootSequence,
  sysSpecs,
  buildLog,
  images,
  accessPoints,
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
          <span><span className={styles.headerLabel}>PROJECT:</span> <span className={styles.headerValue}>{name}</span></span>
        </div>
        <div className={styles.headerLine}>
          <div className={styles.headerInfo}>
            <span><span className={styles.headerLabel}>TYPE:</span> <span className={styles.headerValue}>{type}</span></span>
            <span className={styles.separator}>|</span>
            <span><span className={styles.headerLabel}>STATUS:</span> <StatusBadge status={status} /></span>
            <span className={styles.separator}>|</span>
            <span className={styles.timeframe}>{timeframe}</span>
          </div>
        </div>
      </header>

      <main className={styles.content}>
        <CollapsibleSection title="BOOT_SEQUENCE">
          <p className={styles.bootSequenceText}>{bootSequence}</p>
        </CollapsibleSection>

        <div className={styles.divider} />

        <CollapsibleSection title="SYS_SPECS">
          <ul className={styles.specsList}>
            {sysSpecs.map((spec, index) => (
              <li key={index}>{spec}</li>
            ))}
          </ul>
        </CollapsibleSection>

        <div className={styles.divider} />

        <CollapsibleSection title="BUILD_LOG">
          <div className={styles.logContainer}>
            {buildLog.map((log, index) => (
              <BuildLogEntry key={index} log={log} />
            ))}
          </div>
        </CollapsibleSection>

        {images && images.length > 0 && (
          <>
            <div className={styles.divider} />
            <CollapsibleSection title={`UI_GALLERY [${images.length} FILES]`}>
              <div className={styles.imageGrid}>
                {images.map((image, index) => (
                  <ImageThumbnail key={index} image={image} onClick={() => openLightbox(index)} />
                ))}
              </div>
            </CollapsibleSection>
          </>
        )}

        <div className={styles.divider} />

        <CollapsibleSection title="ACCESS_POINTS">
          <div className={styles.accessPointsGrid}>
            {accessPoints.map((point, index) => (
              <a key={index} href={point.url} target="_blank" rel="noopener noreferrer" className={styles.accessPointLink}>
                <span>{point.label}</span>
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