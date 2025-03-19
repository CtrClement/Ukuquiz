let quiz = {
    title: "",
    questions: []
};

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
