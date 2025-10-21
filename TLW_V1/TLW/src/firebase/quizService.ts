import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './config';

export interface QuizResult {
  userName: string;
  userAge: number;
  answers: number[][];
  totalPoints: number;
  completedAt: Timestamp;
  questionsAttempted: number;
}

export const saveQuizResult = async (quizData: Omit<QuizResult, 'completedAt'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, 'quiz_results'), {
      ...quizData,
      completedAt: Timestamp.now()
    });
    console.log('Quiz result saved with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving quiz result: ', error);
    return null;
  }
};