const landingDiv = document.getElementById("landing");
const quizDiv = document.getElementById("quiz");
const resultDiv = document.getElementById("result");

let currentQuestions = [];
let userAnswers = {};
let currentWeek = null;

function shuffleArray(array) {
  let copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function goBackToLanding() {
  quizDiv.classList.add("hidden");
  resultDiv.classList.add("hidden");
  landingDiv.classList.remove("hidden");

  landingDiv.innerHTML = "";
  quizDiv.innerHTML = "";
  resultDiv.innerHTML = "";

  currentQuestions = [];
  userAnswers = {};

  loadLanding();
}

function createBackButton() {
  let backBtn = document.createElement("button");
  backBtn.innerText = "Back to Week Selection";
  backBtn.className = "back-btn";
  backBtn.onclick = goBackToLanding;
  return backBtn;
}

// ---------------- LANDING ----------------
function loadLanding() {
  for (let i = 1; i <= 12; i++) {
    let btn = document.createElement("button");
    btn.innerText = "Week " + i;
    btn.onclick = () => startQuiz(i);
    landingDiv.appendChild(btn);
  }

  let allBtn = document.createElement("button");
  allBtn.innerText = "All Weeks";
  allBtn.onclick = () => startQuiz("all");
  landingDiv.appendChild(allBtn);
}

// ---------------- START QUIZ ----------------
let quizMode = "test"; // default

function startQuiz(week) {
  landingDiv.innerHTML = "";

  let practiceBtn = document.createElement("button");
  practiceBtn.innerText = "Practice Mode";
  practiceBtn.onclick = () => initQuiz(week, "practice");

  let testBtn = document.createElement("button");
  testBtn.innerText = "Test Mode";
  testBtn.onclick = () => initQuiz(week, "test");

  landingDiv.appendChild(practiceBtn);
  landingDiv.appendChild(testBtn);
}

// ---------------- INIT QUIZ ----------------
function initQuiz(week, mode) {
  quizMode = mode;
  currentWeek = week;

  landingDiv.classList.add("hidden");
  quizDiv.classList.remove("hidden");

  if (week === "all") {
    currentQuestions = [...quizData];
  } else {
    currentQuestions = quizData.filter(q => q.week === week);
  }

  currentQuestions = shuffleArray(currentQuestions);

  currentQuestions = currentQuestions.map(q => {
    let shuffledOptions = shuffleArray(q.options);
    return {
      ...q,
      options: shuffledOptions
    };
  });

  userAnswers = {};
  renderQuiz();
}

// ---------------- RENDER QUIZ ----------------
function renderQuiz() {
  quizDiv.innerHTML = "";
  
  let weekHeader = document.createElement("div");
  weekHeader.style.marginBottom = "20px";
  let weekTitle = document.createElement("h2");
  weekTitle.innerText = currentWeek === "all" ? "All Weeks" : `Week ${currentWeek}`;
  weekTitle.style.margin = "0 0 10px 0";
  weekHeader.appendChild(weekTitle);
  quizDiv.appendChild(weekHeader);
  
  quizDiv.appendChild(createBackButton());

  currentQuestions.forEach((q, index) => {
    let qDiv = document.createElement("div");
    qDiv.className = "question";

    let title = document.createElement("h3");
    title.innerText = `Q${index + 1}. ${q.question}`;
    qDiv.appendChild(title);

    q.options.forEach(opt => {
      let optDiv = document.createElement("div");
      optDiv.className = "option";
      optDiv.innerText = opt;

      if (quizMode === "practice" && userAnswers[index]) {
        if (opt === q.correctAnswer) {
          optDiv.classList.add("correct");
        }
        if (userAnswers[index] === opt && opt !== q.correctAnswer) {
          optDiv.classList.add("wrong");
        }
      } else if (userAnswers[index] === opt) {
        optDiv.classList.add("selected");
      }

      if (!userAnswers[index] || quizMode === "test") {
        optDiv.onclick = () => {
          userAnswers[index] = opt;
          renderQuiz();
        };
      }

      qDiv.appendChild(optDiv);
    });

    quizDiv.appendChild(qDiv);
  });

  let submitBtn = document.createElement("button");
  submitBtn.innerText = "Submit Quiz";
  submitBtn.onclick = showResult;
  if (quizMode === "test") {
    quizDiv.appendChild(submitBtn);
  }
}

// ---------------- RESULT ----------------
function showResult() {
  quizDiv.classList.add("hidden");
  resultDiv.classList.remove("hidden");
  window.scrollTo(0, 0);

  let score = 0;
  let total = currentQuestions.length;

  currentQuestions.forEach((q, index) => {
    if (userAnswers[index] === q.correctAnswer) {
      score++;
    }
  });

  let weekHeader = document.createElement("div");
  weekHeader.style.marginBottom = "20px";
  let weekTitle = document.createElement("h2");
  weekTitle.innerText = currentWeek === "all" ? "All Weeks" : `Week ${currentWeek}`;
  weekTitle.style.margin = "0 0 10px 0";
  weekHeader.appendChild(weekTitle);
  
  resultDiv.innerHTML = "";
  resultDiv.appendChild(weekHeader);
  
  let scoreHeader = document.createElement("h2");
  scoreHeader.innerText = `You scored ${score} / ${total}`;
  resultDiv.appendChild(scoreHeader);
  resultDiv.appendChild(createBackButton());

  // Render each question with feedback
  currentQuestions.forEach((q, index) => {
    let qDiv = document.createElement("div");
    qDiv.className = "question";

    let title = document.createElement("h3");
    title.innerText = `Q${index + 1}. ${q.question}`;
    qDiv.appendChild(title);

    q.options.forEach(opt => {
      let optDiv = document.createElement("div");
      optDiv.className = "option";

      if (opt === q.correctAnswer) {
        optDiv.classList.add("correct");
      }

      if (userAnswers[index] === opt && opt !== q.correctAnswer) {
        optDiv.classList.add("wrong");
      }

      optDiv.innerText = opt;
      qDiv.appendChild(optDiv);
    });

    // Add note for unanswered
    if (!userAnswers[index]) {
      let note = document.createElement("p");
      note.innerText = "Not attempted";
      note.style.color = "orange";
      qDiv.appendChild(note);
    }

    resultDiv.appendChild(qDiv);
  });
}

// ---------------- INIT ----------------
loadLanding();
