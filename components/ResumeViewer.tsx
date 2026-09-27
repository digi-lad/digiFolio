import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { sanityClient } from '../helpers/sanity';
import styles from './ResumeViewer.module.css';

export const ResumeViewer: React.FC = () => {
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

  // If Google Drive link is used as fallback, we must convert it to a preview link for iframes to work.
  let pdfUrl = profileData?.resumeUrl || "https://drive.google.com/file/d/1VT5y9VedovUcUyIwK6skPES53Tvs6JfX/view?usp=sharing";
  if (pdfUrl.includes("drive.google.com") && pdfUrl.includes("/view")) {
    pdfUrl = pdfUrl.replace("/view?usp=sharing", "/preview");
  }

  return (
    <div className={styles.container}>
      <iframe src={pdfUrl} className={styles.iframe} title="Resume PDF Viewer" />
    </div>
  );
};
