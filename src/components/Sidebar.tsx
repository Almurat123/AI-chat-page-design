// CONTEXT MEMORY
// Updated: 2026-04-17
// Author: Antigravity
// Reason: 优化移动端交互，删除按钮在触屏设备上难以通过 Hover 触发，需常驻显示。
// Goal: 确保移动端用户可以直观地看到并操作删除功能。
// Owns: 侧边栏会话项的交互状态。
// Document Provenance:
// - Source: User Request
// - Kind: Product Requirement
// - Retrieved: 2026-04-17
// - Applied To: Sidebar session item delete button visibility
// - Verification: Verified in code (Tailwind responsive classes)
// See also:
// - system-journal/INDEX.md

import { 
  MessageSquare, Plus, Trash2, User as UserIcon, 
  Menu, ChevronDown, LayoutDashboard, X, 
  ChevronLeft, Sun, Moon 
} from 'lucide-react';
import { useStore, THEMES } from '../store/chatStore';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const themeNames: Record<string, string> = {
  'default': '默认设计',
  'technical': '硬核技术',
  'editorial': '社论排版',
  'brutalist': '新野兽派',
  'glass': '毛玻璃感',
  'hardware': '金属质感',
  'organic': '自然有机',
  'minimal': '极致极简',
  'terminal': '命令行流',
  'luxury': '高端奢华'
};

