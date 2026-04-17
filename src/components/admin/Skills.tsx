import { useState } from 'react';
import { Wand2, Plus, Code, Globe, Zap, Trash2, Settings2, ToggleRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Skill {
  id: string;
  name: string;
  description: string;
  trigger: string;
  isEnabled: boolean;
  type: 'code' | 'api' | 'prompt';
}

const mockSkills: Skill[] = [
  { id: '1', name: '数据可视化助手', description: '自动根据用户提供的数据生成 D3.js 图表。', trigger: '当用户发送数据表或 CSV', isEnabled: true, type: 'code' },
  { id: '2', name: '实时天气插件', description: '调用 OpenWeather API 获取全球城市天气。', trigger: '查询地点天气时触发', isEnabled: true, type: 'api' },
  { id: '3', name: '邮件润色专家', description: '将口语化的文字转化为正式的商务邮件。', trigger: '手动选择或命令 /email', isEnabled: false, type: 'prompt' },
  { id: '4', name: '代码漏洞扫描', description: '静态分析代码块并识别潜在安全风险。', trigger: '检测到代码块时提示', isEnabled: true, type: 'code' },
];

export function Skills() {
  const [skills, setSkills] = useState<Skill[]>(mockSkills);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-1">技能设计</h1>
          <p className="text-[var(--muted)] text-sm">定义 AI 的工具集、插件以及特定的业务逻辑指令</p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-all shadow-lg active:scale-95">
          <Plus size={18} /> 创建新技能
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-surface rounded-xl border border-border p-5 flex flex-col shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                  {skill.type === 'code' ? <Code size={20} /> : skill.type === 'api' ? <Globe size={20} /> : <Zap size={20} />}
                </div>
                <div>
                  <h3 className="font-semibold text-sm leading-tight">{skill.name}</h3>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold">{skill.type === 'code' ? '代码解释器' : skill.type === 'api' ? '外部插件' : '提示词工程'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-10 bg-surface-hover border border-border rounded-full p-0.5 flex items-center relative cursor-pointer overflow-hidden">
                  <div className={cn(
                    "h-full w-4 rounded-full transition-all duration-300",
                    skill.isEnabled ? "bg-primary translate-x-5" : "bg-border translate-x-0"
                  )}></div>
                </div>
              </div>
            </div>
            
            <p className="text-[13px] text-[var(--muted)] mb-4 flex-1 line-clamp-2 leading-relaxed">
              {skill.description}
            </p>

            <div className="text-[11px] bg-surface-hover border border-border px-2 py-1.5 rounded-md text-[var(--muted)] flex items-center gap-2 mb-4">
              <span className="font-bold text-foreground/70 uppercase text-[9px]">激活条件:</span>
              <span className="truncate">{skill.trigger}</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
              <button className="text-xs font-medium text-[var(--muted)] hover:text-foreground flex items-center gap-1.5 transition-colors">
                <Settings2 size={14} /> 配置参数
              </button>
              <button className="text-xs font-medium text-[var(--muted)] hover:text-red-500 flex items-center gap-1.5 transition-colors">
                <Trash2 size={14} /> 移除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
