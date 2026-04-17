import { Settings2, Save, RotateCcw, AlertTriangle } from 'lucide-react';

export function Params() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-1">对话参数调优</h1>
          <p className="text-[var(--muted)] text-sm">全局配置底层模型推理行为与对话策略控制</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-surface-hover transition-all">
            <RotateCcw size={18} /> 重置默认
          </button>
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 shadow-lg transition-all active:scale-95">
            <Save size={18} /> 保存配置
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface rounded-xl border border-border p-6 space-y-6 shadow-sm">
          <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-primary">
            推理引擎配置
          </h3>
          
          <div className="space-y-4">
            <ParamInput label="Temperature (温度值)" value="0.75" desc="控制输出的随机性。较低值更严谨，较高值更具创造力。" />
            <ParamInput label="Top-P (核采样)" value="0.95" desc="另一种控制多样性的方式，限制模型考虑的词汇量。" />
            <ParamInput label="Context Window (上下文长度)" value="32,768 Tokens" desc="模型能同时记忆的最大对话长度。" />
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-border p-6 space-y-6 shadow-sm">
          <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-primary">
            系统提示词注入 (System Prompt)
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium">全局身份定义</label>
              <textarea 
                className="w-full h-32 bg-surface-hover border border-border rounded-lg p-3 text-sm outline-none focus:border-primary transition-colors font-mono"
                defaultValue="你是一个专业的 AI 助手，始终保持专业、中立且高效的沟通风格。在处理代码请求时，优先考虑性能与安全性。"
              />
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/10 rounded-lg">
              <AlertTriangle className="text-primary shrink-0" size={18} />
              <p className="text-[11px] text-[var(--muted)]">
                修改系统提示词将立即影响所有新发起的对话。建议在更改前先在测试环境验证。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ParamInput({ label, value, desc }: { label: string, value: string, desc: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center group">
        <label className="text-xs font-semibold">{label}</label>
        <div className="relative group">
           <input 
            type="text" 
            defaultValue={value}
            className="w-24 text-right bg-surface-hover border border-border rounded px-2 py-1 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>
      <p className="text-[10px] text-[var(--muted)] leading-relaxed italic">{desc}</p>
    </div>
  );
}
