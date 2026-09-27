import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { sanityClient } from '../helpers/sanity';
import styles from './ResumeViewer.module.css';

interface ResumeType {
  type: string;
  url: string;
}

export const ResumeViewer: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      return sanityClient.fetch(`*[_type == "profile"][0]`);
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
  let pdfUrl = selectedResume.url;
  
  if (pdfUrl.includes("drive.google.com") && pdfUrl.includes("/view")) {
    pdfUrl = pdfUrl.replace("/view?usp=sharing", "/preview");
  }

  return (
    <div className={styles.container}>
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
      <div className={styles.iframeWrapper}>
        <iframe src={pdfUrl} className={styles.iframe} title={`Resume - ${selectedResume.type}`} />
      </div>
    </div>
  );
};
