/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CheckCircle2, Circle, AlertTriangle, TrendingUp } from 'lucide-react';
import { SyllabusMapping, TopicTrend } from '../types';

interface PriorityListProps {
  topics: TopicTrend[];
  mapping: SyllabusMapping[];
}

export default function PriorityList({ topics, mapping }: PriorityListProps) {
  const highYieldTopics = [...topics]
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 10);

  return (
    <div className="space-y-12">
      {highYieldTopics.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-primary" />
            <h2 className="text-lg font-bold text-slate-800">High-Yield Priority Ranking</h2>
          </div>
          <div className="dashboard-card shadow-sm overflow-hidden">
            {/* Desktop Header */}
            <div className="hidden md:grid grid-cols-[3.5rem_1fr_5rem_5rem_5rem] data-grid-header border-b">
              <span className="text-center">RANK</span>
              <span>ENTITY NAME</span>
              <span className="text-center">COUNT</span>
              <span className="text-center">WEIGHT</span>
              <span className="text-center">SCALE</span>
            </div>
            
            <div className="divide-y divide-slate-100">
              {highYieldTopics.map((topic, i) => (
                <div key={i} className="group">
                  {/* Desktop Row */}
                  <div className="hidden md:grid grid-cols-[3.5rem_1fr_5rem_5rem_5rem] data-row">
                    <span className="text-[10px] font-bold text-text-muted text-center flex items-center justify-center">
                       <span className="w-6 h-6 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">{i + 1}</span>
                    </span>
                    <span className="font-bold text-slate-700 truncate self-center">{topic.topic}</span>
                    <span className="text-xs font-semibold text-text-muted text-center self-center">{topic.frequency} Sessions</span>
                    <span className="text-xs font-bold text-primary text-center self-center">{topic.importance}/10</span>
                    <span className="text-xs font-semibold text-text-muted text-center self-center">{topic.difficulty}/10</span>
                  </div>

                  {/* Mobile Card */}
                  <div className="md:hidden p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                        <span className="font-bold text-slate-800 text-sm">{topic.topic}</span>
                      </div>
                      <span className="text-[10px] font-bold text-text-muted bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        {topic.frequency} Sessions
                      </span>
                    </div>
                    <div className="flex items-center gap-4 border-t border-slate-50 pt-2">
                       <div className="flex-1">
                          <div className="text-[8px] font-bold text-text-muted uppercase tracking-wider mb-0.5">Weight</div>
                          <div className="text-xs font-bold text-primary">{topic.importance}/10</div>
                       </div>
                       <div className="flex-1 border-l border-slate-100 pl-4">
                          <div className="text-[8px] font-bold text-text-muted uppercase tracking-wider mb-0.5">Scale</div>
                          <div className="text-xs font-bold text-slate-700">{topic.difficulty}/10</div>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {mapping.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-amber-500" />
            <h2 className="text-lg font-bold text-slate-800">Syllabus Reconciliation Gaps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mapping.map((item, i) => (
              <div 
                key={i} 
                className={`p-5 rounded-2xl border flex items-start justify-between gap-4 transition-all shadow-sm
                  ${item.isCoveredInPastPapers 
                    ? 'bg-white border-slate-100' 
                    : 'bg-amber-50/50 border-amber-200'}
                `}
              >
                <div className="space-y-1">
                  <p className={`text-sm font-bold tracking-tight ${!item.isCoveredInPastPapers ? 'text-amber-900' : 'text-slate-800'}`}>
                    {item.syllabusTopic}
                  </p>
                  <div className="flex items-center gap-2">
                     <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${!item.isCoveredInPastPapers ? 'bg-amber-200 text-amber-800' : 'bg-indigo-50 text-primary'}`}>
                        Priority {item.priorityScore}
                     </span>
                  </div>
                </div>
                {item.isCoveredInPastPapers ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100"><CheckCircle2 size={16} /></div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200 animate-pulse"><Circle size={16} /></div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
