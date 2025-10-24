import React, { useState, useCallback, useRef, useEffect } from "react";
import styles from "./Desktop.module.css";
import { DotGrid } from "./DotGrid";
import { Taskbar } from "./Taskbar";
import { Window } from "./Window";
import { DesktopIcon } from "./DesktopIcon";
import { SkillsMatrix } from "./SkillsMatrix";
import { ImageLogWidget } from "./ImageLogWidget";
import { ActivityFeed, ActivityLog } from "./ActivityFeed";
import {
  portfolioData,
  WindowId,
  WindowConfig,
} from "../helpers/portfolioData";
import {
  Folder,
  FileText,
  Mail,
  User,
  Award,
  Bot,
  Network,
} from "lucide-react";
import { OperatorAssistant } from "./OperatorAssistant";

const ICONS_MAP: { [key: string]: React.ElementType } = {
  PROJECT_ARCHIVES: Folder,
  LEADERSHIP_OPS: Folder,
  AGENT_PROFILE: User,
  ACHIEVEMENTS: Award,
  SECURE_COMMS: Mail,
  OPERATOR_ASSISTANT: Bot,
  ALGORITHM_SANDBOX: Network,
  ScamDetector: FileText,
  GNN_Vulnerability: FileText,
  TAVIS_SciLens: FileText,
  digiLQD: FileText,
  digiHere: FileText,
  digiCherish: FileText,
  Student_Council: FileText,
  The_Algitect: FileText,
  Green_Vietnam: FileText,
};

const DAEMON_MESSAGES = [
  "Pushing commit...",
  "Syncing data...",
  "Running security protocols...",
  "Compiling C++ modules...",
  "Training ML models...",
  "Optimizing neural networks...",
  "Updating dependency graphs...",
  "Processing vulnerability scans...",
];

const getTimestamp = (): string => {
  const now = new Date();
  return [
    now.getHours().toString().padStart(2, "0"),
    now.getMinutes().toString().padStart(2, "0"),
    now.getSeconds().toString().padStart(2, "0"),
  ].join(":");
};

