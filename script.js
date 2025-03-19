// Vérifier si l'utilisateur est connecté
function checkAuth() {
    if (!localStorage.getItem("loggedInUser")) {
        window.location.href = "login.html"; // Redirige vers la connexion
    }
}

// Liste des utilisateurs
const users = {
    "joueur1": { password: "mdp123", role: "player" },
    "joueur2": { password: "ukufa2024", role: "player" },
    "admin": { password: "root", role: "admin" } // Ton accès admin
};

// Fonction de connexion
function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (users[username] && users[username].password === password) {
        localStorage.setItem("loggedInUser", username);
        localStorage.setItem("userRole", users[username].role);

        if (users[username].role === "admin") {
            window.location.href = "admin.html"; // Redirige vers l'admin
        } else {
            window.location.href = "quiz.html"; // Redirige vers le quiz
        }
    } else {
        document.getElementById("error-message").innerText = "Identifiants incorrects !";
    }
}

// Fonction pour vérifier si l'utilisateur est connecté
function checkAuth() {
    let role = localStorage.getItem("userRole");
    if (!role) {
        window.location.href = "login.html"; // Si pas connecté, retour à login
    }
}

// Fonction de déconnexion
function logout() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");
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
