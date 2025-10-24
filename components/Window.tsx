import React, { useState, useRef, useEffect } from 'react';
import styles from './Window.module.css';
import { X } from 'lucide-react';

interface WindowProps {
  id: string;
  title: string;
  icon: React.ElementType;
  customIconUrl?: string;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  zIndex: number;
  isActive: boolean;
  onClose: () => void;
  onFocus: () => void;
  className?: string;
}

type ResizeType = 'corner' | 'bottom' | 'right' | null;

const MIN_WIDTH = 300;
const MIN_HEIGHT = 200;

export const Window: React.FC<WindowProps> = ({
  id,
  title,
  icon: Icon,
  customIconUrl,
  children,
  initialPosition = { x: 150, y: 100 },
  initialSize = { width: 600, height: 400 },
  zIndex,
  isActive,
  onClose,
  onFocus,
  className,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<ResizeType>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    onFocus();
    setIsDragging(true);
    const windowRect = windowRef.current?.getBoundingClientRect();
    if (windowRect) {
      dragOffset.current = {
        x: e.clientX - windowRect.left,
        y: e.clientY - windowRect.top,
      };
    }
    e.preventDefault();
  };

  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>, type: ResizeType) => {
    if (e.button !== 0) return;
    onFocus();
    setIsResizing(type);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    };
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y,
        });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;

        let newWidth = resizeStart.current.width;
        let newHeight = resizeStart.current.height;

        if (isResizing === 'corner' || isResizing === 'right') {
          newWidth = Math.max(MIN_WIDTH, resizeStart.current.width + deltaX);
        }

        if (isResizing === 'corner' || isResizing === 'bottom') {
          newHeight = Math.max(MIN_HEIGHT, resizeStart.current.height + deltaY);
        }

        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(null);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, size.width, size.height]);

  return (
    <div
      ref={windowRef}
      className={`${styles.window} ${isActive ? styles.active : ''} ${className || ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: zIndex,
      }}
      onMouseDown={onFocus}
    >
      <div className={styles.titleBar} onMouseDown={handleMouseDown}>
        <div className={styles.titleInfo}>
          {customIconUrl ? (
            <img src={customIconUrl} alt="" className={styles.customIcon} />
          ) : (
            <Icon size={16} strokeWidth={1.5} />
          )}
          <span className={styles.titleText}>{title}</span>
        </div>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close window">
          <X size={16} />
        </button>
      </div>
      <div className={styles.content}>
        {children}
      </div>
      
      {/* Resize handles */}
      <div 
        className={`${styles.resizeHandle} ${styles.resizeRight}`}
        onMouseDown={(e) => handleResizeMouseDown(e, 'right')}
      />
      <div 
        className={`${styles.resizeHandle} ${styles.resizeBottom}`}
        onMouseDown={(e) => handleResizeMouseDown(e, 'bottom')}
      />
      <div 
        className={`${styles.resizeHandle} ${styles.resizeCorner}`}
        onMouseDown={(e) => handleResizeMouseDown(e, 'corner')}
      />
    </div>
  );
};