export const Desktop: React.FC<{
  className?: string;
  onReplayBoot?: () => void;
}> = ({ className, onReplayBoot }) => {
  const [windows, setWindows] = useState<WindowConfig[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<WindowId | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [lastClick, setLastClick] = useState<{
    x: number;
    y: number;
    timestamp: number;
  } | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [openedWindows, setOpenedWindows] = useState<Set<WindowId>>(new Set());
  const desktopRef = useRef<HTMLDivElement>(null);

  // Initialize with some DAEMON logs
  useEffect(() => {
    const initialLogs: ActivityLog[] = [
      {
        timestamp: getTimestamp(),
        type: "DAEMON",
        message: "System initialization complete...",
      },
      {
        timestamp: getTimestamp(),
        type: "DAEMON",
        message: "Loading portfolio modules...",
      },
    ];
    setActivityLogs(initialLogs);
  }, []);

  // Generate periodic DAEMON logs
  useEffect(() => {
    const generateDaemonLog = () => {
      const message =
        DAEMON_MESSAGES[Math.floor(Math.random() * DAEMON_MESSAGES.length)];
      const newLog: ActivityLog = {
        timestamp: getTimestamp(),
        type: "DAEMON",
        message,
      };
      setActivityLogs((prev) => [...prev, newLog]);
    };

    // Random interval between 8-12 seconds
    const scheduleNext = () => {
      const delay = 8000 + Math.random() * 4000;
      return setTimeout(() => {
        generateDaemonLog();
        timeoutRef.current = scheduleNext();
      }, delay);
    };

    const timeoutRef = { current: scheduleNext() };

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      setLastClick({ x: e.clientX, y: e.clientY, timestamp: Date.now() });
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const openWindow = useCallback((id: WindowId) => {
    const windowData = portfolioData.windows[id];
    if (!windowData) return;

    setWindows((prev) => {
      const existingIndex = prev.findIndex((w) => w.id === id);
      if (existingIndex !== -1) {
        // Window exists, just bring it to front
        const existingWindow = prev[existingIndex];
        const restWindows = [
          ...prev.slice(0, existingIndex),
          ...prev.slice(existingIndex + 1),
        ];
        return [...restWindows, existingWindow];
      }

      // Window doesn't exist, add it and log USER action
      setOpenedWindows((prevOpened) => {
        if (!prevOpened.has(id)) {
          // First time opening this window, log it
          const newLog: ActivityLog = {
            timestamp: getTimestamp(),
            type: "USER",
            message: `Accessing ${windowData.title}...`,
          };
          setActivityLogs((prevLogs) => [...prevLogs, newLog]);
          return new Set([...prevOpened, id]);
        }
        return prevOpened;
      });

      return [...prev, { ...windowData, zIndex: prev.length }];
    });
    setActiveWindowId(id);
  }, []);

  const closeWindow = useCallback(
    (id: WindowId) => {
      setWindows((prev) => prev.filter((w) => w.id !== id));
      if (activeWindowId === id) {
        setActiveWindowId(
          windows.length > 1 ? windows[windows.length - 2].id : null,
        );
      }
    },
    [activeWindowId, windows],
  );

  const focusWindow = useCallback((id: WindowId) => {
    setActiveWindowId(id);
    setWindows((prev) => {
      const windowIndex = prev.findIndex((w) => w.id === id);
      if (windowIndex === -1 || windowIndex === prev.length - 1) {
        return prev; // Already focused or not found
      }
      const windowToFocus = prev[windowIndex];
      const otherWindows = [
        ...prev.slice(0, windowIndex),
        ...prev.slice(windowIndex + 1),
      ];
      return [...otherWindows, windowToFocus];
    });
  }, []);

  // Auto-open AGENT_PROFILE on first load
  useEffect(() => {
    openWindow("AGENT_PROFILE");
  }, [openWindow]);

  return (
    <div ref={desktopRef} className={`${styles.desktop} ${className || ""}`}>
      <DotGrid lastClick={lastClick} />

      {/* Custom Cursor */}
      <div
        className={`${styles.customCursor} ${isClicking ? styles.clicking : ""}`}
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
        }}
      >
        <div className={styles.cursorDot}></div>
        <div className={styles.cursorOutline}></div>
      </div>

      <div className={styles.desktopIcons}>
        {portfolioData.desktopIcons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            icon={icon.icon}
            label={icon.label}
            type={icon.type}
            onClick={() => {
              if (icon.externalUrl) {
                window.open(icon.externalUrl, "_blank", "noopener,noreferrer");
              } else {
                openWindow(icon.id as WindowId);
              }
            }}
          />
        ))}
      </div>

      <div className={styles.widgets}>
        <ImageLogWidget openWindow={openWindow} />
        <SkillsMatrix openWindow={openWindow} />
      </div>

      {/* Activity Feed - Bottom Left */}
      <div className={styles.activityFeedContainer}>
        <ActivityFeed activityLogs={activityLogs} />
      </div>

      {windows.map((win, index) => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          icon={ICONS_MAP[win.iconId || win.id] || FileText}
          customIconUrl={win.customIconUrl}
          initialPosition={win.initialPosition}
          initialSize={win.initialSize}
          zIndex={10 + index}
          isActive={win.id === activeWindowId}
          onClose={() => closeWindow(win.id)}
          onFocus={() => focusWindow(win.id)}
        >
          <win.content openWindow={openWindow} />
        </Window>
      ))}

      <Taskbar
        openWindows={windows}
        activeWindowId={activeWindowId}
        onFocus={focusWindow}
        onReplayBoot={onReplayBoot}
      />

      <OperatorAssistant openWindow={openWindow} />
    </div>
  );
};
