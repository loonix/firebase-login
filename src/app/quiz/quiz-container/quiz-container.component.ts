import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { QuizService } from '../services/quiz.service';
import { quizConfig } from '../quiz.config';
import { Quiz } from '../models/quiz.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-quiz-container',
  templateUrl: './quiz-container.component.html',
  styleUrls: ['./quiz-container.component.scss']
})
export class QuizContainerComponent implements OnInit {
  quiz: Observable<any[]>;
  question: string;
  status: string;
  author: string;
  image: string;
  category: string;
  editMode: boolean;
  quizToEdit: any = {};

  constructor(private db: AngularFirestore, private quizService: QuizService) {}

  ngOnInit(): void {
    this.quiz = this.db
      .collection(quizConfig.collection_endpoint)
      .valueChanges();

    this.quiz = this.db
      .collection(quizConfig.collection_endpoint)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Quiz;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  onEdit(quiz): void {
    console.log(quiz);
    this.quizToEdit = quiz;
    this.editMode = true;

    this.question = quiz.question;
    this.status = quiz.status;
    this.author = quiz.author;
    this.image = quiz.image;
    this.category = quiz.category;
  }

  onSave(): void {
    const quiz = {
      question: this.question,
      status: this.status,
      author: this.author,
      image: this.image,
      category: this.category
    };
    if (!this.editMode) {
      console.log(quiz);
      this.quizService.addQuiz(quiz);
    } else {
      const quizId = this.quizToEdit.id;
      this.quizService.updateQuiz(quizId, quiz);
    }
    this.editMode = false;

    this.question = '';
    this.status = '';
    this.author = '';
    this.image = '';
    this.category = '';
  }

  onDelete(quiz): void {
    const quizId = quiz.id;
    this.quizService.deleteQuiz(quizId);
  }
}
