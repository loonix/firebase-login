import { quizConfig } from '../quiz.config';
import { Quiz } from '../models/quiz.model';
import { Injectable } from '@angular/core';
import {
  AngularFirestoreDocument,
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
@Injectable({
  providedIn: 'root'
})
export class QuizService {
  quiz: AngularFirestoreCollection<Quiz>;
  private quizDoc: AngularFirestoreDocument<Quiz>;

  constructor(private db: AngularFirestore) {
    this.quiz = db.collection<Quiz>(quizConfig.collection_endpoint);
  }

  addQuiz(quiz): void {
    this.quiz.add(quiz);
  }

  updateQuiz(id, update): void {
    this.quizDoc = this.db.doc<Quiz>(`${quizConfig.collection_endpoint}/${id}`);
    this.quizDoc.update(update);
  }

  deleteQuiz(id): void {
    this.quizDoc = this.db.doc<Quiz>(`${quizConfig.collection_endpoint}/${id}`);
    this.quizDoc.delete();
  }
}
