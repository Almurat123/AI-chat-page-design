// CONTEXT MEMORY
// Updated: 2026-04-17
// Author: Antigravity
// Reason: 将登录页面改为登录弹窗，符合国内 AI 产品（如 Kimi, DeepSeek）的主流交互趋势。
// Goal: 实现“液态玻璃”美学的悬浮弹窗，支持手机号一键登录。
// Owns: 登录弹窗的视觉呈现与验证逻辑。
// Document Provenance:
// - Source: User Request & Web Search
// - Kind: UX Optimization
// - Retrieved: 2026-04-17
// - Applied To: LoginModal component
// - Verification: Visual implementation
// See also:
// - system-journal/INDEX.md

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Github, Chrome, X, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/chatStore';
import { cn } from '../lib/utils';

export function LoginModal() {
  const { isLoginModalOpen, setLoginModalOpen } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [countdown, setCountdown] = useState(0);

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLoginModalOpen(false);
    }, 1500);
  };

  if (!isLoginModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setLoginModalOpen(false)}
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-[440px] bg-surface/80 border border-white/20 rounded-[24px] shadow-2xl overflow-hidden backdrop-blur-2xl flex flex-col"
        >
          {/* Decorative Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-blue-500/50 to-primary/50" />
          
          <button 
            onClick={() => setLoginModalOpen(false)}
            className="absolute top-5 right-5 p-2 text-foreground/40 hover:text-foreground hover:bg-white/10 rounded-full transition-all z-10"
          >
            <X size={20} />
          </button>

          <div className="p-8 pt-10">
            {/* Header / Value Proposition */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-primary rounded-[14px] mx-auto mb-4 flex items-center justify-center shadow-lg shadow-primary/20">
                <div className="w-6 h-6 bg-white/20 rounded-md backdrop-blur-sm" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">登录解锁更多能力</h2>
              <div className="flex items-center justify-center gap-4 text-[13px] text-[var(--muted)]">
                <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-primary" /> 云端同步</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-primary" /> 长文本分析</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-primary" /> 深度模式</span>
              </div>
            </div>

            {/* Login Tabs */}
            <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-xl mb-6">
              <button 
                onClick={() => setLoginMethod('phone')}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                  loginMethod === 'phone' ? "bg-surface shadow-sm text-foreground" : "text-[var(--muted)] hover:text-foreground"
                )}
              >
                手机号登录
              </button>
              <button 
                onClick={() => setLoginMethod('email')}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                  loginMethod === 'email' ? "bg-surface shadow-sm text-foreground" : "text-[var(--muted)] hover:text-foreground"
                )}
              >
                账号密码
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {loginMethod === 'phone' ? (
                <>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-2 border-r border-border">
                      <Phone size={16} className="text-[var(--muted)]" />
                      <span className="text-sm font-medium">+86</span>
                    </div>
                    <input 
                      type="tel" 
                      placeholder="输入手机号码"
                      className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-primary/30 rounded-xl py-3 pl-20 pr-4 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="relative group">
                    <ShieldCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                    <input 
                      type="text" 
                      placeholder="输入 6 位验证码"
                      className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-primary/30 rounded-xl py-3 pl-11 pr-24 outline-none transition-all text-sm"
                    />
                    <button 
                      type="button"
                      onClick={startCountdown}
                      disabled={countdown > 0}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {countdown > 0 ? `${countdown}s 后重发` : "获取验证码"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
                    <input 
                      type="email" 
                      placeholder="邮箱/账号"
                      className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-primary/30 rounded-xl py-3 pl-11 pr-4 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
                    <input 
                      type="password" 
                      placeholder="登录密码"
                      className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-primary/30 rounded-xl py-3 pl-11 pr-4 outline-none transition-all text-sm"
                    />
                  </div>
                </>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:translate-y-[-1px] active:translate-y-[0] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 mt-6"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    进入 AI Nexus
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <span className="text-[11px] text-[var(--muted)] uppercase tracking-widest block mb-4">社交账号快捷登录</span>
              <div className="flex justify-center gap-6">
                {/* WeChat */}
                <button className="flex flex-col items-center gap-2 group">
                  <div className="p-3 bg-black/5 dark:bg-white/5 hover:bg-[#07C160]/10 rounded-full transition-all active:scale-90 border border-white/5 group-hover:border-[#07C160]/30">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.42 12.16C15.42 11.75 15.11 11.42 14.73 11.42C14.34 11.42 14.04 11.75 14.04 12.16C14.04 12.57 14.34 12.9 14.73 12.9C15.11 12.9 15.42 12.57 15.42 12.16ZM18.23 12.16C18.23 11.75 17.92 11.42 17.53 11.42C17.15 11.42 16.85 11.75 16.85 12.16C16.85 12.57 17.15 12.9 17.53 12.9C17.92 12.9 18.23 12.57 18.23 12.16ZM16.14 7.64C12.8 7.64 10.09 9.87 10.09 12.63C10.09 14.2 10.87 15.6 12.1 16.53L11.71 18.17L13.38 17.3C14.24 17.51 15.17 17.62 16.14 17.62C19.48 17.62 22.19 15.39 22.19 12.63C22.19 9.87 19.48 7.64 16.14 7.64ZM7.78 2C4.1 2 1.11 4.46 1.11 7.49C1.11 9.21 1.96 10.74 3.32 11.76L2.89 13.56L4.73 12.6C5.67 12.83 6.7 12.96 7.78 12.96C8.28 12.96 8.76 12.93 9.23 12.86C9.14 12.44 9.09 12.01 9.09 11.56C9.09 8.23 11.79 5.53 15.12 5.53C15.54 5.53 15.94 5.58 16.33 5.66C15.4 3.55 12.46 2 7.78 2ZM5.11 5.92C5.55 5.92 5.9 6.27 5.9 6.7C5.9 7.14 5.55 7.49 5.11 7.49C4.67 7.49 4.32 7.14 4.32 6.7C4.32 6.27 4.67 5.92 5.11 5.92ZM10.44 5.92C10.88 5.92 11.23 6.27 11.23 6.7C11.23 7.14 10.88 7.49 10.44 7.49C10 7.49 9.65 7.14 9.65 6.7C9.65 6.27 10 5.92 10.44 5.92Z" fill="#07C160"/>
                    </svg>
                  </div>
                  <span className="text-[10px] text-[var(--muted)] group-hover:text-foreground transition-colors">微信</span>
                </button>

                {/* Feishu */}
                <button className="flex flex-col items-center gap-2 group">
                  <div className="p-3 bg-black/5 dark:bg-white/5 hover:bg-[#3370FF]/10 rounded-full transition-all active:scale-90 border border-white/5 group-hover:border-[#3370FF]/30">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.148 10.472l12.842-7.854a.5.5 0 01.76.425v10.1a.5.5 0 01-.252.435L4.656 21.432a.5.5 0 01-.748-.435v-10.09a.5.5 0 01.24-.435z" fill="#3370FF"/>
                      <path d="M16.99 3.043l-5.694 3.483a.5.5 0 00-.236.422v6.643a.5.5 0 00.771.417l5.412-3.483a.5.5 0 00.224-.417V3.465a.5.5 0 00-.477-.422z" fill="#3370FF" fillOpacity="0.8"/>
                    </svg>
                  </div>
                  <span className="text-[10px] text-[var(--muted)] group-hover:text-foreground transition-colors">飞书</span>
                </button>

                {/* Douyin */}
                <button className="flex flex-col items-center gap-2 group">
                  <div className="p-3 bg-black/5 dark:bg-white/5 hover:bg-black/20 dark:hover:bg-white/10 rounded-full transition-all active:scale-90 border border-white/5 group-hover:border-foreground/30">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.53 1a.53.53 0 00-.53.53v14.04c0 1.9-1.54 3.44-3.44 3.44a3.44 3.44 0 01-3.44-3.44 3.44 3.44 0 013.44-3.44c.4 0 .78.07 1.14.2V8.46c-.36-.06-.74-.1-1.14-.1a7.31 7.31 0 00-7.31 7.31A7.31 7.31 0 008.56 23c4.04 0 7.31-3.27 7.31-7.31V7.03c1.78 1.25 3.93 1.99 6.27 1.99v-3.87c-1.89 0-3.57-.75-4.8-1.97-.24-.24-.46-.5-.65-.77a.53.53 0 00-.46-.25h-3.7z" fill="currentColor"/>
                    </svg>
                  </div>
                  <span className="text-[10px] text-[var(--muted)] group-hover:text-foreground transition-colors">抖音</span>
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-[12px] text-[var(--muted)] leading-relaxed">
              登录即代表您同意 <span className="text-primary cursor-pointer hover:underline">用户协议</span> 和 <span className="text-primary cursor-pointer hover:underline">隐私政策</span>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
