import { useState } from 'react';
import { User, Shield, Key, Mail, MoreHorizontal, UserX, UserCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

export function UserManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">用户中心</h1>
        <p className="text-[var(--muted)] text-sm">管理平台访问权限、配额分配与用户行为审计</p>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="border-b border-border bg-surface-hover/10 text-[11px] uppercase tracking-wider text-[var(--muted)] font-bold">
              <th className="px-6 py-4">用户</th>
              <th className="px-6 py-4">角色</th>
              <th className="px-6 py-4">对话余量</th>
              <th className="px-6 py-4">最后上线</th>
              <th className="px-6 py-4">状态</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              { name: 'John Doe', email: 'john@example.com', role: '管理员', quota: '无限', last: '2分钟前', status: 'active' },
              { name: 'Sarah Wilson', email: 'sarah.w@corp.com', role: '开发者', quota: '4.5k / 5k', last: '1小时前', status: 'active' },
              { name: 'Michael Chen', email: 'mike@studio.io', role: '标准用户', quota: '12 / 100', last: '3天前', status: 'inactive' },
              { name: 'AI Explorer', email: 'guest_9281@nexus.ai', role: '访客', quota: '0 / 5', last: '刚刚', status: 'active' },
            ].map((u, i) => (
              <tr key={i} className="hover:bg-surface-hover/50 transition-colors group text-sm">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-hover border border-border flex items-center justify-center text-[var(--muted)]">
                      <User size={16} />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{u.name}</div>
                      <div className="text-[11px] text-[var(--muted)]">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <Shield size={14} className="text-primary" />
                    <span>{u.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs">{u.quota}</td>
                <td className="px-6 py-4 text-[var(--muted)]">{u.last}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <div className={cn("w-1.5 h-1.5 rounded-full", u.status === 'active' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-gray-400")}></div>
                    <span className="capitalize">{u.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1 hover:bg-surface-hover rounded-md">
                    <MoreHorizontal size={18} className="text-[var(--muted)]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
