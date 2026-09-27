import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { sanityClient } from '../helpers/sanity';
import styles from './ResumeViewer.module.css';

interface ResumeType {
  type: string;
  url?: string;
  fileUrl?: string;
}

export const ResumeViewer: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile', 'resumes'],
    queryFn: async () => {
      return sanityClient.fetch(`*[_type == "profile"][0]{
        ...,
        resumes[]{
          ...,
          "fileUrl": file.asset->url
        }
      }`);
    }
  });

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <span className={styles.loadingText}>[FETCHING SECURE DOCUMENT...]</span>
      </div>
    );
  }

  // Fallback to legacy single resumeUrl if the resumes array isn't populated yet
  let resumes: ResumeType[] = profileData?.resumes || [];
  if (resumes.length === 0) {
    resumes = [{ 
      type: 'General CV', 
      url: profileData?.resumeUrl || "https://drive.google.com/file/d/1VT5y9VedovUcUyIwK6skPES53Tvs6JfX/view?usp=sharing" 
    }];
  }

  const selectedResume = resumes[selectedIndex] || resumes[0];
  let originalPdfUrl = selectedResume?.fileUrl || selectedResume?.url || "";
  
  // Format Google Drive links as fallback
  let embedUrl = originalPdfUrl;
  if (embedUrl.includes("drive.google.com") && embedUrl.includes("/view")) {
    embedUrl = embedUrl.replace("/view?usp=sharing", "/preview");
  }

  // Fetch Sanity PDFs as blobs to guarantee Native Viewer bypasses any CSP
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isBlobLoading, setIsBlobLoading] = useState(false);

  React.useEffect(() => {
    if (originalPdfUrl && originalPdfUrl.includes("cdn.sanity.io")) {
      setIsBlobLoading(true);
      fetch(originalPdfUrl)
        .then(res => res.blob())
        .then(blob => {
          const pdfBlob = new Blob([blob], { type: 'application/pdf' });
          const url = URL.createObjectURL(pdfBlob);
          setBlobUrl(url);
          setIsBlobLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch PDF blob:", err);
          setIsBlobLoading(false);
        });
    } else {
      setBlobUrl(null);
    }

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [originalPdfUrl]);

  const displayUrl = blobUrl || embedUrl;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {resumes.length > 1 && (
          <div className={styles.tabs}>
            {resumes.map((resume, idx) => (
              <button 
                key={idx} 
                className={`${styles.tab} ${selectedIndex === idx ? styles.activeTab : ''}`}
                onClick={() => setSelectedIndex(idx)}
              >
                {resume.type}
              </button>
            ))}
          </div>
        )}
        <div className={styles.headerActions}>
          {originalPdfUrl && (
            <a href={originalPdfUrl} target="_blank" rel="noopener noreferrer" className={styles.downloadButton}>
              Download PDF
            </a>
          )}
        </div>
      </div>
      <div className={styles.iframeWrapper}>
        {isBlobLoading ? (
           <div className={styles.loadingContainer}>
             <span className={styles.loadingText}>[INITIALIZING NATIVE VIEWER...]</span>
           </div>
        ) : displayUrl ? (
          <object data={displayUrl} type="application/pdf" className={styles.iframe} aria-label={`Resume - ${selectedResume?.type}`}>
            <p className={styles.fallbackText}>Your browser does not support viewing PDFs natively. <a href={originalPdfUrl} target="_blank" rel="noopener noreferrer">Click here to download it</a>.</p>
          </object>
        ) : (
          <div className={styles.loadingContainer}>
            <span className={styles.loadingText}>[NO PDF CONFIGURED]</span>
          </div>
        )}
      </div>
    </div>
  );
};
