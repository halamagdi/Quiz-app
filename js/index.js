const quizCategory = document.querySelector("#quizCategory"),
  quizDifficulty = document.querySelector("#quizDifficulty"),
  numOfQs = document.querySelector("#numOfQs"),
  formBtn = document.querySelector("#formBtn"),
  defaultCategory = document.querySelector("#defaultCategory"),
  defaultLevel = document.querySelector("#defaultLevel"),
  alertField = document.querySelector(".alert"),
  quezSection = document.querySelector(".quiz-sec"),
  mainSection = document.querySelector(".main-sec"),
  scoreSection = document.querySelector(".score");

let getAllQuestions, quizModule;

formBtn.addEventListener("click", async () => {
  let category = quizCategory.value;
  let difficulty = quizDifficulty.value;
  let nums_of_qs = numOfQs.value;

  if (category === "" && difficulty === "" && nums_of_qs === "") {
    alertField.classList.add("alert-danger", "text-center");
    alertField.innerHTML = "Please fill out all fields!";
  } else {
    alertField.classList.add("d-none");
    quizModule = new Quiz(category, difficulty, nums_of_qs);

    getAllQuestions = await quizModule.getAllQuestions();

    let questionModule = new Question(0);

    quezSection.classList.replace("d-none", "d-block");
    mainSection.classList.add("d-none");
    questionModule.displayAllQuestions();

    clear();
  }
});

class Quiz {
  constructor(category, diffLevel, numsOfQs) {
    this.category = category;
    this.difficulty_level = diffLevel;
    this.nums_of_qs = numsOfQs;
    this.score = 0;
  }
  getApi() {
    return `https://opentdb.com/api.php?amount=${this.nums_of_qs}&category=${this.category}&difficulty=${this.difficulty_level}`;
  }
  async getAllQuestions() {
    let data = await fetch(this.getApi());
    let result = await data.json();
    return result.results;
  }

  displayScore() {
    let container = ` <div class="container">
    <div class="row">
      <div class="w-auto mx-auto rounded-3 p-4 bg-white text-center">
        <h2 class="text-capitalize h4 mb-3">${
          this.score === getAllQuestions.length
            ? "Congratulations 🤩"
            : "Oops 😞"
        } Your score is ${this.score} of ${getAllQuestions.length}.</h2>
        <button class="btn btn-primary again">Try Again!</button>
      </div>
    </div>
  </div>
`;
    document.querySelector(".score").innerHTML = container;

    document.querySelector(".quiz-sec").classList.replace("d-block", "d-none");
    document.querySelector(".score").classList.replace("d-none", "d-block");
  }
}

class Question {
  constructor(index) {
    this.index = index;
    this.category = getAllQuestions[index].category;
    this.difficulty_level = getAllQuestions[index].difficulty;
    this.question = getAllQuestions[index].question;
    this.correct_answer = getAllQuestions[index].correct_answer;
    this.incorrect_answers = getAllQuestions[index].incorrect_answers;
    this.allAnswers = this.getAllAnswers();
    this.checked = false;
  }
  getAllAnswers() {
    const answers = [...this.incorrect_answers, this.correct_answer];
    answers.sort();
    return answers;
  }
  displayAllQuestions() {
    let container = `<div class=" bg-white p-3 rounded-3 w-auto mx-auto">
    <div class="quiz-header d-flex justify-content-between w-100">
        <p>${this.category}</p>
        <p>${this.index + 1} of ${getAllQuestions.length}</p>
    </div>
    <div class="quiz-question text-center mb-3 ">
        <h2 class = "text-center h4">${this.question}</h2>
    </div>
    <div class="quiz-answers">
        <ul class="choices w-100 list-unstyled d-flex flex-wrap  m-0 text-center justify-content-center ps-0">
${this.allAnswers.map((elem) => `<li>${elem}</li>`).join(" ")}
        </ul>
    </div>
    <h2 class="text-center h3 fw-bold ">Score : ${quizModule.score}</h2>

</div>`;
    document.querySelector("#qsRow").innerHTML = container;

    let choices = document.querySelectorAll(".choices li");
    choices.forEach((elem) => {
      elem.addEventListener("click", () => {
        this.checkAllAnswers(elem);
      });
    });
  }
  checkAllAnswers(li) {
    if (!this.checked) {
      this.checked = true;
      if (li.innerHTML === this.correct_answer) {
        li.classList.add("bg-success", "border-success", "text-white");
        quizModule.score++;
      } else {
        li.classList.add("bg-danger", "border-danger", "text-white");
      }
      this.nextQuestion();
    }
  }

  nextQuestion() {
    this.index++;
    if (this.index < getAllQuestions.length) {
      setTimeout(() => {
        let newQuestion = new Question(this.index);
        newQuestion.displayAllQuestions();
      }, 1000);
    } else {
      quizModule.displayScore();
      document.querySelector(".again").addEventListener("click", () => {
        window.location.reload(); // refresh th page
      });
    }
  }
}

//  clear fields
function clear() {
  defaultCategory.selected = true;
  defaultLevel.selected = true;
  numOfQs.value = "";
}
