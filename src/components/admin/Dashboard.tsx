import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { Users, MessageSquare, Activity, Zap } from 'lucide-react';

const data = [
  { name: '4/10', traffic: 400, sessions: 240 },
  { name: '4/11', traffic: 300, sessions: 139 },
  { name: '4/12', traffic: 200, sessions: 980 },
  { name: '4/13', traffic: 278, sessions: 390 },
  { name: '4/14', traffic: 189, sessions: 480 },
  { name: '4/15', traffic: 239, sessions: 380 },
  { name: '4/16', traffic: 349, sessions: 430 },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold mb-1">系统概览</h1>
        <p className="text-[var(--muted)] text-xs md:text-sm">监控实时流量与对话核心指标</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="活跃用户" 
          value="1,284" 
          change="+12.5%" 
          icon={<Users className="text-primary" size={20} />} 
        />
        <StatCard 
          title="总对话数" 
          value="45,920" 
          change="+8.2%" 
          icon={<MessageSquare className="text-primary" size={20} />} 
        />
        <StatCard 
          title="平均响应" 
          value="1.2s" 
          change="-0.4s" 
          icon={<Zap className="text-primary" size={20} />} 
        />
        <StatCard 
          title="API 调用" 
          value="12.5k" 
          change="+15.3%" 
          icon={<Activity className="text-primary" size={20} />} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-sm font-semibold mb-6">访问流量分析</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                  itemStyle={{ color: 'var(--primary)' }}
                />
                <Area type="monotone" dataKey="traffic" stroke="var(--primary)" fillOpacity={1} fill="url(#colorTraffic)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-sm font-semibold mb-6">对话留存走势</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                  itemStyle={{ color: 'var(--primary)' }}
                />
                <Line type="monotone" dataKey="sessions" stroke="var(--primary)" strokeWidth={2} dot={{ r: 4, fill: 'var(--primary)' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon }: { title: string, value: string, change: string, icon: React.ReactNode }) {
  const isPositive = change.startsWith('+');
  return (
    <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-medium text-[var(--muted)]">{title}</span>
        {icon}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}</span>
        <span className={cn("text-[10px] font-bold", isPositive ? "text-green-500" : "text-red-500")}>
          {change}
        </span>
      </div>
    </div>
  );
}

import { cn } from '../../lib/utils';
