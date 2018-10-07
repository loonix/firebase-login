import { Injectable } from '@angular/core';
import { categoriesConfig } from '../categories.config';
import { Category } from '../models/categories.model';
import {
  AngularFirestoreDocument,
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  categories: AngularFirestoreCollection<Category>;
  private catDoc: AngularFirestoreDocument<Category>;

  constructor(private db: AngularFirestore) {
    this.categories = db.collection<Category>(categoriesConfig.collection_endpoint);
  }

  addCat(cat): void {
    this.categories.add(cat);
  }

  updateCat(id, update): void {
    this.catDoc = this.db.doc<Category>(`${categoriesConfig.collection_endpoint}/${id}`);
    this.catDoc.update(update);
  }

  deleteCat(id): void {
    this.catDoc = this.db.doc<Category>(`${categoriesConfig.collection_endpoint}/${id}`);
    this.catDoc.delete();
  }
}
