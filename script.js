// Vérifier si l'utilisateur est connecté
function checkAuth() {
    if (!localStorage.getItem("loggedInUser")) {
        window.location.href = "login.html"; // Redirige vers la connexion
    }
}

// Stockage des utilisateurs autorisés (à modifier)
const users = {
    "joueur1": "mdp123",
    "joueur2": "ukufa2024"
};

// Fonction de connexion
function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (users[username] && users[username] === password) {
        localStorage.setItem("loggedInUser", username);
        window.location.href = "quiz.html"; // Redirige vers le quiz
    } else {
        document.getElementById("error-message").innerText = "Identifiants incorrects !";
    }
}

// Fonction de déconnexion
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}

// Charger le quiz depuis `quizzes.json`
async function loadQuiz() {
    checkAuth(); // Vérifie la connexion
    const response = await fetch("quizzes.json");
    const data = await response.json();
    quizData = data.quizzes[0];

    document.getElementById("quiz-title").innerText = quizData.title;
    currentQuestion = 0;
    questions = quizData.questions;
    loadQuestion();
}

function loadQuestion() {
    const questionContainer = document.getElementById("question-container");
    questionContainer.innerHTML = "";

    let questionObj = questions[currentQuestion];
    let questionText = document.createElement("h2");
    questionText.innerText = questionObj.question;
    questionContainer.appendChild(questionText);

    questionObj.answers.forEach((answer, index) => {
        let button = document.createElement("button");
        button.innerText = answer;
        button.onclick = () => checkAnswer(index);
        questionContainer.appendChild(button);
    });
}

function checkAnswer(index) {
    if (index === questions[currentQuestion].correct) {
        alert("Bonne réponse !");
    } else {
        alert("Mauvaise réponse !");
    }
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        alert("Quiz terminé !");
    }
}

// Charge le quiz au chargement de `quiz.html`
if (window.location.pathname.includes("quiz.html")) {
    loadQuiz();
}

// Charger un quiz créé en admin
function loadCreatedQuiz() {
    let storedQuiz = localStorage.getItem("createdQuiz");
    if (storedQuiz) {
        let quizData = JSON.parse(storedQuiz);
        document.getElementById("quiz-title").innerText = quizData.title;
        currentQuestion = 0;
        questions = quizData.questions;
        loadQuestion();
    } else {
        alert("Aucun quiz créé !");
    }
}

// Modifier loadQuiz pour charger soit un quiz du JSON, soit un quiz de l'admin
async function loadQuiz() {
    let storedQuiz = localStorage.getItem("createdQuiz");
    if (storedQuiz) {
        loadCreatedQuiz();
    } else {
        const response = await fetch("quizzes.json");
        const data = await response.json();
        quizData = data.quizzes[0];

        document.getElementById("quiz-title").innerText = quizData.title;
        currentQuestion = 0;
        questions = quizData.questions;
        loadQuestion();
    }
}
