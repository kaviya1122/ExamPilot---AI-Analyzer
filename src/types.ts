/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TopicTrend {
  topic: string;
  frequency: number;
  importance: number; // 1-10
  difficulty: number; // 1-10
  years: string[];
}

export interface SyllabusMapping {
  syllabusTopic: string;
  isCoveredInPastPapers: boolean;
  paperFrequency: number;
  priorityScore: number;
}

export interface StudySession {
  day: string;
  topic: string;
  duration: string;
  priority: 'High' | 'Medium' | 'Low';
  tasks: string[];
}

export interface MockQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // index of options
  explanation: string;
}

export interface AnalysisResult {
  topics: TopicTrend[];
  syllabusMapping: SyllabusMapping[];
  predictedImportantTopics: string[];
  suggestedQuestions: {
    topic: string;
    question: string;
  }[];
  studyPlanner: StudySession[];
  mockTest: MockQuestion[];
}
