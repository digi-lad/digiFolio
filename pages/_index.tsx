import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import styles from './_index.module.css';
import { BootSequence } from '../components/BootSequence';
import { Desktop } from '../components/Desktop';
import { MobileView } from '../components/MobileView';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return isMobile;
};

const IndexPage = () => {
  const [bootComplete, setBootComplete] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (sessionStorage.getItem('bootComplete') === 'true') {
      setBootComplete(true);
    }
  }, []);

  const handleBootComplete = () => {
    sessionStorage.setItem('bootComplete', 'true');
    setBootComplete(true);
  };

  const handleReplayBoot = () => {
    console.log('Replaying boot sequence...');
    sessionStorage.removeItem('bootComplete');
    setBootComplete(false);
  };

  return (
    <>
      <Helmet>
        <title>DIGILAD.OS | Nhan Le's Portfolio</title>
        <meta name="description" content="The command center portfolio of Le Viet Thanh Nhan, showcasing projects, skills, and achievements in a high-tech OS-themed interface." />
        <style>{`
          body {
            background-color: #1E1F29;
            color: #E0E0E0;
            font-family: var(--font-family-monospace);
          }
        `}</style>
      </Helmet>
      <div className={styles.container}>
        {!bootComplete && !isMobile ? (
          <BootSequence onComplete={handleBootComplete} />
        ) : (
          isMobile ? <MobileView /> : <Desktop onReplayBoot={handleReplayBoot} />
        )}
      </div>
    </>
  );
};

export default IndexPage;