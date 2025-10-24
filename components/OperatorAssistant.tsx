import React from 'react';
import { Bot } from 'lucide-react';
import styles from './OperatorAssistant.module.css';
import { WindowId } from '../helpers/portfolioData';

interface OperatorAssistantProps {
  openWindow: (id: WindowId) => void;
  className?: string;
}

export const OperatorAssistant: React.FC<OperatorAssistantProps> = ({ openWindow, className }) => {
  const handleClick = () => {
    openWindow('OPERATOR_ASSISTANT');
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div
        className={styles.launcher}
        onClick={handleClick}
        role="button"
        aria-label="Open Operator Assistant"
      >
        <Bot size={18} />
        <span className={styles.launcherTitle}>OPERATOR ASSISTANT</span>
        <div className={styles.status}>
          <span className={styles.statusDot} />
          <span>STATUS: ONLINE</span>
        </div>
      </div>
    </div>
  );
};