import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import styles from "./SkillsMatrix.module.css";
import { WindowId } from "../helpers/portfolioData";

const data = [
  { subject: "Problem-solving", A: 90, fullMark: 100 },
  { subject: "Leadership", A: 80, fullMark: 100 },
  { subject: "Creativity", A: 75, fullMark: 100 },
  { subject: "Initiative", A: 85, fullMark: 100 },
  { subject: "AI/ML", A: 75, fullMark: 100 },
];

interface SkillTooltipContent {
  score: string;
  description: string;
  linkText: string;
  windowId: WindowId;
}

const tooltipContent: Record<string, SkillTooltipContent> = {
  "Problem-solving": {
    score: "9.0/10",
    description:
      "Award-winning competitive programmer with proven algorithmic thinking",
    linkText: "View Achievements →",
    windowId: "ACHIEVEMENTS",
  },
  Leadership: {
    score: "8.0/10",
    description:
      "Led Student Council, founded The Algitect, and orchestrated many other activities",
    linkText: "View Leadership Ops →",
    windowId: "LEADERSHIP_OPS",
  },
  Creativity: {
    score: "7.5/10",
    description: "Built innovative AI-powered solutions and research projects",
    linkText: "View Projects →",
    windowId: "PROJECT_ARCHIVES",
  },
  Initiative: {
    score: "8.5/10",
    description:
      "Self-motivated learner who takes initiative in academic and extracurricular pursuits",
    linkText: "View Profile →",
    windowId: "AGENT_PROFILE",
  },
  "AI/ML": {
    score: "7.5/10",
    description:
      "Silver medalist in Vietnam AI Championship, researched GNN vulnerabilities",
    linkText: "View Projects →",
    windowId: "PROJECT_ARCHIVES",
  },
};

// Factory function to create CustomLabel component with access to parent state/handlers
const createCustomLabel = (
  activeTooltip: string | null,
  handleLabelClick: (skill: string, event: React.MouseEvent) => void,
  styles: any,
) => {
  return (props: any) => {
    const { x, y, payload, cx, cy } = props;
    const skill = payload.value;
    const isActive = activeTooltip === skill;

    // Calculate text anchor based on position relative to center
    // Use cx (center x) provided by recharts to properly determine alignment
    let textAnchor: "start" | "middle" | "end" = "middle";
    const threshold = 5; // Small threshold to treat near-center as middle

    if (cx !== undefined) {
      if (x - cx > threshold) {
        textAnchor = "start";
      } else if (x - cx < -threshold) {
        textAnchor = "end";
      }
    }

    // Split long labels with parentheses into multiple lines
    const splitLabel = (label: string): string[] => {
      // Check if label has parentheses at the end
      const parenMatch = label.match(/^(.+?)(\s*\([^)]+\))$/);
      if (parenMatch) {
        return [parenMatch[1].trim(), parenMatch[2].trim()];
      }
      // For other long labels (>15 characters), return as single line for now
      return [label];
    };

    const lines = splitLabel(skill);
    const isMultiLine = lines.length > 1;
    const lineHeight = 1.2; // em units
    const fontSize = 12;

    return (
      <g>
        <text
          x={x}
          y={y}
          textAnchor={textAnchor}
          fill={isActive ? "#F2A365" : "#E0E0E0"}
          fontSize={fontSize}
          className={styles.skillLabel}
          onClick={(e) => handleLabelClick(skill, e as any)}
          style={{ cursor: "pointer", transition: "fill 0.2s ease" }}
        >
          {isMultiLine ? (
            <>
              <tspan x={x} dy={`-${(lineHeight * fontSize) / 2}px`}>
                {lines[0]}
              </tspan>
              <tspan x={x} dy={`${lineHeight * fontSize}px`}>
                {lines[1]}
              </tspan>
            </>
          ) : (
            skill
          )}
        </text>
      </g>
    );
  };
};

export const SkillsMatrix: React.FC<{
  className?: string;
  openWindow?: (id: WindowId) => void;
}> = ({ className, openWindow }) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveTooltip(null);
      }
    };

    if (activeTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeTooltip]);

  const adjustTooltipPosition = (
    desiredX: number,
    desiredY: number,
    tooltipWidth: number,
    tooltipHeight: number,
    containerRect: DOMRect,
  ) => {
    let adjustedX = desiredX;
    let adjustedY = desiredY;

    // Convert container-relative coordinates to viewport coordinates for boundary checking
    const viewportX = containerRect.left + desiredX;
    const viewportY = containerRect.top + desiredY;

    // Check right boundary
    if (viewportX + tooltipWidth / 2 > window.innerWidth - 10) {
      adjustedX =
        window.innerWidth - containerRect.left - tooltipWidth / 2 - 10;
    }

    // Check left boundary
    if (viewportX - tooltipWidth / 2 < 10) {
      adjustedX = tooltipWidth / 2 + 10 - containerRect.left;
    }

    // Check bottom boundary - if tooltip would overflow, position it above the label
    if (viewportY + tooltipHeight > window.innerHeight - 10) {
      // Position above the label instead
      adjustedY = desiredY - tooltipHeight - 20;
    }

    // Check top boundary
    if (containerRect.top + adjustedY < 10) {
      adjustedY = 10 - containerRect.top;
    }

    return { x: adjustedX, y: adjustedY };
  };

  const handleLabelClick = (skill: string, event: React.MouseEvent) => {
    if (activeTooltip === skill) {
      setActiveTooltip(null);
      return;
    }

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();

    if (containerRect) {
      const initialX = rect.left - containerRect.left + rect.width / 2;
      const initialY = rect.top - containerRect.top + rect.height;

      setTooltipPosition({ x: initialX, y: initialY });
      setActiveTooltip(skill);

      // Use requestAnimationFrame to ensure tooltip is rendered before adjusting position
      requestAnimationFrame(() => {
        if (tooltipRef.current) {
          const tooltipRect = tooltipRef.current.getBoundingClientRect();
          const adjusted = adjustTooltipPosition(
            initialX,
            initialY,
            tooltipRect.width,
            tooltipRect.height,
            containerRect,
          );
          setTooltipPosition(adjusted);
        }
      });
    }
  };

  const handleLinkClick = (windowId: WindowId) => {
    if (openWindow) {
      openWindow(windowId);
    }
    setActiveTooltip(null);
  };

  // Use useMemo to create CustomLabel only when dependencies change
  const CustomLabel = useMemo(
    () => createCustomLabel(activeTooltip, handleLabelClick, styles),
    [activeTooltip],
  );

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className || ""}`}
    >
      <h3 className={styles.title}>SKILLS MATRIX</h3>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <PolarGrid stroke="#44475a" />
            <PolarAngleAxis dataKey="subject" tick={CustomLabel} />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="Skills"
              dataKey="A"
              stroke="#D98A57"
              fill="#D98A57"
              fillOpacity={0.6}
              filter="url(#glow)"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {activeTooltip && tooltipContent[activeTooltip] && (
        <div
          ref={tooltipRef}
          className={styles.tooltip}
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y + 10}px`,
          }}
        >
          <div className={styles.tooltipHeader}>
            {activeTooltip}: {tooltipContent[activeTooltip].score}
          </div>
          <div className={styles.tooltipDescription}>
            {tooltipContent[activeTooltip].description}
          </div>
          <div
            className={styles.tooltipLink}
            onClick={() =>
              handleLinkClick(tooltipContent[activeTooltip].windowId)
            }
          >
            {tooltipContent[activeTooltip].linkText}
          </div>
        </div>
      )}
    </div>
  );
};
