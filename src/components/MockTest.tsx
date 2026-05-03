/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight, RefreshCw, Trophy } from 'lucide-react';
import { MockQuestion } from '../types';

interface MockTestProps {
  questions: MockQuestion[];
  onComplete: (score: number) => void;
}

export default function MockTest({ questions, onComplete }: MockTestProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === currentQuestion.correctAnswer) {
      setScore(s => s + 1);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
      onComplete(score);
    }
  };

  const reset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="dashboard-card p-6 md:p-12 text-center space-y-4 md:space-y-6"
      >
        <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center mx-auto text-primary">
          <Trophy size={32} className="md:w-10 md:h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Mock Test Complete</h2>
          <p className="text-xs md:text-sm text-text-muted">Strategy analysis suggests {percentage}% concept mastery.</p>
        </div>
        
        <div className="text-5xl md:text-6xl font-black text-primary">
          {score} <span className="text-xl md:text-2xl text-slate-300 font-normal">/ {questions.length}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button onClick={reset} className="btn-secondary flex items-center justify-center gap-2">
            <RefreshCw size={18} />
            Retake Test
          </button>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Back to Strategy
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4 md:space-y-8 px-2 md:px-0">
      <div className="flex items-center justify-between">
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded w-fit">Mock Exam</span>
          <h2 className="text-lg md:text-xl font-bold text-slate-800">Day 7 Final Review</h2>
        </div>
        <div className="text-[10px] md:text-xs font-bold text-text-muted">
          {currentIndex + 1} / {questions.length}
        </div>
      </div>

      <div className="h-1.5 md:h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <motion.div 
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="dashboard-card p-5 md:p-8 space-y-6 md:space-y-8"
      >
        <h3 className="text-lg md:text-xl font-bold text-slate-800 leading-tight">
          {currentQuestion.question}
        </h3>

        <div className="grid grid-cols-1 gap-3 md:gap-4">
          {currentQuestion.options.map((option, i) => {
            let state = 'default';
            if (selectedOption !== null) {
              if (i === currentQuestion.correctAnswer) state = 'correct';
              else if (i === selectedOption) state = 'wrong';
              else state = 'inactive';
            }

            return (
              <button
                key={i}
                disabled={selectedOption !== null}
                onClick={() => handleOptionSelect(i)}
                className={`w-full p-3 md:p-4 rounded-xl border flex items-center justify-between text-left transition-all
                  ${state === 'default' ? 'bg-white border-slate-200 hover:border-primary/50 text-slate-700' : ''}
                  ${state === 'correct' ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : ''}
                  ${state === 'wrong' ? 'bg-red-50 border-red-500 text-red-900' : ''}
                  ${state === 'inactive' ? 'opacity-50 border-slate-100 grayscale-[0.5]' : ''}
                `}
              >
                <span className="text-sm md:text-base font-semibold">{option}</span>
                {state === 'correct' && <CheckCircle2 size={16} md:size={18} />}
                {state === 'wrong' && <XCircle size={16} md:size={18} />}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 md:p-6 bg-slate-50 rounded-xl border border-border space-y-2"
            >
              <div className="text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-widest">Logic Insight</div>
              <p className="text-xs md:text-sm font-medium text-slate-700">{currentQuestion.explanation}</p>
              <div className="pt-3 md:pt-4 flex justify-end">
                <button 
                  onClick={nextQuestion}
                  className="btn-primary h-9 md:h-10 px-4 text-[10px] md:text-xs flex items-center gap-2"
                >
                  {currentIndex === questions.length - 1 ? 'Finish Test' : 'Next Question'}
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
