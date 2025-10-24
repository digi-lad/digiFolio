import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { Mail, Phone, Linkedin, Github, Instagram, Facebook } from 'lucide-react';
import styles from './SecureComms.module.css';

export interface Channel {
  id: string;
  label: string;
  icon: ReactNode;
  url?: string;
  value: string;
  type: 'copy' | 'link';
}

interface SecureCommsProps {
  channels: Channel[];
  className?: string;
}

interface TerminalLine {
  id: number;
  text: string;
  type: 'normal' | 'progress' | 'success' | 'error' | 'info' | 'final';
  progress?: number;
}

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  const filledCount = Math.round(progress / 10);
  const emptyCount = 10 - filledCount;
  const filled = '█'.repeat(filledCount);
  const empty = '░'.repeat(emptyCount);
  return (
    <span className={styles.progressText}>
      <span className={styles.progressBar}>[{filled}{empty}]</span> {progress}%
    </span>
  );
};

export const SecureComms: React.FC<SecureCommsProps> = ({ channels, className }) => {
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    { id: 0, text: '// SELECT CHANNEL TO INITIATE CONTACT', type: 'info' },
  ]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  const [showCopiedFeedback, setShowCopiedFeedback] = useState(false);

  const animationTimeoutRef = useRef<NodeJS.Timeout[]>([]);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cmdInputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const clearAnimationTimers = () => {
    animationTimeoutRef.current.forEach(clearTimeout);
    animationTimeoutRef.current = [];
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLines]);

  useEffect(() => {
    return () => clearAnimationTimers();
  }, []);

  const addTerminalLine = (text: string, type: TerminalLine['type'], progress?: number) => {
    setTerminalLines(prev => [
      ...prev,
      { id: Date.now() + Math.random(), text, type, progress },
    ]);
  };

  const updateLastTerminalLine = (text: string, type: TerminalLine['type'], progress?: number) => {
    setTerminalLines(prev => {
      const newLines = [...prev];
      const lastLine = newLines[newLines.length - 1];
      if (lastLine) {
        lastLine.text = text;
        lastLine.type = type;
        lastLine.progress = progress;
      }
      return newLines;
    });
  };

  const runAnimation = (channel: Channel, skip = false) => {
    clearAnimationTimers();
    setIsAnimating(true);
    setTerminalLines([]);

    const steps = [
      () => addTerminalLine(`> EXECUTING: ${channel.label}`, 'normal'),
      () => addTerminalLine(`> INITIALIZING SECURE CHANNEL: ${channel.label}...`, 'normal'),
      () => addTerminalLine(`> ENCRYPTING COMMUNICATION PROTOCOL...`, 'normal'),
      () => {
        addTerminalLine('> ', 'progress', 0);
        let progress = 0;
        progressIntervalRef.current = setInterval(() => {
          progress += 5;
          if (progress <= 100) {
            updateLastTerminalLine('> ', 'progress', progress);
          } else {
            clearInterval(progressIntervalRef.current!);
          }
        }, 50);
      },
      () => addTerminalLine('> ESTABLISHING CONNECTION...', 'normal'),
      () => addTerminalLine('> CONNECTION SECURED ✓', 'success'),
      () => addTerminalLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info'),
      () => addTerminalLine(channel.value, 'final'),
      () => setIsAnimating(false),
    ];

    if (skip) {
      setTerminalLines([
        { id: 1, text: `> EXECUTING: ${channel.label}`, type: 'normal' },
        { id: 2, text: `> CONNECTION SECURED ✓`, type: 'success' },
        { id: 3, text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'info' },
        { id: 4, text: channel.value, type: 'final' },
      ]);
      setIsAnimating(false);
      return;
    }

    let delay = 0;
    steps.forEach((step, index) => {
      const timeout = setTimeout(() => {
        step();
      }, delay);
      animationTimeoutRef.current.push(timeout);
      delay += index === 3 ? 2100 : 500;
    });
  };

  const handleChannelSelect = (channelId: string) => {
    if (isAnimating) return;
    const channel = channels.find(c => c.id === channelId);
    if (channel) {
      setSelectedChannelId(channelId);
      runAnimation(channel);
    }
  };

  const handleCommand = (command: string) => {
    const lowerCaseCommand = command.toLowerCase().trim();
    if (!lowerCaseCommand) return;

    const channel = channels.find(c => c.id === lowerCaseCommand);
    if (channel) {
      handleChannelSelect(channel.id);
    } else if (lowerCaseCommand === 'clear') {
      clearAnimationTimers();
      setIsAnimating(false);
      setSelectedChannelId(null);
      setTerminalLines([{ id: 0, text: '// SELECT CHANNEL TO INITIATE CONTACT', type: 'info' }]);
    } else if (lowerCaseCommand === 'help') {
      setTerminalLines([]);
      addTerminalLine('AVAILABLE COMMANDS:', 'info');
      channels.forEach(c => addTerminalLine(`- ${c.id}`, 'normal'));
      addTerminalLine('- clear', 'normal');
      addTerminalLine('- help', 'normal');
    } else {
      addTerminalLine(`ERROR: UNKNOWN COMMAND '${command}'. TYPE 'help' FOR AVAILABLE COMMANDS.`, 'error');
    }
    setCommandInput('');
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setShowCopiedFeedback(true);
      setTimeout(() => setShowCopiedFeedback(false), 2000);
    });
  };

  const getLineTypeClass = (type: TerminalLine['type']): string => {
    switch (type) {
      case 'normal': return styles.normal;
      case 'progress': return ''; // progress doesn't have a specific style class
      case 'success': return styles.success;
      case 'error': return styles.error;
      case 'info': return styles.info;
      case 'final': return styles.final;
    }
  };

  const selectedChannel = channels.find(c => c.id === selectedChannelId);

  return (
    <div className={`${styles.container} ${className ?? ''}`}>
      <div className={styles.leftPanel}>
        <div className={styles.directory}>
          <h2 className={styles.panelTitle}>DIRECTORY</h2>
          <ul className={styles.channelList}>
            {channels.map(channel => (
              <li key={channel.id}>
                <button
                  className={`${styles.channelButton} ${selectedChannelId === channel.id ? styles.active : ''}`}
                  onClick={() => handleChannelSelect(channel.id)}
                  disabled={isAnimating}
                >
                  <span className={styles.activeIndicator}>➤</span>
                  {channel.icon}
                  <span>{channel.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.cmdInputWrapper}>
          <label htmlFor="cmdInput" className={styles.cmdLabel}>CMD INPUT:</label>
          <div className={styles.cmdInputContainer} onClick={() => cmdInputRef.current?.focus()}>
            <span className={styles.cmdPrompt}>&gt;</span>
            <input
              ref={cmdInputRef}
              id="cmdInput"
              type="text"
              className={styles.cmdInput}
              value={commandInput}
              onChange={e => setCommandInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCommand(commandInput)}
              disabled={isAnimating}
              autoComplete="off"
              spellCheck="false"
            />
          </div>
        </div>
      </div>
      <div className={styles.rightPanel}>
        <header className={styles.terminalHeader}>
          <h2 className={styles.panelTitle}>TERMINAL</h2>
          {isAnimating && (
            <button className={styles.skipButton} onClick={() => selectedChannel && runAnimation(selectedChannel, true)}>
              [SKIP &gt;&gt;]
            </button>
          )}
        </header>
        <div className={styles.terminal}>
          {terminalLines.map(line => (
            <div key={line.id} className={`${styles.terminalLine} ${getLineTypeClass(line.type)}`}>
              {line.type === 'progress' ? (
                <>
                  {line.text}
                  <ProgressBar progress={line.progress ?? 0} />
                </>
              ) : (
                line.text
              )}
            </div>
          ))}
          {!isAnimating && selectedChannel && (
            <div className={styles.actionButtonContainer}>
              {selectedChannel.type === 'copy' ? (
                <button className={styles.actionButton} onClick={() => handleCopy(selectedChannel.value)}>
                  {showCopiedFeedback ? '✓ COPIED' : '[COPY TO CLIPBOARD]'}
                </button>
              ) : (
                <a href={selectedChannel.url} target="_blank" rel="noopener noreferrer" className={styles.actionButton}>
                  [OPEN IN NEW TAB]
                </a>
              )}
            </div>
          )}
          {!isAnimating && selectedChannel && (
             <div className={`${styles.terminalLine} ${styles.success}`}>CHANNEL STATUS: ACTIVE</div>
          )}
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
};