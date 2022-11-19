import { makeAutoObservable } from 'mobx';
import { apiRoute } from '../constants/routes';
import { levels } from '../constants/levels';
import random from '../helpers/randomNumber';

export interface Question {
  answer: string;
  question: string;
  value: number;
  id: number;
}

interface Category {
  title: string;
}
class Game {
  constructor() {
    makeAutoObservable(this);
  }
  isGameStarted = false;
  questions: Question[] = [];
  category: Category | null = null;
  score = 0;
  currentQuestion: Question | null = null;
  questionCount = 0;
  lifeCount = 3;

  start() {
    this.isGameStarted = true;
  }
  finish() {
    this.isGameStarted = false;
  }

  //pick current question by level from questions array
  pickQuestion() {
    //randomly picking level of hardness
    let level: Array<number | null> = levels.easy;
    if (this.questionCount > 3) level = levels.normal;
    if (this.questionCount > 5) level = levels.hard;
    if (this.questionCount > 8) level = levels.Extreme;

    //for easy level program can pick questions with value 100 or 200
    const questionsByLevel = this.questions.filter((question) => level.includes(question.value));
    let question = questionsByLevel[random(0, questionsByLevel.length - 1)];
    this.questions = this.questions.filter((el) => el?.id !== question?.id);
    this.currentQuestion = question;
  }

  //get all question by category
  async getQuestionsByCategory(categoryId: number) {
    const res = await fetch(apiRoute + `category?id=${categoryId}`);
    const { clues, ...data } = await res.json();
    this.questions = clues;
    this.category = data;
    this.pickQuestion();
  }

  reset() {
    this.isGameStarted = true;
    this.questions = [];
    this.category = null;
    this.score = 0;
    this.currentQuestion = null;
    this.questionCount = 0;
    this.lifeCount = 3;
  }
}
export default new Game();
