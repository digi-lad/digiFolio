import React, { useState, useEffect, useMemo } from "react";
import styles from "./OperatorDossier.module.css";
import { ImageLightbox } from "./ImageLightbox";

interface OperatorDossierProps {
  name: string;
  education: string;
  sat: string;
  ielts: string;
  bio: string;
  avatarUrl?: string;
  gallery?: Array<{
    filename: string;
    url: string;
  }>;
  className?: string;
}

const useTypingEffect = (lines: string[], typingSpeed: number = 30) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>(
    Array(lines.length).fill(""),
  );
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const type = () => {
      if (lineIndex >= lines.length) {
        setIsTyping(false);
        return;
      }

      const currentLine = lines[lineIndex];
      if (charIndex < currentLine.length) {
        setDisplayedLines((prev) => {
          const newLines = [...prev];
          newLines[lineIndex] = currentLine.substring(0, charIndex + 1);
          return newLines;
        });
        charIndex++;
        timeoutId = setTimeout(type, typingSpeed);
      } else {
        lineIndex++;
        charIndex = 0;
        timeoutId = setTimeout(type, typingSpeed * 5); // Pause between lines
      }
    };

    timeoutId = setTimeout(type, typingSpeed);

    return () => clearTimeout(timeoutId);
  }, [lines, typingSpeed]);

  return { displayedLines, isTyping };
};

export const OperatorDossier: React.FC<OperatorDossierProps> = ({
  name,
  education,
  sat,
  ielts,
  bio,
  avatarUrl,
  gallery,
  className,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);
  const linesToType = useMemo(() => {
    const scoresText = `SAT ${sat} | IELTS ${ielts}`;
    return [name, education, scoresText, bio];
  }, [name, education, sat, ielts, bio]);

  const { displayedLines, isTyping } = useTypingEffect(linesToType);

  const [nameTyped, educationTyped, scoresTyped, bioTyped] = displayedLines;

  const MAX_VISIBLE_IMAGES = 1;
  const hasGallery = gallery && gallery.length > 0;
  const visibleImages = hasGallery ? gallery.slice(0, MAX_VISIBLE_IMAGES) : [];
  const remainingCount = hasGallery
    ? Math.max(0, gallery.length - MAX_VISIBLE_IMAGES)
    : 0;

  const handleThumbnailClick = (index: number) => {
    if (!gallery) return;
    setLightboxStartIndex(index);
    setLightboxOpen(true);
  };

  const handlePlusButtonClick = () => {
    if (!gallery) return;
    setLightboxStartIndex(1);
    setLightboxOpen(true);
  };

  const renderTextWithCursor = (
    text: string,
    fullText: string,
    lineIndex: number,
  ) => {
    // Only show cursor if still typing
    if (!isTyping) {
      return <>{text}</>;
    }

    // Check if this is the current line being typed
    const isPreviousLineComplete =
      lineIndex === 0 ||
      displayedLines[lineIndex - 1] === linesToType[lineIndex - 1];
    const isCurrentLine =
      isPreviousLineComplete && text.length < fullText.length;
    const isLastLineBeingTyped =
      lineIndex === linesToType.length - 1 &&
      text === fullText &&
      displayedLines
        .slice(0, lineIndex)
        .every((line, idx) => line === linesToType[idx]);

    return (
      <>
        {text}
        {(isCurrentLine || isLastLineBeingTyped) && (
          <span className={styles.cursor} />
        )}
      </>
    );
  };

  return (
    <div className={`${styles.container} ${className ?? ""}`}>
      <header className={styles.header}>
        <span className={styles.clearanceBadge}>[CODENAME: DIGILAD]</span>
      </header>
      <main className={styles.mainContent}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarWrapper}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Operator Avatar"
                className={styles.avatarImage}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>AVATAR</div>
            )}
            <div className={styles.scanline}></div>
          </div>
          {hasGallery && (
            <div className={styles.gallerySection}>
              <label className={styles.galleryLabel}>IMAGE ARCHIVE</label>
              <div className={styles.galleryGrid}>
                {visibleImages.map((image, index) => (
                  <div
                    key={index}
                    className={styles.galleryThumbnail}
                    onClick={() => handleThumbnailClick(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleThumbnailClick(index);
                      }
                    }}
                    aria-label={`View ${image.filename}`}
                  >
                    <img src={image.url} alt={image.filename} />
                  </div>
                ))}
                {remainingCount > 0 && (
                  <div
                    className={styles.plusButton}
                    onClick={handlePlusButtonClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handlePlusButtonClick();
                      }
                    }}
                    aria-label={`View ${remainingCount} more images`}
                  >
                    +{remainingCount}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className={styles.profileSection}>
          <div className={styles.profileField}>
            <label>NAME</label>
            <p>{renderTextWithCursor(nameTyped, name, 0)}</p>
          </div>
          <div className={styles.separator}></div>
          <div className={styles.profileField}>
            <label>EDUCATION</label>
            <p>{renderTextWithCursor(educationTyped, education, 1)}</p>
          </div>
          <div className={styles.separator}></div>
          <div className={styles.profileField}>
            <label>SCORES</label>
            <p>{renderTextWithCursor(scoresTyped, linesToType[2], 2)}</p>
          </div>
          <div className={styles.separator}></div>
          <div className={styles.profileField}>
            <label>BIO</label>
            <p className={styles.bioText}>
              {renderTextWithCursor(bioTyped, bio, 3)}
            </p>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <span className={styles.statusIndicator}>
          <span className={styles.statusDot}></span>
          STATUS: AUTHENTICATED
        </span>
      </footer>
      {lightboxOpen && gallery && (
        <ImageLightbox
          images={gallery}
          initialIndex={lightboxStartIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
};
