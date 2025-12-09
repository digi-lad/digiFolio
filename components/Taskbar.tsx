import React, { useState, useEffect } from 'react';
import styles from './Taskbar.module.css';
import { WindowConfig, WindowId } from '../helpers/portfolioData';
import { Folder, FileText, Mail, User, Award, Bot, Network, RotateCcw } from 'lucide-react';

const ICONS_MAP: { [key: string]: React.ElementType } = {
  PROJECT_ARCHIVES: Folder,
  LEADERSHIP_OPS: Folder,
  AGENT_PROFILE: User,
  ACHIEVEMENTS: Award,
  SECURE_COMMS: Mail,
  ScamDetector: FileText,
  GNN_Vulnerability: FileText,
  TAVIS_STEM_Lens: FileText,
  digiLQD: FileText,
  digiHere: FileText,
  digiCherish: FileText,
  Student_Council: FileText,
  The_Algitect: FileText,
  Green_Vietnam: FileText,
  OPERATOR_ASSISTANT: Bot,
  ALGORITHM_SANDBOX: Network,
};

interface TaskbarProps {
  openWindows: WindowConfig[];
  activeWindowId: WindowId | null;
  onFocus: (id: WindowId) => void;
  onReplayBoot?: () => void;
  className?: string;
}

export const Taskbar: React.FC<TaskbarProps> = ({ openWindows, activeWindowId, onFocus, onReplayBoot, className }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: 'short',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    
    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const parts = formatter.formatToParts(date);
    
    const day = parts.find(p => p.type === 'day')?.value;
    const month = parts.find(p => p.type === 'month')?.value.toUpperCase();
    const year = parts.find(p => p.type === 'year')?.value;
    const hour = parts.find(p => p.type === 'hour')?.value;
    const minute = parts.find(p => p.type === 'minute')?.value;
    const second = parts.find(p => p.type === 'second')?.value;
    
    return `${day}.${month}.${year} | ${hour}:${minute}:${second} ICT`;
  };

  return (
    <div className={`${styles.taskbar} ${className || ''}`}>
            <div className={styles.left}>
        {onReplayBoot && (
          <button
            className={styles.restartButton}
            onClick={onReplayBoot}
            title="Replay Boot Sequence"
          >
            <RotateCcw size={14} strokeWidth={2} />
          </button>
        )}
        <span className={styles.logo}>DIGILAD. OS</span>
      </div>
      <div className={styles.center}>
        {openWindows.map(win => {
          const Icon = ICONS_MAP[win.iconId || win.id] || FileText;
          return (
            <button
              key={win.id}
              className={`${styles.windowTab} ${win.id === activeWindowId ? styles.active : ''}`}
              onClick={() => onFocus(win.id)}
            >
              <Icon size={16} strokeWidth={1.5} />
              <span>{win.title}</span>
            </button>
          );
        })}
      </div>
      <div className={styles.right}>
        <span className={styles.clock}>{formatTime(time)}</span>
      </div>
    </div>
  );
};