/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Calendar, Clock, CheckCircle, ChevronRight, GraduationCap } from 'lucide-react';
import { StudySession } from '../types';

interface StudyPlannerProps {
  sessions: StudySession[];
  onStartMockTest: () => void;
}

export default function StudyPlanner({ sessions, onStartMockTest }: StudyPlannerProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-100';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Calendar size={22} className="text-primary" />
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight italic">Optimized Learning Roadmap</h2>
        </div>
        <div className="text-[10px] font-bold bg-slate-900 text-white px-3 py-1 rounded-full tracking-widest uppercase">
          7-Day Accelerator
        </div>
      </div>

      <div className="space-y-6">
        {sessions.map((session, i) => (
          <div key={i} className={`relative overflow-hidden transition-all hover:shadow-md ${session.priority === 'High' ? 'planner-item-active' : 'planner-item-muted'}`}>
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              <div className="flex flex-col items-center justify-center p-3 bg-white/50 backdrop-blur-sm rounded-xl min-w-[90px] border border-white/50 shadow-sm">
                <span className="text-[10px] font-bold opacity-60 uppercase text-slate-500 tracking-tighter">{session.day}</span>
                <span className="text-2xl font-black text-slate-800">0{i + 1}</span>
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-800 leading-none">{session.topic}</h3>
                  <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full border shadow-sm ${session.priority === 'High' ? 'bg-white text-primary border-primary/20' : 'bg-white text-slate-500 border-slate-200'}`}>
                    {session.priority} Impact
                  </span>
                </div>
                
                <div className="flex items-center gap-6 text-[11px] font-medium text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-primary/60" />
                    <span>Est. Time: {session.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-primary/60" />
                    <span>{session.tasks.length} Learning Deliverables</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-4 pt-4 border-t border-slate-900/5">
                  {session.tasks.map((task, j) => (
                    <div key={j} className="flex items-start gap-2 text-[11px] font-medium text-slate-600">
                      <ChevronRight size={14} className="mt-0.5 shrink-0 text-primary" />
                      <span>{task}</span>
                    </div>
                  ))}
                </div>

                {i === sessions.length - 1 && (
                  <div className="mt-6">
                    <button 
                      onClick={onStartMockTest}
                      className="bg-primary text-white text-xs font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-primary-hover shadow-lg shadow-indigo-100 transition-all active:scale-95"
                    >
                      <GraduationCap size={16} />
                      Launch Final Mock Exam
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-8 pt-8 border-t border-dashed border-border">
           <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-bold hover:border-primary/30 hover:text-primary transition-all flex items-center justify-center gap-2">
              <Calendar size={14} />
              Export Strategic Calendar (ICS)
           </button>
        </div>
      </div>
    </div>
  );
}
