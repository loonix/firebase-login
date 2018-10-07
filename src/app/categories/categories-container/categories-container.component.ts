import { Component, OnInit } from '@angular/core';
import { categoriesConfig } from '../categories.config';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../models/categories.model';
import { CategoriesService } from '../services/categories.service';
@Component({
  selector: 'app-categories-container',
  templateUrl: './categories-container.component.html',
  styleUrls: ['./categories-container.component.scss']
})
export class CategoriesContainerComponent implements OnInit {
categories: Observable<any[]>;

categoryName: string;
categoryImage: string;
editMode: boolean;
catToEdit: any = {};

  constructor(private db: AngularFirestore, private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.categories = this.db
    .collection(categoriesConfig.collection_endpoint)
    .valueChanges();

  this.categories = this.db
    .collection(categoriesConfig.collection_endpoint)
    .snapshotChanges()
    .pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Category;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  onEdit(cat): void {
    console.log(cat);
    this.catToEdit = cat;
    this.editMode = true;
    this.categoryName = cat.categoryName;
    this.categoryImage = cat.categoryImage;
  }

  onSave(): void {
    const quiz = {
      categoryName: this.categoryName,
      categoryImage: this.categoryImage,
    };
    if (!this.editMode) {
      console.log(quiz);
      this.categoriesService.addCat(quiz);
    } else {
      const quizId = this.catToEdit.id;
      this.categoriesService.updateCat(quizId, quiz);
    }
    this.editMode = false;

    this.clearValues();
  }

  clearValues(): void {
    this.categoryName = '';
    this.categoryImage = '';
  }
  onDelete(cat): void {
    const catId = cat.id;
    this.categoriesService.deleteCat(catId);
  }

}
