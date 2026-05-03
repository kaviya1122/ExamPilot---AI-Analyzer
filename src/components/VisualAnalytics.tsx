/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { TopicTrend } from '../types';

interface VisualAnalyticsProps {
  topics: TopicTrend[];
}

export default function VisualAnalytics({ topics }: VisualAnalyticsProps) {
  const sortedTopics = [...topics].sort((a, b) => b.frequency - a.frequency).slice(0, 8);
  
  // Custom difficulty colors
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 8) return '#ef4444'; // Red
    if (difficulty >= 5) return '#f59e0b'; // Amber
    return '#10b981'; // Green
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="dashboard-card h-[300px] md:h-[400px] flex flex-col">
        <div className="data-grid-header border-b-0 text-xs md:text-sm">Topic Frequency Distribution</div>
        <div className="flex-1 p-2 md:p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedTopics} layout="vertical" margin={{ left: 40, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} strokeOpacity={0.1} />
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="topic" 
                width={80}
                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                itemStyle={{ color: '#fff' }}
                cursor={{ fill: '#e2e8f0', opacity: 0.4 }}
              />
              <Bar dataKey="frequency" radius={[0, 4, 4, 0]}>
                {sortedTopics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#818cf8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-card h-[300px] md:h-[400px] flex flex-col">
        <div className="data-grid-header border-b-0 text-xs md:text-sm">High-Yield Correlation</div>
        <div className="flex-1 p-2 md:p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedTopics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
              <XAxis dataKey="topic" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                 contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="importance" name="Significance" radius={[4, 4, 0, 0]} fill="#4f46e5" />
              <Bar dataKey="difficulty" name="Complexity" radius={[4, 4, 0, 0]}>
                {sortedTopics.map((entry, index) => (
                  <Cell key={`cell-diff-${index}`} fill={entry.difficulty >= 7 ? '#6366f1' : '#cbd5e1'} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="px-4 pb-4 flex gap-4 text-[10px] font-mono opacity-60">
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ef4444]" /> Hard</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> Medium</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#10b981]" /> Easy</div>
        </div>
      </div>
    </div>
  );
}