export function Sidebar() {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    sessions, 
    currentSessionId, 
    setCurrentSession, 
    createNewSession, 
    deleteSession,
    user,
    theme,
    setTheme,
    isDarkMode,
    toggleDarkMode,
    isSidebarOpen,
    setSidebarOpen,
    setLoginModalOpen
  } = useStore();

  const isAdmin = true; // For demo purpose

  const handleCreateNew = () => {
    navigate('/');
    setSidebarOpen(false); // Close on mobile
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.theme-dropdown-container')) {
        setIsThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on mobile when navigating
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname, setSidebarOpen]);

  const SidebarContent = (
    <div 
      className="flex flex-col h-full bg-surface border-r border-border p-4 relative z-20 w-full"
    >
      {/* Header */}
      <div className="flex items-center gap-2 text-[18px] font-bold text-primary mb-6 sidebar-header">
        <div className="w-6 h-6 bg-primary rounded-[6px]"></div>
        AI Nexus
        <button 
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1 ml-auto text-foreground/70 hover:text-foreground shrink-0"
        >
          <X size={18} />
        </button>
      </div>

      <button 
        onClick={handleCreateNew}
        className="new-chat-btn bg-[#f2f2f7] dark:bg-surface-hover border border-border text-foreground p-[10px] rounded-[8px] hover:opacity-90 transition-opacity text-[14px] font-medium text-center w-full mb-5"
      >
        + 开启新对话
      </button>

      {/* History List */}
      <div className="text-[11px] uppercase text-[var(--muted)] tracking-[0.5px] mb-2 px-0 font-normal">聊天历史</div>
      <div className="flex-1 overflow-y-auto mb-4 space-y-[4px] min-h-0">
        {sessions.map((session) => (
          <Link 
            key={session.id}
            id={`chat-record-${session.id}`}
            to={`/chat/${session.id}`}
            className={cn(
              "group flex items-center justify-between p-[8px_12px] rounded-[6px] text-[13px] cursor-pointer transition-colors whitespace-nowrap overflow-hidden",
              currentSessionId === session.id 
                ? "bg-[#e5e5ea] dark:bg-surface-hover font-medium text-foreground" 
                : "text-[#48484a] dark:text-foreground/80 hover:bg-[#e5e5ea]/50 dark:hover:bg-surface-hover/50"
            )}
          >
            <div className="flex items-center gap-2 overflow-hidden w-full">
              <span className="truncate text-ellipsis">{session.title}</span>
            </div>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteSession(session.id);
              }}
              className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-1 text-foreground/50 hover:text-red-500 transition-opacity shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </Link>
        ))}
      </div>

      {/* Configuration & User */}
      <div className="pt-4 border-t border-border space-y-4 sidebar-footer">
        {/* Admin Entrance */}
        {isAdmin && (
          <Link 
            to="/admin" 
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all mb-2",
              location.pathname.startsWith('/admin') 
                ? "bg-primary text-primary-foreground shadow-md font-medium" 
                : "bg-surface border border-border text-[var(--muted)] hover:text-foreground hover:bg-surface-hover"
            )}
          >
            <LayoutDashboard size={16} />
            <span>管理后台</span>
          </Link>
        )}
        <div className="space-y-2 relative theme-dropdown-container">
          <div className="text-[11px] uppercase text-[var(--muted)] tracking-[0.5px] font-normal section-title">界面架构设计 (10)</div>
          <div 
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            className="w-full bg-surface border border-border text-foreground text-[13px] rounded-[6px] p-[8px_10px] flex items-center justify-between cursor-pointer hover:border-primary transition-colors active:scale-[0.98]"
          >
            <span>{themeNames[theme] || theme}</span>
            <ChevronDown size={14} className={cn("text-[var(--muted)] transition-transform", isThemeOpen && "rotate-180")} />
          </div>
          
          {isThemeOpen && (
            <div className="absolute bottom-full mb-2 left-0 w-full bg-surface border border-border rounded-[8px] shadow-xl z-50 py-1 max-h-[300px] overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
              {THEMES.map(t => (
                <div 
                  key={t}
                  onClick={() => {
                    setTheme(t);
                    setIsThemeOpen(false);
                  }}
                  className={cn(
                    "px-3 py-2 text-[13px] cursor-pointer transition-colors theme-option-item",
                    theme === t 
                      ? "is-active bg-primary/10 text-primary font-medium" 
                      : "is-idle text-foreground/80 hover:bg-surface-hover hover:text-foreground"
                  )}
                >
                  {themeNames[t] || t}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-between">
          <div 
            className="flex items-center gap-[10px] cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setLoginModalOpen(true)}
          >
             <div className="w-[32px] h-[32px] rounded-full bg-[#e5e5ea] dark:bg-surface-hover flex items-center justify-center text-foreground font-bold shrink-0 text-sm overflow-hidden border border-border">
              {user ? user.name.charAt(0) : <UserIcon size={16} />}
             </div>
             <div className="flex flex-col">
              <div className="text-[12px] font-semibold text-foreground leading-tight">{user?.name || '张小明'}</div>
              <div className="text-[10px] text-[var(--muted)] leading-tight">高级会员</div>
             </div>
          </div>
          <button 
            onClick={toggleDarkMode}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-hover border border-border text-foreground/70 hover:text-primary hover:border-primary transition-all active:scale-95"
            title={isDarkMode ? "切换至日间模式" : "切换至夜间模式"}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block h-full shrink-0 w-[260px] overflow-hidden app-sidebar shadow-sm border-r border-border">
        {SidebarContent}
      </div>

      {/* Mobile Toggle Button */}
      <div 
        style={{ 
          paddingTop: 'env(safe-area-inset-top)',
          height: 'calc(3.5rem + env(safe-area-inset-top))'
        }}
        className="lg:hidden fixed top-0 left-0 right-0 bg-surface border-b border-border flex items-center justify-between px-4 z-40 mobile-chat-header"
      >
        {/* Left: Back Button (Only show if in a sub-route) */}
        {location.pathname.startsWith('/chat/') ? (
          <button 
            onClick={() => {
              console.log('Back button clicked, navigating to /');
              navigate('/');
            }}
            className="p-2 -ml-2 hover:bg-surface-hover rounded-lg transition-colors text-[var(--muted)] relative z-50"
          >
            <ChevronLeft size={22} />
          </button>
        ) : (
          <div className="w-9" />
        )}

        {/* Center: Title */}
        <span className="absolute left-1/2 -translate-x-1/2 text-[15px] font-bold text-primary tracking-tight">AI Nexus</span>

        {/* Right: Menu Button (replaced Plus) */}
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 -mr-2 hover:bg-surface-hover rounded-lg transition-colors text-[var(--muted)]"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay & Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-[100] lg:hidden backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] z-[101] lg:hidden flex flex-col shadow-2xl app-sidebar"
            >
              {SidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
