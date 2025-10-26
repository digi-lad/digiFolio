import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send } from 'lucide-react';
import styles from './OperatorAssistantContent.module.css';
import { postAiChat } from '../endpoints/ai/chat_POST.schema';
import { OPERATOR_ASSISTANT_PROMPT } from '../helpers/operatorAssistantPrompt';

type MessageRole = 'system' | 'user' | 'assistant';

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export const OperatorAssistantContent: React.FC<{ className?: string }> = ({ className }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'system-0',
      role: 'system',
      content: OPERATOR_ASSISTANT_PROMPT,
      timestamp: Date.now(),
    },
    {
      id: 'assistant-greeting',
      role: 'assistant',
      content: 'OPERATOR ASSISTANT INITIALIZED.\n\nHello. I am the Operator Assistant for DIGILAD.OS. I have full access to the dossier of Le Viet Thanh Nhan.\n\nHow may I assist you today?',
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming, scrollToBottom]);

  // Wake up sequence
  useEffect(() => {
    const wakeUpAssistant = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '/_api';
        const healthUrl = baseUrl.replace('/_api', '/health');
        const response = await fetch(healthUrl);
        if (response.ok) {
          setIsWakingUp(false);
        } else {
          // Retry after 1 second if health check fails
          setTimeout(() => wakeUpAssistant(), 1000);
        }
      } catch (error) {
        // Retry after 1 second on network errors
        setTimeout(() => wakeUpAssistant(), 1000);
      }
    };
    wakeUpAssistant();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isStreaming) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: Date.now(),
    };

    setInputValue('');
    setIsStreaming(true);

    // Only send system prompt + current user question (no conversation history)
    const apiMessages = [
      { role: 'system' as const, content: OPERATOR_ASSISTANT_PROMPT },
      { role: userMessage.role, content: userMessage.content }
    ];

    // Add user message to UI state
    setMessages(prev => [...prev, userMessage]);

    // Create assistant message placeholder (UI only, not sent to API)
    const assistantMessageId = `assistant-${Date.now()}`;
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, assistantMessage]);

    try {

      // Create abort controller for this request
      abortControllerRef.current = new AbortController();

      const response = await postAiChat(
        { messages: apiMessages },
        { signal: abortControllerRef.current.signal }
      );

      // Check if response is OK before reading the stream
      if (!response.ok) {
        throw new Error(`AI chat request failed with status ${response.status}.`);
      }

      if (!response.body) {
        throw new Error('No response body received from AI service');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;

        // Update the assistant message with accumulated content
        setMessages(prev => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg && lastMsg.id === assistantMessageId) {
            lastMsg.content = accumulatedContent;
          }
          return updated;
        });
      }

      console.log('AI response completed. Length:', accumulatedContent.length);
    } catch (error) {
      console.error('Error during AI chat:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'system',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get AI response. Please try again.'}`,
        timestamp: Date.now(),
      };

      setMessages(prev => {
        // Remove the empty assistant message and add error
        const filtered = prev.filter(m => m.id !== assistantMessageId);
        return [...filtered, errorMessage];
      });
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const getSenderLabel = (role: MessageRole): string => {
    switch (role) {
      case 'system':
        return 'SYSTEM';
      case 'user':
        return 'USER';
      case 'assistant':
        return 'AI';
    }
  };

  const renderMessage = (msg: Message) => {
    const senderClass = msg.role === 'system' ? styles.system : 
                        msg.role === 'user' ? styles.user : 
                        styles.ai;
    return (
      <div key={msg.id} className={`${styles.messageWrapper} ${senderClass}`}>
        <div className={styles.messageBubble}>
          <span className={styles.messagePrefix}>[{getSenderLabel(msg.role)}]</span>
          <span className={styles.messageText}>{msg.content}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.contentWrapper} ${className || ''}`}>
      <div className={styles.messagesArea}>
        {messages.filter(msg => msg.role !== 'system').map(renderMessage)}
        {isStreaming && messages[messages.length - 1]?.content === '' && (
          <div className={`${styles.messageWrapper} ${styles.ai}`}>
            <div className={styles.messageBubble}>
              <span className={styles.messagePrefix}>[AI]</span>
              <span className={`${styles.messageText} ${styles.analyzing}`}>
                analyzing...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className={styles.inputArea} onSubmit={handleSendMessage}>
        <input
          type="text"
          className={styles.inputField}
          placeholder={isWakingUp ? "Operator is waking up..." : "Type your query..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isStreaming || isWakingUp}
        />
        <button type="submit" className={styles.sendButton} disabled={isStreaming || isWakingUp || !inputValue.trim()} aria-label="Send Message">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};