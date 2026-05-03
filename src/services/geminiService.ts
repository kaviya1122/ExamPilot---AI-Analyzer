import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    topics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          frequency: { type: Type.NUMBER },
          importance: { type: Type.NUMBER },
          difficulty: { type: Type.NUMBER },
          years: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["topic", "frequency", "importance", "difficulty", "years"],
      },
    },
    syllabusMapping: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          syllabusTopic: { type: Type.STRING },
          isCoveredInPastPapers: { type: Type.BOOLEAN },
          paperFrequency: { type: Type.NUMBER },
          priorityScore: { type: Type.NUMBER },
        },
        required: ["syllabusTopic", "isCoveredInPastPapers", "paperFrequency", "priorityScore"],
      },
    },
    predictedImportantTopics: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    suggestedQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          question: { type: Type.STRING },
        },
        required: ["topic", "question"],
      },
    },
    studyPlanner: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING },
          topic: { type: Type.STRING },
          duration: { type: Type.STRING },
          priority: { type: Type.STRING },
          tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["day", "topic", "duration", "priority", "tasks"],
      },
    },
    mockTest: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswer: { type: Type.NUMBER },
          explanation: { type: Type.STRING },
        },
        required: ["question", "options", "correctAnswer", "explanation"],
      },
    },
  },
  required: ["topics", "syllabusMapping", "predictedImportantTopics", "suggestedQuestions", "studyPlanner", "mockTest"],
};

export async function analyzePapers(
  files: { data: string; mimeType: string }[],
  syllabusText: string
): Promise<AnalysisResult> {
  const fileParts = files.map(f => ({
    inlineData: {
      data: f.data.split(",")[1],
      mimeType: f.mimeType,
    },
  }));

  const prompt = `
    Analyze the provided past exam papers and the following syllabus:
    
    Syllabus:
    ${syllabusText}
    
    Tasks:
    1. Identify all topics mentioned in the past papers.
    2. Count their frequency across different years.
    3. Rate their importance (1-10) and estimated difficulty (1-10).
    4. Map these topics against the provided syllabus to identify coverage gaps.
    5. Rank topics by predicted exam weight (priorityScore).
    6. Generate a 7-day smart study planner based on high-importance/low-coverage topics.
    7. Suggest 3 high-priority practice questions.
    8. Generate 5 multiple-choice questions for a mock test covering the most important topics from the papers.
    
    Return the data in the specified JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [...fileParts, { text: prompt }],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA as any,
    },
  });

  if (!response.text) {
    throw new Error("No analysis result received from AI.");
  }

  return JSON.parse(response.text) as AnalysisResult;
}
