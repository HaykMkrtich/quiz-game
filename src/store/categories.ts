import { makeAutoObservable } from 'mobx';
import { apiRoute } from '../constants/routes';
import random from '../helpers/randomNumber';

interface Category {
  id: number;
  title: string;
  clues_count: number;
}
class Categories {
  constructor() {
    makeAutoObservable(this);
  }
  categories: Category[] = [];

  //get 10 pieces of all categories with more than 10 questions
  async getCategories(count: number = 10) {
    //I could avoid from this code if the backend endpoint could accept filter parameters such as ?min_clues_count=10
    const res = await fetch(apiRoute + `categories?count=${27700}`);
    const data = await res.json();
    const categoriesWith10Questions = data.filter((el: Category) => el.clues_count >= 10);
    this.categories = categoriesWith10Questions.splice(
      random(0, categoriesWith10Questions.length - count),
      count,
    );
  }
}

export default new Categories();
