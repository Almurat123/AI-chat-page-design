import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Wand2, 
  Brain, 
  Users, 
  BarChart3, 
  ArrowLeft,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: '概览', path: '/admin' },
    { icon: BookOpen, label: '知识库', path: '/admin/knowledge' },
    { icon: Wand2, label: '技能设计', path: '/admin/skills' },
    { icon: Brain, label: '记忆模型', path: '/admin/memory' },
    { icon: Users, label: '用户管理', path: '/admin/users' },
    { icon: Settings, label: '对话参数', path: '/admin/params' },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface border-b border-border flex items-center justify-between px-4 z-40 shadow-sm">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 p-2 hover:bg-surface-hover rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-primary" />
          <span className="text-sm font-bold text-foreground">退出管理</span>
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 text-sm font-bold tracking-tight opacity-40">控制台</span>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Admin Sidebar (Desktop) */}
      <div className="hidden lg:flex w-64 h-full bg-surface border-r border-border flex-col p-4 shadow-sm admin-sidebar shrink-0">
        <div className="mb-8 px-1">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-surface-hover border border-border text-[var(--muted)] hover:text-primary hover:border-primary transition-all group shadow-sm active:scale-95"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </div>
            <div className="flex flex-col items-start overflow-hidden">
              <span className="text-[13px] font-bold text-foreground leading-tight">返回聊天</span>
              <span className="text-[10px] text-[var(--muted)] truncate">AI Nexus Platform</span>
            </div>
          </button>
        </div>
        
        <div className="text-[11px] uppercase text-[var(--muted)] tracking-[1px] mb-4 px-3 font-semibold">管理控制台</div>
        
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md font-medium" 
                    : "text-[var(--muted)] hover:bg-surface-hover hover:text-foreground"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="pt-4 border-t border-border mt-auto">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
              AD
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-medium truncate">管理员</div>
              <div className="text-[10px] text-[var(--muted)] truncate">admin@nexus.ai</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-surface z-50 lg:hidden flex flex-col p-6 shadow-2xl admin-sidebar"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="text-[11px] uppercase text-[var(--muted)] tracking-[2px] font-bold">Menu</div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-[var(--muted)]">
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3 rounded-xl text-md transition-all",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-lg font-semibold scale-[1.02]" 
                          : "text-[var(--muted)] hover:bg-surface-hover hover:text-foreground"
                      )}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-6 border-t border-border">
                <button 
                  onClick={() => navigate('/')}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-surface-hover border border-border rounded-xl text-sm font-medium text-[var(--muted)]"
                >
                  <ArrowLeft size={16} /> 退出管理控制台
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pt-20 lg:pt-8 p-4 md:p-8 relative">
        <div className="max-w-6xl mx-auto pb-12">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
