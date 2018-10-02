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
  styleUrls: ['./quiz-container.component.css']
})
export class QuizContainerComponent implements OnInit {

  items: Observable<any[]>;
  tasks: Observable<any[]>;

  myQuiz: string;
  editMode: boolean;
  taskToEdit: any = {};

  constructor(private db: AngularFirestore, private quizService: QuizService) {
    this.items = db.collection('quiz').valueChanges();
  }

  ngOnInit(): void {
    this.tasks = this.db.collection(quizConfig.collection_endpoint).valueChanges();

    this.tasks = this.db
      .collection(quizConfig.collection_endpoint)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            // Get document data
            const data = a.payload.doc.data() as Quiz;
            // Get document id
            const id = a.payload.doc.id;
            // Use spread operator to add the id to the document data
            return { id, ...data };
          });
        })
      );
  }

  onEdit(task) {
    console.log(task);
    // Set taskToEdit and editMode
    this.taskToEdit = task;
    this.editMode = true;
    // Set form value
    this.myQuiz = task.description;
  } // edit

  onSave() {
    if (this.myQuiz !== null) {
      // Get the input value
      const task = {
        description: this.myQuiz
      };
      if (!this.editMode) {
        console.log(task);
        this.quizService.addTask(task);
      } else {
        // Get the task id
        const taskId = this.taskToEdit.id;
        // update the task
        this.quizService.updateTask(taskId, task);
      }
      // set edit mode to false and clear form
      this.editMode = false;
      this.myQuiz = '';
    }
  } // saveTask

  onDelete(quiz) {
    // Get the task id
    const quizId = quiz.id;
    // delete the task
    this.quizService.deleteTask(quizId);
  } // deleteTask
}

