import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './ActivityFeed.module.css';

export interface ActivityLog {
  timestamp: string;
  type: 'DAEMON' | 'USER';
  message: string;
}

interface ActivityFeedProps {
  className?: string;
  activityLogs: ActivityLog[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ className, activityLogs }) => {
  const [displayedLogs, setDisplayedLogs] = useState<Map<number, string>>(new Map());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastLogCountRef = useRef(0);

  // Type out the newest log character by character
  useEffect(() => {
    if (activityLogs.length === 0) return;
    
    const newLogIndex = activityLogs.length - 1;
    const newLog = activityLogs[newLogIndex];
    
    // Only animate if this is a newly added log
    if (activityLogs.length > lastLogCountRef.current) {
      lastLogCountRef.current = activityLogs.length;
      
      const fullText = `[${newLog.timestamp}] [${newLog.type}] ${newLog.message}`;
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        currentIndex++;
        setDisplayedLogs(prev => {
          const updated = new Map(prev);
          updated.set(newLogIndex, fullText.substring(0, currentIndex));
          return updated;
        });
        
        if (currentIndex >= fullText.length) {
          clearInterval(typingInterval);
        }
      }, 20); // 20ms per character for smooth typing
      
      return () => clearInterval(typingInterval);
    }
  }, [activityLogs]);

  // Auto-scroll to bottom when new log appears
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedLogs]);

  // Show last 1 log
  const visibleLogs = activityLogs.slice(-1);

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div 
        className={styles.titleBar} 
        onClick={() => setIsCollapsed(!isCollapsed)}
        role="button"
        aria-expanded={!isCollapsed}
        aria-controls="activity-feed-content"
      >
        <h3 className={styles.title}>LIVE ACTIVITY FEED</h3>
        <ChevronDown 
          className={`${styles.chevron} ${isCollapsed ? styles.chevronCollapsed : ''}`}
          size={16}
        />
      </div>
      <div 
        id="activity-feed-content"
        className={`${styles.feedWrapper} ${isCollapsed ? styles.collapsed : ''}`} 
        ref={scrollRef}
      >
        {visibleLogs.map((log, index) => {
          const actualIndex = activityLogs.length - visibleLogs.length + index;
          const displayText = displayedLogs.get(actualIndex) || 
                            `[${log.timestamp}] [${log.type}] ${log.message}`;
          
          return (
            <div
              key={actualIndex}
              className={`${styles.feedItem} ${log.type === 'DAEMON' ? styles.daemon : styles.user}`}
            >
              {displayText}
            </div>
          );
        })}
      </div>
    </div>
  );
};