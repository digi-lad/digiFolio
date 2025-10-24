import React, { useRef, useEffect } from 'react';
import styles from './DotGrid.module.css';

interface DotGridProps {
  className?: string;
  lastClick?: { x: number; y: number; timestamp: number } | null;
}

export const DotGrid: React.FC<DotGridProps> = ({ className, lastClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clickWaveRef = useRef<{ x: number; y: number; startTime: number; radius: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const dots: { x: number; y: number; radius: number; maxRadius: number; speed: number; opacity: number; baseOpacity: number; isActive: boolean; clickActivation: number }[] = [];
    const mouse = { x: 0, y: 0 };
    const interactionRadius = 200;
    const connectionRadius = 150;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      dots.length = 0;
      init();
    };

    const init = () => {
      const dotCount = Math.floor((canvas.width * canvas.height) / 10000);
      for (let i = 0; i < dotCount; i++) {
        const baseOpacity = Math.random() * 0.3 + 0.1;
        dots.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 1,
          maxRadius: 4,
          speed: Math.random() * 0.2 + 0.1,
          opacity: baseOpacity,
          baseOpacity: baseOpacity,
          isActive: false,
          clickActivation: 0,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const now = Date.now();
      
      // Update click wave
      if (clickWaveRef.current) {
        const elapsed = now - clickWaveRef.current.startTime;
        const duration = 1200; // Wave duration in ms
        
        if (elapsed < duration) {
          // Expand the wave
          clickWaveRef.current.radius = (elapsed / duration) * 500; // Max radius 500px
        } else {
          clickWaveRef.current = null;
        }
      }
      
      // Update dots
      dots.forEach(dot => {
        // Mouse hover interaction
        const dist = Math.hypot(dot.x - mouse.x, dot.y - mouse.y);
        let targetRadius = 1;
        let targetOpacity = dot.baseOpacity;
        dot.isActive = false;
        
        if (dist < interactionRadius) {
          dot.isActive = true;
          const intensity = 1 - dist / interactionRadius;
          targetRadius = Math.max(1, dot.maxRadius * intensity);
          targetOpacity = Math.min(1, dot.baseOpacity + intensity * 0.7);
        }
        
        // Click wave activation
        if (clickWaveRef.current) {
          const clickDist = Math.hypot(dot.x - clickWaveRef.current.x, dot.y - clickWaveRef.current.y);
          const waveRadius = clickWaveRef.current.radius;
          const waveThickness = 80; // How thick the activation wave is
          
          // Check if dot is near the wave front
          if (Math.abs(clickDist - waveRadius) < waveThickness) {
            const waveIntensity = 1 - Math.abs(clickDist - waveRadius) / waveThickness;
            dot.clickActivation = Math.max(dot.clickActivation, waveIntensity);
            dot.isActive = true;
          }
        }
        
        // Decay click activation
        dot.clickActivation *= 0.95;
        
        // Apply click activation effect
        if (dot.clickActivation > 0.1) {
          dot.isActive = true;
          targetRadius = Math.max(targetRadius, 1 + dot.maxRadius * dot.clickActivation);
          targetOpacity = Math.max(targetOpacity, dot.baseOpacity + dot.clickActivation * 0.8);
        }
        
        dot.radius += (targetRadius - dot.radius) * 0.15;
        dot.opacity += (targetOpacity - dot.opacity) * 0.15;

        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        
        if (dot.isActive) {
          // Orange glow for active dots
          ctx.fillStyle = `rgba(217, 138, 87, ${dot.opacity})`;
          
          // Add glow effect
          ctx.shadowBlur = 10 + (dot.clickActivation * 15);
          ctx.shadowColor = 'rgba(217, 138, 87, 0.8)';
        } else {
          ctx.fillStyle = `rgba(224, 224, 224, ${dot.opacity})`;
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw connecting lines between nearby active dots
      const activeDots = dots.filter(dot => dot.isActive);
      for (let i = 0; i < activeDots.length; i++) {
        for (let j = i + 1; j < activeDots.length; j++) {
          const dotA = activeDots[i];
          const dotB = activeDots[j];
          const distance = Math.hypot(dotA.x - dotB.x, dotA.y - dotB.y);
          
          if (distance < connectionRadius) {
            const baseOpacity = (1 - distance / connectionRadius) * 0.4;
            // Boost opacity if either dot has click activation
            const clickBoost = Math.max(dotA.clickActivation, dotB.clickActivation) * 0.4;
            const opacity = baseOpacity + clickBoost;
            ctx.beginPath();
            ctx.moveTo(dotA.x, dotA.y);
            ctx.lineTo(dotB.x, dotB.y);
            ctx.strokeStyle = `rgba(217, 138, 87, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Handle click events from parent
  useEffect(() => {
    if (lastClick) {
      clickWaveRef.current = {
        x: lastClick.x,
        y: lastClick.y,
        startTime: lastClick.timestamp,
        radius: 0,
      };
    }
  }, [lastClick]);

  return <canvas ref={canvasRef} className={`${styles.dotGrid} ${className || ''}`} />;
};