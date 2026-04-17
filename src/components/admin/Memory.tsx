import { Brain, History, UserCheck, RefreshCw, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Memory() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">记忆模型控制</h1>
        <p className="text-[var(--muted)] text-sm">管理 AI 的长期记忆与对话上下文检索权重</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-xl border border-border p-4 md:p-6 shadow-sm">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
               <Layers size={18} className="text-primary" /> 记忆层级分布
            </h3>
            <div className="space-y-6">
              <MemoryBar label="短期上下文 (窗口内)" value={85} color="bg-primary" desc="当前活跃对话的实时推理缓冲区" />
              <MemoryBar label="向量长效记忆" value={42} color="bg-primary/60" desc="从历史对话中提取的语义关联知识" />
              <MemoryBar label="结构化用户特征" value={68} color="bg-primary/30" desc="用户偏好、身份与常用参数的结构化映射" />
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-border p-4 md:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="font-semibold flex items-center gap-2">
                <History size={18} className="text-primary" /> 最近记忆碎片
              </h3>
              <button className="text-xs text-primary hover:underline flex items-center gap-1">
                <RefreshCw size={12} /> 清理冗余
              </button>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-3 border border-border rounded-lg bg-surface-hover/20 text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-foreground opacity-80 uppercase text-[9px]">Cluster ID: MEM-2024-X{i}</span>
                    <span className="text-[var(--muted)]">24 分钟前</span>
                  </div>
                  <p className="text-[var(--muted)] leading-relaxed">
                    用户倾向于使用简洁的 React 代码风格，偏好使用 Tailwind CSS 而非 CSS Modules。在后续对话中应保持此代码偏好。
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface rounded-xl border border-border p-6 shadow-sm sticky top-6">
            <h4 className="font-bold text-sm mb-4">记忆参数设置</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[var(--muted)] uppercase">检索 Top-K</label>
                <input type="range" className="w-full" />
                <div className="flex justify-between text-[10px] text-[var(--muted)]">
                  <span>保守 (3)</span>
                  <span>激进 (10)</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[var(--muted)] uppercase">语义阈值</label>
                <input type="range" className="w-full" />
                <div className="flex justify-between text-[10px] text-[var(--muted)]">
                  <span>相关度 0.6</span>
                  <span>相关度 0.9</span>
                </div>
              </div>
              <button className="w-full bg-surface-hover border border-border py-2 rounded-lg text-sm font-medium mt-4 hover:border-primary transition-all">
                应用更改
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MemoryBar({ label, value, color, desc }: { label: string, value: number, color: string, desc: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-[var(--muted)]">{value}%</span>
      </div>
      <div className="h-2 w-full bg-surface-hover rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-1000", color)} 
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-[10px] text-[var(--muted)]">{desc}</p>
    </div>
  );
}
