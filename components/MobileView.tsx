import React from 'react';
import styles from './MobileView.module.css';
import { portfolioData, WindowId } from '../helpers/portfolioData';
import { Folder, FileText, Mail, User, Award } from 'lucide-react';

const ICONS_MAP: { [key: string]: React.ElementType } = {
  PROJECT_ARCHIVES: Folder,
  LEADERSHIP_OPS: Folder,
  AGENT_PROFILE: User,
  ACHIEVEMENTS: Award,
  SECURE_COMMS: Mail,
  ScamDetector: FileText,
  GNN_Vulnerability: FileText,
  Student_Council: FileText,
  The_Algitect: FileText,
};

const sectionOrder: WindowId[] = [
  'AGENT_PROFILE',
  'ACHIEVEMENTS',
  'PROJECT_ARCHIVES',
  'LEADERSHIP_OPS',
  'SECURE_COMMS',
];

export const MobileView: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <header className={styles.header}>
        <h1>DIGILAD. OS</h1>
        <p>Le Viet Thanh Nhan's Portfolio</p>
      </header>
      <main className={styles.main}>
        {sectionOrder.map(id => {
          const windowData = portfolioData.windows[id];
          if (!windowData) return null;
          const Icon = ICONS_MAP[windowData.iconId || windowData.id];
          return (
            <section key={id} className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Icon size={20} />
                <span>{windowData.title}</span>
              </h2>
              <div className={styles.sectionContent}>
                <windowData.content openWindow={() => {}} />
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
};