function loadQuizzes() {
    let allQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    displayQuizList();
}

let quiz = {
    title: "",
    questions: []
};

document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("userRole") !== "admin") {
        window.location.href = "login.html"; // Bloque l'accès si ce n'est pas un admin
    }
});

function editQuiz(index) {
    let allQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    let selectedQuiz = allQuizzes[index];

    if (!selectedQuiz) return;

    quizData = selectedQuiz; // Charge les données du quiz
    document.getElementById("quiz-title").value = quizData.title;
    displayQuestions(); // Affiche les questions

    // Ajouter un bouton "Mettre à jour" au lieu de "Enregistrer"
    let saveButton = document.querySelector("button[onclick='saveQuiz()']");
    let updateButton = document.createElement("button");
    updateButton.innerText = "Mettre à jour le Quiz";
    updateButton.onclick = function () {
        updateQuiz(index);
    };

    saveButton.parentNode.replaceChild(updateButton, saveButton);
}

function updateQuiz(index) {
    let allQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    allQuizzes[index] = quizData; // Met à jour le quiz
    localStorage.setItem("quizzes", JSON.stringify(allQuizzes));

    alert("Quiz mis à jour !");
    resetQuiz();
    displayQuizList();
}

function deleteQuiz(index) {
    if (confirm("Es-tu sûr de vouloir supprimer ce quiz ?")) {
        let allQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
        allQuizzes.splice(index, 1);
        localStorage.setItem("quizzes", JSON.stringify(allQuizzes));

        displayQuizList();
    }
}


// Ajout d'une réponse à la question actuelle
function addAnswer() {
    let container = document.getElementById("answer-list");
    let index = container.children.length;
    let div = document.createElement("div");

    div.innerHTML = `
        <input type="text" placeholder="Réponse ${index + 1}" id="answer-${index}">
        <input type="checkbox" id="correct-${index}"> Correct
    `;
    
    container.appendChild(div);
}

function editQuestion(index) {
    let question = quizData.questions[index];

    document.getElementById("question-text").value = question.text;
    document.getElementById("question-type").value = question.type;
    document.getElementById("question-image").value = question.image || "";
    document.getElementById("correction-text").value = question.correction || "";
    document.getElementById("question-points").value = question.points;

    // Ajoute un bouton "Mettre à jour"
    let updateBtn = document.createElement("button");
    updateBtn.innerText = "Mettre à jour";
    updateBtn.onclick = function () {
        updateQuestion(index);
    };

    // Ajoute ce bouton à la page (remplace "Ajouter Question")
    let addBtn = document.querySelector("button[onclick='saveQuestion()']");
    addBtn.parentNode.replaceChild(updateBtn, addBtn);
}
function displayQuizList() {
    let quizListContainer = document.getElementById("quiz-list");
    quizListContainer.innerHTML = "";

    let allQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];

    if (allQuizzes.length === 0) {
        quizListContainer.innerHTML = "<p>Aucun quiz enregistré.</p>";
        return;
    }

    allQuizzes.forEach((quiz, index) => {
        let quizItem = document.createElement("div");
        quizItem.classList.add("quiz-item");
        quizItem.innerHTML = `
            <strong>${quiz.title}</strong> (${quiz.questions.length} questions)
            <br>
            <button onclick="editQuiz(${index})">✏️ Modifier</button>
            <button onclick="deleteQuiz(${index})">🗑️ Supprimer</button>
        `;
        quizListContainer.appendChild(quizItem);
    });
}

function updateQuestion(index) {
    quizData.questions[index] = {
        text: document.getElementById("question-text").value,
        type: document.getElementById("question-type").value,
        image: document.getElementById("question-image").value,
        correction: document.getElementById("correction-text").value,
        points: parseInt(document.getElementById("question-points").value) || 1,
    };

    displayQuestions(); // Met à jour la liste
    resetForm(); // Remet les champs à zéro
}

function deleteQuestion(index) {
    if (confirm("Es-tu sûr de vouloir supprimer cette question ?")) {
        quizData.questions.splice(index, 1);
        displayQuestions(); // Rafraîchit la liste après suppression
    }
}

function resetForm() {
    document.getElementById("question-text").value = "";
    document.getElementById("question-type").value = "qcm";
    document.getElementById("question-image").value = "";
    document.getElementById("correction-text").value = "";
    document.getElementById("question-points").value = "1";

    // Remettre le bouton "Ajouter la Question" après une mise à jour
    let updateBtn = document.querySelector("button[onclick^='updateQuestion']");
    if (updateBtn) {
        let addBtn = document.createElement("button");
        addBtn.innerText = "Ajouter la Question";
        addBtn.setAttribute("onclick", "saveQuestion()");
        updateBtn.parentNode.replaceChild(addBtn, updateBtn);
    }
}

// Sauvegarde la question en mémoire
function saveQuestion() {
    let questionText = document.getElementById("question-text").value;
    let questionType = document.getElementById("question-type").value;
    let questionImage = document.getElementById("question-image").value;
    let correctionText = document.getElementById("correction-text").value;
    let points = parseInt(document.getElementById("question-points").value);

    let answers = [];
    let correctAnswers = [];

    let container = document.getElementById("answer-list");
    for (let i = 0; i < container.children.length; i++) {
        let answerText = document.getElementById(`answer-${i}`).value;
        let isCorrect = document.getElementById(`correct-${i}`).checked;

        answers.push(answerText);
        if (isCorrect) correctAnswers.push(i);
    }

    let newQuestion = {
        type: questionType,
        question: questionText,
        image: questionImage || null,
        answers: answers,
        correct: correctAnswers,
        correction: correctionText,
        points: points
    };

    quiz.questions.push(newQuestion);
    updateQuestionList();
}

function saveQuiz() {
    if (!quizData.title || quizData.questions.length === 0) {
        alert("Le quiz doit avoir un titre et au moins une question !");
        return;
    }

    let allQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    allQuizzes.push(quizData);
    localStorage.setItem("quizzes", JSON.stringify(allQuizzes));

    alert("Quiz enregistré !");
    resetQuiz();
    displayQuizList(); // On met à jour la liste des quiz après enregistrement
}

// Met à jour l'affichage des questions ajoutées
function updateQuestionList() {
    let list = document.getElementById("questions-list");
    list.innerHTML = "";

    quiz.questions.forEach((q, index) => {
        let li = document.createElement("li");
        li.innerText = `${index + 1}. ${q.question} (${q.points} pts)`;
        list.appendChild(li);
    });
}
// Fonction pour afficher les questions dans la liste avec options Modifier / Supprimer
function displayQuestions() {
    let questionsList = document.getElementById("questions-list");
    questionsList.innerHTML = ""; // On vide la liste avant d'afficher les nouvelles questions

    quizData.questions.forEach((q, index) => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${q.text}</strong> (${q.type}) - <i>${q.points} pts</i>
            <br> <small>Correction: ${q.correction || "Aucune"}</small>
            <br> <button class="edit-btn" onclick="editQuestion(${index})">✏️ Modifier</button>
            <button class="delete-btn" onclick="deleteQuestion(${index})">🗑️ Supprimer</button>
        `;
        questionsList.appendChild(listItem);
    });
}


// Sauvegarde le quiz
function saveQuiz() {
    quiz.title = document.getElementById("quiz-title").value;

    if (quiz.title === "" || quiz.questions.length === 0) {
        alert("Ajoute un titre et au moins une question !");
        return;
    }

    localStorage.setItem("createdQuiz", JSON.stringify(quiz));
    alert("Quiz sauvegardé !");
}
