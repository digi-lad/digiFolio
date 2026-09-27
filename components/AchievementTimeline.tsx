import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './AchievementTimeline.module.css';
import { useQuery } from '@tanstack/react-query';
import { sanityClient } from '../helpers/sanity';

import type { Tag, Achievement, YearlyAchievements } from '../helpers/achievementsData';

const getTagClass = (tag: Tag) => {
  switch (tag) {
    case 'International':
      return styles.tagInternational;
    case 'National':
      return styles.tagNational;
    case 'Sub-national':
      return styles.tagSubNational;
    case 'Provincial':
      return styles.tagProvincial;
    default:
      return '';
  }
};

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const canExpand = !!achievement.awardedBy;

  const toggleExpand = () => {
    if (canExpand) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div
      className={`${styles.card} ${achievement.highlighted ? styles.highlighted : ''}`}
      onClick={toggleExpand}
      style={{ cursor: canExpand ? 'pointer' : 'default' }}
    >
      <div className={styles.cardHeader}>
        <span className={`${styles.tagBadge} ${getTagClass(achievement.tag)}`}>{achievement.tag}</span>
        {canExpand && (
          <ChevronDown
            className={styles.chevron}
            data-expanded={isExpanded}
            size={18}
          />
        )}
      </div>
      <h3 className={styles.cardTitle}>{achievement.title}</h3>
      <div
        ref={contentRef}
        className={styles.expandableContent}
        style={{
          maxHeight: isExpanded ? `${contentRef.current?.scrollHeight}px` : '0px',
        }}
      >
        <div className={styles.awardedBy}>
          <p className={styles.awardedByLabel}>Awarded by:</p>
          <p>{achievement.awardedBy}</p>
        </div>
      </div>
    </div>
  );
};

interface AchievementTimelineProps {
  className?: string;
}

export const AchievementTimeline: React.FC<AchievementTimelineProps> = ({ className }) => {
  const yearRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { data: achievements, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const result = await sanityClient.fetch(`*[_type == "profile"][0].achievements`);
      return result || [];
    }
  });

  const achievementsData = useMemo(() => {
    const data: YearlyAchievements = {};
    if (!achievements) return data;
    
    achievements.forEach((ach: any) => {
      if (!data[ach.year]) data[ach.year] = {};
      if (!data[ach.year][ach.month]) data[ach.year][ach.month] = [];
      data[ach.year][ach.month].push(ach);
    });
    return data;
  }, [achievements]);

  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.inView);
          }
        });
      },
      { threshold: 0.1 }
    );

    yearRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      yearRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [achievementsData, isLoading]);

  if (isLoading) {
    return (
      <div className={`${styles.timelineContainer} ${className ?? ''}`}>
        <div style={{ color: 'var(--text-accent)', padding: '20px', fontFamily: 'monospace' }}>
          FETCHING DATA FROM SANITY...
        </div>
      </div>
    );
  }

  const years = Object.keys(achievementsData).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className={`${styles.timelineContainer} ${className ?? ''}`}>
      <div className={styles.timelineTrunk} />
      {years.map((year, yearIndex) => (
        <div
          key={year}
          className={styles.yearSection}
          ref={(el) => { yearRefs.current[yearIndex] = el; }}
        >
          <div className={styles.yearMarker}>
            <span>{year}</span>
          </div>
          <div className={styles.monthsContainer}>
            {Object.entries(achievementsData[year]).map(([month, monthAchievements], monthIndex) => (
              <div key={month} className={styles.monthBranch} style={{ animationDelay: `${monthIndex * 0.1}s` }}>
                <div className={styles.node} />
                <div className={styles.branchLine}>
                  <span className={styles.monthLabel}>{month}</span>
                </div>
                <div className={styles.cardsContainer}>
                  {monthAchievements.map((achievement, cardIndex) => (
                    <AchievementCard
                      key={cardIndex}
                      achievement={achievement}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};