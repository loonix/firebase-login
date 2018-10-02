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
  tasks: AngularFirestoreCollection<Quiz>;
  private taskDoc: AngularFirestoreDocument<Quiz>;

  constructor(private db: AngularFirestore) {
    this.tasks = db.collection<Quiz>(quizConfig.collection_endpoint);
  }

  addTask(task) {
    this.tasks.add(task);
  }

  updateTask(id, update) {
    this.taskDoc = this.db.doc<Quiz>(`${quizConfig.collection_endpoint}/${id}`);
    this.taskDoc.update(update);
  }

  deleteTask(id) {
    this.taskDoc = this.db.doc<Quiz>(`${quizConfig.collection_endpoint}/${id}`);
    this.taskDoc.delete();
  }
}
