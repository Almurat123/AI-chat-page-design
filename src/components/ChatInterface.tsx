// CONTEXT MEMORY
// Updated: 2026-04-17
// Author: Antigravity
// Reason: 修复 iOS 软键盘收起后布局无法归位的问题。移除过度的 Body 锁定，增加失焦强制重置位移逻辑。
// Goal: 确保键盘弹出时输入框可见，收起后界面完整回弹，无残余位移。
// Owns: 聊天界面的视口适配与位移补偿。
// Document Provenance:
// - Source: Runtime observation on iOS Safari
// - Kind: Bug fix logic
// - Retrieved: 2026-04-17
// - Applied To: Visual Viewport adaptation and input blur reset
// - Verification: Logic verified for offset reset
// See also:
// - system-journal/INDEX.md
// - system-journal/fix-log/2026-04-17-ios-layout-reset.md

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Plus as PlusIcon, ArrowUp, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useStore } from '../store/chatStore';
import { streamChatResponse } from '../lib/gemini';
import { cn } from '../lib/utils';
import { ThinkingLevel } from '@google/genai';
import { useNavigate } from 'react-router-dom';

export function ChatInterface() {
  const navigate = useNavigate();
  const { 
    sessions, 
    currentSessionId, 
    addMessageToCurrent, 
    updateLastMessage,
    createNewSession,
    setCurrentSession,
    model,
    setModel,
    thinkingLevel,
    setThinkingLevel
  } = useStore();
  
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'model' | 'thinking' | null>(null);
  const [viewportOffset, setViewportOffset] = useState(0);
  const [viewportHeight, setViewportHeight] = useState('100dvh');
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  // iOS Keyboard Adaptation using Visual Viewport API
  useEffect(() => {
    if (!window.visualViewport) return;

    const handleResize = () => {
      const viewport = window.visualViewport;
      if (!viewport) return;
      
      // On iOS, offsetTop is > 0 when the keyboard is open and the view is panned.
      // We use this to translate the container so the input stays in view.
      setViewportOffset(viewport.offsetTop);
      
      // Use dynamic viewport height if possible, otherwise fallback to pixels
      if (viewport.offsetTop === 0) {
        setViewportHeight('100dvh');
      } else {
        setViewportHeight(`${viewport.height}px`);
      }

      // Scroll to bottom when keyboard opens
      if (viewport.offsetTop > 0) {
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };

    const handleReset = () => {
      // Force reset when keyboard is likely closing
      setViewportOffset(0);
      setViewportHeight('100dvh');
      // On some iOS versions, we need to scroll body to 0 to fix the "stuck" view
      window.scrollTo(0, 0);
    };

    window.visualViewport.addEventListener('resize', handleResize);
    window.visualViewport.addEventListener('scroll', handleResize);
    
    // Initial call
    handleResize();

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleResize);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.custom-dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage = input.trim();
    setInput('');
    setIsGenerating(true);

    // 0. If no current session (at homepage), create one first
    if (!currentSessionId) {
      createNewSession();
      const newId = useStore.getState().currentSessionId;
      if (newId) {
        navigate(`/chat/${newId}`, { replace: true });
      }
    }

    // 1. Add User Message
    addMessageToCurrent({
      role: 'user',
      content: userMessage
    });

    // 2. Add empty Model Message placeholder
    addMessageToCurrent({
      role: 'model',
      content: ''
    });

    try {
      // 3. Format history for Gemini API
      // Wait for state to be updated technically, but we know the history right now.
      const historyForApi = (currentSession?.messages || []).map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      })) as { role: 'user' | 'model'; parts: { text: string }[] }[];

      // 4. Stream response
      const stream = streamChatResponse(userMessage, historyForApi, { name: model, thinkingLevel });
      for await (const chunk of stream) {
        updateLastMessage(chunk);
      }
    } catch (error) {
      updateLastMessage('\n\n*Error: Failed to fetch response. Please try again.*');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderControlsInternal = () => {
    const modelLabels: Record<string, string> = {
      'qwen-turbo': 'Qwen-Turbo',
      'qwen-plus': 'Qwen-Plus',
      'qwen-max': 'Qwen-Max'
    };
    const displayModelText = modelLabels[model] || 'Qwen-Max';
    const displayThinkingText = thinkingLevel === ThinkingLevel.LOW ? '快速模式' : '深度思考';
    return (
      <div className="flex items-center gap-4 pl-1">
        <button type="button" className="text-[var(--muted)] hover:text-foreground">
           <PlusIcon size={20} /> 
        </button>
        <div className="relative custom-dropdown-container">
          <div 
            className="flex items-center text-[var(--muted)] hover:text-foreground cursor-pointer group"
            onClick={() => setActiveDropdown(activeDropdown === 'model' ? null : 'model')}
          >
            <span className="text-[14px] font-medium">{displayModelText}</span>
            <ChevronDown size={14} className="ml-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
          </div>
          {activeDropdown === 'model' && (
            <div className="absolute bottom-full mb-3 left-0 w-44 bg-surface rounded-[12px] border border-border shadow-2xl py-1 z-50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div 
                className={cn("px-3 py-2 text-sm cursor-pointer hover:bg-[var(--surface-container-highest)]", model === 'qwen-turbo' && "bg-[var(--surface-container-highest)] text-foreground font-medium")}
                onClick={() => { setModel('qwen-turbo'); setActiveDropdown(null); }}
              >
                Qwen-Turbo
              </div>
              <div 
                className={cn("px-3 py-2 text-sm cursor-pointer hover:bg-[var(--surface-container-highest)]", model === 'qwen-plus' && "bg-[var(--surface-container-highest)] text-foreground font-medium")}
                onClick={() => { setModel('qwen-plus'); setActiveDropdown(null); }}
              >
                Qwen-Plus
              </div>
              <div 
                className={cn("px-3 py-2 text-sm cursor-pointer hover:bg-[var(--surface-container-highest)]", model === 'qwen-max' && "bg-[var(--surface-container-highest)] text-foreground font-medium")}
                onClick={() => { setModel('qwen-max'); setActiveDropdown(null); }}
              >
                Qwen-Max
              </div>
            </div>
          )}
        </div>
        <div className="relative custom-dropdown-container">
          <div 
            className="flex items-center text-[var(--muted)] hover:text-foreground cursor-pointer group"
            onClick={() => setActiveDropdown(activeDropdown === 'thinking' ? null : 'thinking')}
          >
            <span className="text-[14px] font-medium">{displayThinkingText}</span>
            <ChevronDown size={14} className="ml-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
          </div>
          {activeDropdown === 'thinking' && (
            <div className="absolute bottom-full mb-3 left-0 w-32 bg-surface rounded-[12px] border border-border shadow-2xl py-1 z-50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div 
                className={cn("px-3 py-2 text-sm cursor-pointer hover:bg-[var(--surface-container-highest)]", thinkingLevel === ThinkingLevel.LOW && "bg-[var(--surface-container-highest)] text-foreground font-medium")}
                onClick={() => { setThinkingLevel(ThinkingLevel.LOW); setActiveDropdown(null); }}
              >
                快速模式
              </div>
              <div 
                className={cn("px-3 py-2 text-sm cursor-pointer hover:bg-[var(--surface-container-highest)]", thinkingLevel === ThinkingLevel.HIGH && "bg-[var(--surface-container-highest)] text-foreground font-medium")}
                onClick={() => { setThinkingLevel(ThinkingLevel.HIGH); setActiveDropdown(null); }}
              >
                深度思考
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderInputForm = () => (
    <div className="relative">
      <form onSubmit={handleSubmit} className="input-wrapper relative flex flex-col gap-2 bg-[var(--surface-container)] border border-[var(--border)] rounded-[20px] p-3 shadow-sm focus-within:border-primary transition-colors">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          onBlur={() => {
            // Force layout reset on blur as a fallback for iOS
            setTimeout(() => {
              setViewportOffset(0);
              setViewportHeight('100dvh');
              window.scrollTo(0, 0);
            }, 100);
          }}
          placeholder="输入以进行后续修改"
          className="chat-input w-full px-2 py-[8px] bg-transparent text-[16px] outline-none placeholder-[var(--muted)]"
          autoFocus
          enterKeyHint="send"
          inputMode="text"
          autoComplete="off"
        />
        
        <div className="flex items-center justify-between px-2">
            {renderControlsInternal()}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={!input.trim() || isGenerating}
                className="bg-foreground text-background w-[32px] h-[32px] rounded-full flex items-center justify-center disabled:opacity-50"
              >
                <ArrowUp size={16} strokeWidth={2.5} />
              </button>
            </div>
        </div>
      </form>
    </div>
  );

  if (!currentSession || currentSession.messages.length === 0) {
    return (
      <div 
        ref={containerRef}
        style={{ height: viewportHeight, transform: `translateY(${viewportOffset}px)` }}
        className="chat-viewport flex-1 flex flex-col bg-surface relative overflow-hidden pt-14 lg:pt-0"
      >
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-3xl">
            <h1 className="text-4xl font-semibold mb-8 text-center text-foreground empty-title">如何能帮到您？</h1>
            {renderInputForm()}
            <div className="text-center mt-3 text-[11px] text-[var(--muted)] tracking-wide">AI 可能会犯错。请核实重要信息。</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="chat-interface-container" 
      ref={containerRef}
      style={{ height: viewportHeight, transform: `translateY(${viewportOffset}px)` }}
      className="chat-viewport flex-1 flex flex-col bg-surface relative overflow-hidden pt-14 lg:pt-0"
    >
      {/* Chat Messages */}
      <div 
        id="messages-scroller" 
        className="chat-messages-container flex-1 overflow-y-auto w-full pb-[40px] pt-[20px] min-h-0 overscroll-contain touch-pan-y"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="w-full max-w-3xl mx-auto px-4 flex flex-col gap-[32px]">
          {currentSession.messages.map((message) => (
            <div 
              key={message.id} 
              id={`chat-message-${message.id}`}
              className="chat-message-row flex flex-col w-full"
            >
              {message.role === 'user' ? (
                // User Bubble
                <div className="user-bubble self-end bg-[var(--user-bubble)] text-[var(--user-bubble-foreground)] px-[20px] py-[14px] rounded-[24px_24px_6px_24px] max-w-[75%] text-[15px] leading-[1.4]">
                  {message.content}
                </div>
              ) : (
                // AI Output
                <div className="ai-message self-start bg-transparent text-foreground w-full text-[15px] leading-[1.6]">
                  {message.content === '' && isGenerating ? (
                    <span className="animate-pulse opacity-60">思考中...</span>
                  ) : (
                    <div className="prose dark:prose-invert max-w-none transition-all duration-300 ease-out">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      {/* Persistent Input Bar */}
      <div className="input-container-outer shrink-0 relative z-10 w-full px-4 pb-6 pt-2">
          <div className="w-full max-w-3xl mx-auto">
            {renderInputForm()}
          </div>
      </div>
    </div>
  );
}