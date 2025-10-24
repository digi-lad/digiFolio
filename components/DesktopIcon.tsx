import React from 'react';
import styles from './DesktopIcon.module.css';

interface DesktopIconProps {
  icon: React.ElementType | string;
  label: string;
  type?: 'folder' | 'file';
  onClick: () => void;
  className?: string;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, label, type, onClick, className }) => {
  const getFileExtension = () => {
    const parts = label.split('.');
    return parts.length > 1 ? `.${parts.pop()}` : '';
  };

  return (
    <button className={`${styles.iconButton} ${className || ''}`} onClick={onClick}>
      <div className={styles.iconWrapper}>
        {typeof icon === 'string' ? (
          <img src={icon} alt={label} className={styles.icon} />
        ) : (
          React.createElement(icon, { className: styles.icon, size: 48, strokeWidth: 1 })
        )}
        {type === 'file' && <span className={styles.extension}>{getFileExtension()}</span>}
      </div>
      <span className={styles.label}>{label}</span>
    </button>
  );
};