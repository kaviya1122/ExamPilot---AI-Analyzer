import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardCheck, 
  BarChart3, 
  CalendarRange, 
  FileSearch, 
  Sparkles,
  Loader2,
  ArrowRight,
  BookOpen,
  Info,
  LayoutDashboard,
  Target,
  FlaskConical,
  Upload,
  Menu,
  X
} from 'lucide-react';

import FileUploader from './components/FileUploader';
import VisualAnalytics from './components/VisualAnalytics';
import PriorityList from './components/PriorityList';
import StudyPlanner from './components/StudyPlanner';
import MockTest from './components/MockTest';
import { analyzePapers } from './services/geminiService';
import { AnalysisResult } from './types';

export default function App() {
  const [files, setFiles] = useState<{ data: string; mimeType: string; name: string }[]>([]);
  const [syllabus, setSyllabus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'topics' | 'mapping' | 'planner' | 'practice'>('summary');
  const [isMockTestActive, setIsMockTestActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setIsMockTestActive(false);
    closeSidebar();
  };

  const handleAnalyze = async () => {
    if (files.length === 0) {
      setError("Please upload at least one past paper.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const analysis = await analyzePapers(files, syllabus || "Standard context");
      setResult(analysis);
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Verify your API key and file quality.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background text-text-main font-sans flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-14 md:h-16 bg-white border-b border-border flex items-center justify-between px-4 md:px-8 shrink-0 shadow-sm z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleSidebar}
            className="p-2 -ml-2 md:hidden text-text-muted hover:bg-slate-50 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold shrink-0">EP</div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-text-main truncate">
            ExamPilot <span className="hidden sm:inline text-text-muted font-normal ml-2">| AI Analyzer</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          {result && (
            <button 
              onClick={() => {
                setResult(null);
                setIsMockTestActive(false);
              }}
              className="px-3 py-1.5 md:px-4 md:py-2 bg-primary text-white rounded-lg text-xs md:text-sm font-semibold hover:bg-primary-hover transition-colors flex items-center gap-2"
            >
              <Upload size={14} className="md:w-4 md:h-4" />
              <span className="hidden sm:inline">New Analysis</span>
            </button>
          )}
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-text-muted shrink-0">
            <Info size={18} />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-20 md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 w-64 bg-white border-r border-border p-6 flex flex-col gap-6 shrink-0 z-20 transition-transform duration-300 ease-in-out md:static md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <nav className="flex flex-col gap-1">
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 px-3">Analysis</div>
            <button 
              onClick={() => handleTabChange('summary')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'summary' ? 'bg-indigo-50 text-primary' : 'text-text-muted hover:bg-slate-50'}`}
            >
              <LayoutDashboard size={16} />
              Summary
            </button>
            <button 
              onClick={() => handleTabChange('topics')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'topics' ? 'bg-indigo-50 text-primary' : 'text-text-muted hover:bg-slate-50'}`}
            >
              <BarChart3 size={16} />
              Frequency
            </button>
            <button 
              onClick={() => handleTabChange('mapping')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'mapping' ? 'bg-indigo-50 text-primary' : 'text-text-muted hover:bg-slate-50'}`}
            >
              <Target size={16} />
              Mapping
            </button>
          </nav>

          <nav className="flex flex-col gap-1">
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 px-3">Planner</div>
            <button 
              onClick={() => handleTabChange('planner')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'planner' ? 'bg-indigo-50 text-primary' : 'text-text-muted hover:bg-slate-50'}`}
            >
              <CalendarRange size={16} />
              Schedule
            </button>
            <button 
              onClick={() => handleTabChange('practice')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'practice' ? 'bg-indigo-50 text-primary' : 'text-text-muted hover:bg-slate-50'}`}
            >
              <FlaskConical size={16} />
              Practice Hub
            </button>
          </nav>

          <div className="mt-auto p-4 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-text-muted leading-relaxed">
            <strong>Dataset:</strong> {files.length} Papers<br />
            <span className="opacity-60">{result ? 'Analysis: Complete' : 'System: Waiting'}</span>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {!result ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6 md:space-y-8 py-4 md:py-8">
              <div className="text-center space-y-2 mb-8 md:mb-12">
                <div className="inline-flex items-center gap-2 text-primary font-bold text-[10px] md:text-xs uppercase tracking-widest px-3 py-1 bg-indigo-50 rounded-full mb-2">
                  <Sparkles size={14} />
                  AI Intelligence
                </div>
                <h2 className="text-2xl md:text-4xl font-extrabold text-slate-800 tracking-tight">Strategy Starts Here</h2>
                <p className="text-sm md:text-base text-text-muted max-w-xl mx-auto px-4">Upload past papers and syllabus text to identify trends and gaps.</p>
              </div>

              <div className="dashboard-card p-6 md:p-10 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center gap-2 mb-2 font-bold">
                      <FileSearch size={18} className="text-primary" />
                      <h3 className="text-sm md:text-base">Step 1: Papers</h3>
                    </div>
                    <FileUploader onFilesChange={setFiles} />
                  </div>
                  
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center gap-2 mb-2 font-bold">
                      <BookOpen size={18} className="text-primary" />
                      <h3 className="text-sm md:text-base">Step 2: Context</h3>
                    </div>
                    <textarea
                      value={syllabus}
                      onChange={(e) => setSyllabus(e.target.value)}
                      placeholder="Paste syllabus here..."
                      className="w-full h-32 md:h-40 p-4 border border-border rounded-xl focus:ring-1 focus:ring-primary outline-none transition-all resize-none text-sm bg-slate-50/50"
                    />
                    <button
                      onClick={handleAnalyze}
                      disabled={isLoading}
                      className="w-full btn-primary h-12 flex items-center justify-center gap-3"
                    >
                      {isLoading ? <Loader2 className="animate-spin" size={18} /> : <div className="flex items-center gap-2 font-bold">Analyze <ArrowRight size={18} /></div>}
                    </button>
                    {error && <div className="p-3 bg-red-50 text-red-600 text-[10px] md:text-xs rounded-xl flex items-center gap-2"><Info size={14} /> {error}</div>}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20 md:pb-0">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 shrink-0">
                <div className="bg-white p-4 md:p-5 rounded-xl border border-border shadow-sm">
                  <div className="text-[9px] md:text-[10px] text-text-muted mb-1 md:mb-2 font-bold uppercase tracking-wider">High Yield</div>
                  <div className="text-xl md:text-2xl font-black text-slate-800">{result.predictedImportantTopics.length}</div>
                  <div className="text-[9px] md:text-[10px] text-emerald-600 mt-1 font-bold">↑ Critical Priority</div>
                </div>
                <div className="bg-white p-4 md:p-5 rounded-xl border border-border shadow-sm">
                  <div className="text-[9px] md:text-[10px] text-text-muted mb-1 md:mb-2 font-bold uppercase tracking-wider">Pattern Reliability</div>
                  <div className="text-xl md:text-2xl font-black text-slate-800">94%</div>
                  <div className="text-[9px] md:text-[10px] text-primary mt-1 font-bold">Based on {files.length} papers</div>
                </div>
                <div className="bg-slate-900 p-4 md:p-5 rounded-xl text-white sm:col-span-2 md:col-span-1">
                   <div className="text-[9px] md:text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1 md:mb-2">Syllabus Coverage</div>
                   <div className="text-xl md:text-2xl font-black">{Math.round((result.syllabusMapping.filter(m => m.isCoveredInPastPapers).length / result.syllabusMapping.length) * 100)}%</div>
                   <div className="text-[9px] md:text-[10px] text-amber-300 mt-1 font-bold">Coverage Gaps Found</div>
                </div>
              </div>

              {/* Dynamic Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'summary' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                     <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 lg:col-span-8">
                           <VisualAnalytics topics={result.topics} />
                        </div>
                        <div className="col-span-12 lg:col-span-4">
                           <div className="dashboard-card h-full p-6">
                              <h3 className="text-xs font-bold uppercase tracking-wider mb-4 border-b pb-2">Hot Topics</h3>
                              <div className="space-y-3">
                                 {result.predictedImportantTopics.slice(0, 6).map((topic, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                                       <span className="w-5 h-5 bg-primary/10 text-primary text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">{i+1}</span>
                                       <span className="text-xs font-semibold">{topic}</span>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}
                {activeTab === 'topics' && <PriorityList topics={result.topics} mapping={[]} />}
                {activeTab === 'mapping' && <PriorityList topics={[]} mapping={result.syllabusMapping} />}
                {activeTab === 'planner' && (
                  isMockTestActive ? (
                    <MockTest 
                      questions={result.mockTest} 
                      onComplete={(score) => console.log('Mock test completed with score:', score)} 
                    />
                  ) : (
                    <StudyPlanner 
                      sessions={result.studyPlanner} 
                      onStartMockTest={() => setIsMockTestActive(true)}
                    />
                  )
                )}
                {activeTab === 'practice' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {result.suggestedQuestions.map((item, i) => (
                        <div key={i} className="dashboard-card p-6 bg-white hover:border-primary/30 transition-colors group">
                           <div className="text-[10px] font-bold text-primary mb-3 uppercase tracking-wider bg-indigo-50 inline-block px-2 py-0.5 rounded">Topic: {item.topic}</div>
                           <p className="text-sm font-medium leading-relaxed text-slate-800 border-l-4 border-primary/20 pl-4 py-1 group-hover:border-primary transition-all underline decoration-slate-100 decoration-2 underline-offset-4">"{item.question}"</p>
                        </div>
                     ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
