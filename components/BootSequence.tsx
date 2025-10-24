import React, { useState, useEffect, useRef, JSX } from "react";
import styles from "./BootSequence.module.css";

const bootLines = [
  "ESTABLISHING SECURE CONNECTION...",
  "CONNECTION SECURED.",
  "---",
  "AUTHENTICATING OPERATOR...",
  "ID: Le Viet Thanh Nhan",
  "CODENAME: digiLad",
  "---",
  "AUTHENTICATION COMPLETE.",
  "---",
  "INITIATING DIGILAD. OS [v2.0.25]",
  "---",
  "LOADING CORE MODULES...",
  "module_social_responsibility.engine [OK]",
  "module_resilience_determination.engine [OK]",
  "---",
  "INITIALIZING OPERATING PRINCIPLES...",
  "directive_technological_advancement.exe [ACTIVE]",
  "directive_secured_AI.exe [ACTIVE]",
  "protocol_societal_development.sys [ACTIVE]",
  "directive_empowerment_leadership.dll [ACTIVE]",
  "protocol_knowledge_sharing.init [ACTIVE]",
  "---",
  "RENDERING COMMAND CENTER ...",
  "---",
  "BUILD CODE. BUILD SOCIETY.",
  "---",
  "WELCOME, DIGILAD.",
];

// Pauses after section separators (---) in milliseconds
const sectionPauses: { [key: number]: number } = {};

interface BootSequenceProps {
  onComplete: () => void;
  className?: string;
}

const getLineStyle = (line: string): { color?: string; bold?: boolean } => {
  // Orange & Bold
  if (
    line.includes("Le Viet Thanh Nhan") ||
    line.includes("digiLad") ||
    line === "BUILD CODE. BUILD SOCIETY." ||
    line.includes("DIGILAD")
  ) {
    return { color: "#D98A57", bold: true };
  }

  // Green for [OK], [ACTIVE], VERIFIED
  if (
    line.includes("[OK]") ||
    line.includes("[ACTIVE]") ||
    line.includes("VERIFIED")
  ) {
    return { color: "#4CAF50" };
  }

  // Cyan for module and directive/protocol lines
  if (
    line.startsWith("module_") ||
    line.startsWith("directive_") ||
    line.startsWith("protocol_")
  ) {
    return { color: "#00BCD4" };
  }

  return {};
};

// Get typing speed in milliseconds per character based on line content
const getTypingSpeed = (line: string): number => {
  // FAST (15-20ms per character) - Technical/data lines
  if (
    line.startsWith("module_") ||
    line.startsWith("directive_") ||
    line.startsWith("protocol_") ||
    line.includes("VERIFIED")
  ) {
    return 10; // 17.5ms / 1.25 = 14ms
  }

  // SLOW (50-60ms per character) - Dramatic/important lines
  if (
    line.includes("INITIATING DIGILAD. OS") ||
    line.includes("ID: Le Viet Thanh Nhan") ||
    line.includes("CODENAME: digiLad") ||
    line === "BUILD CODE. BUILD SOCIETY." ||
    line.includes("WELCOME, DIGILAD")
  ) {
    return 30; // 55ms / 1.25 = 44ms
  }

  // MEDIUM (30-35ms per character) - Standard narrative lines (default)
  return 20; // 32.5ms / 1.25 = 26ms
};

const renderStyledLine = (line: string) => {
  const style = getLineStyle(line);

  // For lines with [OK], [ACTIVE], or VERIFIED, we need to color just those parts
  if (
    line.includes("[OK]") ||
    line.includes("[ACTIVE]") ||
    line.includes("VERIFIED")
  ) {
    const parts: JSX.Element[] = [];
    let remaining = line;
    let key = 0;

    // Handle [OK]
    while (remaining.includes("[OK]")) {
      const index = remaining.indexOf("[OK]");
      if (index > 0) {
        parts.push(
          <span key={key++} className={styles.cyan}>
            {remaining.substring(0, index)}
          </span>,
        );
      }
      parts.push(
        <span key={key++} className={styles.green}>
          [OK]
        </span>,
      );
      remaining = remaining.substring(index + 4);
    }

    // Handle [ACTIVE]
    while (remaining.includes("[ACTIVE]")) {
      const index = remaining.indexOf("[ACTIVE]");
      if (index > 0) {
        parts.push(
          <span key={key++} className={styles.cyan}>
            {remaining.substring(0, index)}
          </span>,
        );
      }
      parts.push(
        <span key={key++} className={styles.green}>
          [ACTIVE]
        </span>,
      );
      remaining = remaining.substring(index + 8);
    }

    // Handle VERIFIED
    while (remaining.includes("VERIFIED")) {
      const index = remaining.indexOf("VERIFIED");
      if (index > 0) {
        parts.push(<span key={key++}>{remaining.substring(0, index)}</span>);
      }
      parts.push(
        <span key={key++} className={styles.green}>
          VERIFIED
        </span>,
      );
      remaining = remaining.substring(index + 8);
    }

    if (remaining) {
      parts.push(<span key={key++}>{remaining}</span>);
    }

    return <>{parts}</>;
  }

  // For orange bold lines
  if (style.color === "#D98A57") {
    return <span className={styles.orangeBold}>{line}</span>;
  }

  // For cyan lines
  if (style.color === "#00BCD4") {
    return <span className={styles.cyan}>{line}</span>;
  }

  return <>{line}</>;
};

