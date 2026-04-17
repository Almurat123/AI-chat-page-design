import { useState } from 'react';
import { Search, Plus, FileText, Database, Trash2, Edit2, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';

interface KBItem {
  id: string;
  name: string;
  type: string;
  size: string;
  updatedAt: string;
  status: 'ready' | 'processing' | 'error';
}

const mockData: KBItem[] = [
  { id: '1', name: '产品手册_2024.pdf', type: '文档', size: '2.4 MB', updatedAt: '2024-04-10', status: 'ready' },
  { id: '2', name: '内部API设计规范.md', type: '文档', size: '156 KB', updatedAt: '2024-04-12', status: 'ready' },
  { id: '3', name: '行业竞品分析图表.xlsx', type: '表格', size: '5.1 MB', updatedAt: '2024-04-15', status: 'processing' },
  { id: '4', name: '客户常见问题库', type: '向量数据库', size: '12,504 向量', updatedAt: '2024-04-16', status: 'ready' },
];

export function KnowledgeBase() {
  const [items, setItems] = useState<KBItem[]>(mockData);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-1">知识库管理</h1>
          <p className="text-[var(--muted)] text-sm">管理并嵌入 AI 对话所需的企业垂直知识</p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg">
          <Plus size={18} /> 上传新知识
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-surface-hover/30 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
            <input 
              type="text" 
              placeholder="搜索知识文档..." 
              className="w-full bg-surface border border-border rounded-md pl-10 pr-4 py-2 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-border rounded-md hover:bg-surface-hover text-[var(--muted)]">
              <Database size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="border-b border-border bg-surface-hover/10 text-[11px] uppercase tracking-wider text-[var(--muted)] font-bold">
              <th className="px-6 py-3">名称</th>
              <th className="px-6 py-3">类型</th>
              <th className="px-6 py-3">数据大小</th>
              <th className="px-6 py-3">最后更新</th>
              <th className="px-6 py-3">状态</th>
              <th className="px-6 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-hover/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <FileText size={18} />
                    </div>
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--muted)]">{item.type}</td>
                <td className="px-6 py-4 text-sm text-[var(--muted)]">{item.size}</td>
                <td className="px-6 py-4 text-sm text-[var(--muted)]">{item.updatedAt}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded-full uppercase",
                    item.status === 'ready' ? "bg-green-500/10 text-green-500" : 
                    item.status === 'processing' ? "bg-blue-500/10 text-blue-500" : "bg-red-500/10 text-red-500"
                  )}>
                    {item.status === 'ready' ? '已就绪' : item.status === 'processing' ? '处理中' : '错误'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-surface-hover rounded-md text-[var(--muted)] hover:text-foreground">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-1.5 hover:bg-surface-hover rounded-md text-[var(--muted)] hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
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
