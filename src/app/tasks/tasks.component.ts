import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { TaskService } from '../services/task.service';
import { config } from '../app.config';
import { Task } from '../app.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  items: Observable<any[]>;
  tasks: Observable<any[]>;

  myTask: string;
  editMode: boolean;
  taskToEdit: any = {};

  constructor(private db: AngularFirestore, private taskService: TaskService) {
    this.items = db.collection('items').valueChanges();
  }

  ngOnInit(): void {
    this.tasks = this.db.collection(config.collection_endpoint).valueChanges();

    this.tasks = this.db
      .collection(config.collection_endpoint)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            // Get document data
            const data = a.payload.doc.data() as Task;
            // Get document id
            const id = a.payload.doc.id;
            // Use spread operator to add the id to the document data
            return { id, ...data };
          });
        })
      );
  }

  edit(task) {
    console.log(task);
    // Set taskToEdit and editMode
    this.taskToEdit = task;
    this.editMode = true;
    // Set form value
    this.myTask = task.description;
  } // edit

  saveTask() {
    if (this.myTask !== null) {
      // Get the input value
      const task = {
        description: this.myTask
      };
      if (!this.editMode) {
        console.log(task);
        this.taskService.addTask(task);
      } else {
        // Get the task id
        const taskId = this.taskToEdit.id;
        // update the task
        this.taskService.updateTask(taskId, task);
      }
      // set edit mode to false and clear form
      this.editMode = false;
      this.myTask = '';
    }
  } // saveTask

  deleteTask(task) {
    // Get the task id
    const taskId = task.id;
    // delete the task
    this.taskService.deleteTask(taskId);
  } // deleteTask
}