// Get all line indices that belong to a section starting from startIndex
const getSectionIndices = (startIndex: number): number[] => {
  const indices: number[] = [];
  for (let i = startIndex; i < bootLines.length; i++) {
    if (bootLines[i] === "---" && i > startIndex) {
      break;
    }
    indices.push(i);
  }
  return indices;
};

export const BootSequence: React.FC<BootSequenceProps> = ({
  onComplete,
  className,
}) => {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const currentCharIndexRef = useRef(0);
  const currentLineIndexRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // Scanline effect - CRT monitor style with static lines + moving beam
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let scanlineY = 0;
    const scanlineDuration = 9000; // 9 seconds to traverse the screen
    const scanlineHeight = 2; // 2px height
    const staticLineSpacing = 4; // 4px between static lines
    let startTime = Date.now();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw static horizontal scanlines across entire screen
      // Orange color: rgb(217, 138, 87) = rgba(217, 138, 87, opacity)
      ctx.fillStyle = "rgba(217, 138, 87, 0.025)";
      for (let y = 0; y < canvas.height; y += staticLineSpacing) {
        ctx.fillRect(0, y, canvas.width, 1);
      }

      // Draw the moving scanline
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % scanlineDuration) / scanlineDuration;
      scanlineY = progress * canvas.height;

      // Draw the moving scanline with orange glow effect
      const gradient = ctx.createLinearGradient(
        0,
        scanlineY - 10,
        0,
        scanlineY + 10,
      );
      gradient.addColorStop(0, "rgba(217, 138, 87, 0)");
      gradient.addColorStop(0.4, "rgba(217, 138, 87, 0.05)");
      gradient.addColorStop(0.5, "rgba(217, 138, 87, 0.15)");
      gradient.addColorStop(0.6, "rgba(217, 138, 87, 0.05)");
      gradient.addColorStop(1, "rgba(217, 138, 87, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanlineY - 10, canvas.width, 20);

      // Draw the core moving scanline
      ctx.fillStyle = "rgba(217, 138, 87, 0.12)";
      ctx.fillRect(
        0,
        scanlineY - scanlineHeight / 2,
        canvas.width,
        scanlineHeight,
      );

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const typeLine = (lineIndex: number) => {
      if (lineIndex >= bootLines.length) {
        setIsComplete(true);
        setTimeout(onComplete, 500);
        return;
      }

      currentLineIndexRef.current = lineIndex;
      const line = bootLines[lineIndex];

      // If it's a separator, add it instantly and move to next
      if (line === "---") {
        setLines((prev) => [...prev, ""]);
        const pause = sectionPauses[lineIndex] || 200;
        pauseTimeoutRef.current = setTimeout(() => {
          pauseTimeoutRef.current = null;
          typeLine(lineIndex + 1);
        }, pause);
        return;
      }

      let charIndex = 0;
      currentCharIndexRef.current = 0;
      setLines((prev) => [...prev, ""]);
      isTypingRef.current = true;

      const charDelay = getTypingSpeed(line);
      console.log(
        `Typing line ${lineIndex}: "${line}" at ${charDelay}ms per character`,
      );

      const interval = setInterval(() => {
        if (charIndex < line.length) {
          setLines((prev) => {
            const newLines = [...prev];
            newLines[lineIndex] = line.substring(0, charIndex + 1);
            return newLines;
          });
          charIndex++;
          currentCharIndexRef.current = charIndex;
        } else {
          clearInterval(interval);
          typingIntervalRef.current = null;
          isTypingRef.current = false;
          const pause = sectionPauses[lineIndex] || 200;
          pauseTimeoutRef.current = setTimeout(() => {
            pauseTimeoutRef.current = null;
            typeLine(lineIndex + 1);
          }, pause);
        }
      }, charDelay);

      typingIntervalRef.current = interval;
    };

    const timeout = setTimeout(() => typeLine(0), 500);
    return () => {
      clearTimeout(timeout);
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [onComplete]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  const handleClick = () => {
    const currentIndex = currentLineIndexRef.current;

    // Get all indices in the current section
    const sectionIndices = getSectionIndices(currentIndex);

    console.log(
      "Click detected - current line:",
      currentIndex,
      "section indices:",
      sectionIndices,
    );

    // Clear any active typing or pause
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
    isTypingRef.current = false;

    // Complete all lines in the current section instantly
    setLines((prev) => {
      const newLines = [...prev];
      // Ensure we have enough lines
      while (newLines.length <= sectionIndices[sectionIndices.length - 1]) {
        newLines.push("");
      }
      // Fill in all lines in the section
      sectionIndices.forEach((idx) => {
        newLines[idx] = bootLines[idx];
      });
      return newLines;
    });

    // Find the next section start (after the next ---)
    let nextSectionStart = sectionIndices[sectionIndices.length - 1] + 1;

    // Skip the --- separator if it's there
    if (
      nextSectionStart < bootLines.length &&
      bootLines[nextSectionStart] === "---"
    ) {
      setLines((prev) => {
        const newLines = [...prev];
        while (newLines.length <= nextSectionStart) {
          newLines.push("");
        }
        return newLines;
      });
      nextSectionStart++;
    }

    // Start typing the next section
    if (nextSectionStart < bootLines.length) {
      currentLineIndexRef.current = nextSectionStart;
      typeLine(nextSectionStart);
    } else {
      setIsComplete(true);
      setTimeout(onComplete, 500);
    }
  };

  const typeLine = (lineIndex: number) => {
    if (lineIndex >= bootLines.length) {
      setIsComplete(true);
      setTimeout(onComplete, 500);
      return;
    }

    currentLineIndexRef.current = lineIndex;
    const line = bootLines[lineIndex];

    // If it's a separator, add it instantly and move to next
    if (line === "---") {
      setLines((prev) => {
        const newLines = [...prev];
        while (newLines.length <= lineIndex) {
          newLines.push("");
        }
        return newLines;
      });
      const pause = sectionPauses[lineIndex] || 200;
      pauseTimeoutRef.current = setTimeout(() => {
        pauseTimeoutRef.current = null;
        typeLine(lineIndex + 1);
      }, pause);
      return;
    }

    let charIndex = 0;
    currentCharIndexRef.current = 0;
    setLines((prev) => {
      const newLines = [...prev];
      while (newLines.length <= lineIndex) {
        newLines.push("");
      }
      return newLines;
    });
    isTypingRef.current = true;

    const charDelay = getTypingSpeed(line);
    console.log(
      `Typing line ${lineIndex}: "${line}" at ${charDelay}ms per character`,
    );

    const interval = setInterval(() => {
      if (charIndex < line.length) {
        setLines((prev) => {
          const newLines = [...prev];
          newLines[lineIndex] = line.substring(0, charIndex + 1);
          return newLines;
        });
        charIndex++;
        currentCharIndexRef.current = charIndex;
      } else {
        clearInterval(interval);
        typingIntervalRef.current = null;
        isTypingRef.current = false;
        const pause = sectionPauses[lineIndex] || 200;
        pauseTimeoutRef.current = setTimeout(() => {
          pauseTimeoutRef.current = null;
          typeLine(lineIndex + 1);
        }, pause);
      }
    }, charDelay);

    typingIntervalRef.current = interval;
  };

  return (
    <div
      className={`${styles.container} ${isComplete ? styles.fadeOut : ""} ${className || ""}`}
      onClick={handleClick}
    >
      <canvas ref={canvasRef} className={styles.scanlineCanvas} />
      <div ref={containerRef} className={styles.textContainer}>
        {lines.map((line, index) => {
          const originalLine = bootLines[index];
          if (originalLine === "---") {
            return (
              <p key={index} className={styles.line}>
                &nbsp;
              </p>
            );
          }

          return (
            <p key={index} className={styles.line}>
              {renderStyledLine(line)}
              {index === lines.length - 1 &&
                index < bootLines.length - 1 &&
                !isComplete && <span className={styles.caret}>_</span>}
            </p>
          );
        })}
      </div>
    </div>
  );
};
