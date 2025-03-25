const questions = [
    { question: "You receive a payment from a client that doesn't match any invoice. What should you do?", options: ["A. Apply to oldest invoice", "B. Record as income", "C. Record as credit", "D. Return it"], answer: "C. Record as credit" },
    { question: "A bill from last month was discovered unrecorded, but books are closed. How do you account for it?", options: ["A. Reopen books", "B. Ignore it", "C. Delay recording", "D. Record via adjustment"], answer: "D. Record via adjustment" },
    { question: "Office supplies were expensed all at once. What adjustment should be made?", options: ["A. Reclassify as prepaid", "B. No adjustment", "C. Capitalize it", "D. Transfer to inventory"], answer: "A. Reclassify as prepaid" },
    { question: "Your bank statement shows $50 interest earned. What is the correct entry?", options: ["A. Debit Expense, Credit Cash", "B. No entry needed", "C. Debit Cash, Credit Interest Income", "D. Debit Cash, Credit Expense"], answer: "C. Debit Cash, Credit Interest Income" },
    { question: "A $500 invoice was entered twice. How do you fix it?", options: ["A. Reverse duplicate", "B. Ignore it", "C. Leave it", "D. Move it"], answer: "A. Reverse duplicate" },
    { question: "Your cash register is $100 short. How should you record it?", options: ["A. Reduce sales", "B. Create A/R entry", "C. Record as expense", "D. Ignore"], answer: "C. Record as expense" },
    { question: "A customer pays $980 on a $1,000 invoice (2% discount). What is the entry?", options: ["A. Debit Cash $980, Credit A/R $980", "B. Debit Cash $980, Debit Discount $20, Credit A/R $1,000", "C. Debit Cash $1,000, Credit Revenue $1,000", "D. Invoice remaining $20"], answer: "B. Debit Cash $980, Debit Discount $20, Credit A/R $1,000" },
    { question: "Company buys equipment for $2,000, paying $500 cash, rest on note. How is this recorded?", options: ["A. Debit Equip $500, Debit Notes $1,500, Credit Cash $2,000", "B. Debit Equip $2,000, Credit A/P $2,000", "C. Debit Equip Expense $2,000, Credit Cash $500, Credit Notes $1,500", "D. Debit Equip $2,000, Credit Cash $500, Credit Notes $1,500"], answer: "D. Debit Equip $2,000, Credit Cash $500, Credit Notes $1,500" },
    { question: "You wrote a check on Dec 31, but it hasn’t cleared yet. What should you do?", options: ["A. Adjust Cash", "B. List as outstanding", "C. Void check", "D. Reduce balance"], answer: "B. List as outstanding" },
    { question: "Your trial balance is off by $2. What is the best solution?", options: ["A. Ignore it", "B. Delay closing", "C. Adjust $2 to misc. expense", "D. Adjust cash account"], answer: "C. Adjust $2 to misc. expense" },
    { question: "The owner used business funds for personal expenses. How should you record this?", options: ["A. Record as business expense", "B. Loan to owner", "C. Ignore it", "D. Owner’s draw"], answer: "D. Owner’s draw" },
    { question: "A vendor’s bill was mistakenly entered twice in A/P. What should you do?", options: ["A. Remove duplicate", "B. Ignore it", "C. Vendor will refund", "D. No action needed"], answer: "A. Remove duplicate" },
    { question: "A client sends a $300 payment but has two unpaid invoices ($200 & $300). What should you do?", options: ["A. Apply to $300 invoice", "B. Hold as unapplied credit", "C. Apply $200 and $100 as partial", "D. Return payment"], answer: "B. Hold as unapplied credit" },
    { question: "Your company receives $5,000 advance for next year's service. How should you record it?", options: ["A. Revenue now", "B. Owner’s equity", "C. Don't record it", "D. Deferred revenue"], answer: "D. Deferred revenue" },
    { question: "A $15 bank service fee was found while reconciling. How do you record it?", options: ["A. Debit Bank Fees Exp $15, Credit Cash $15", "B. Debit Cash $15, Credit Bank Fees Exp $15", "C. Debit Misc Expense $15, Debit Cash $15", "D. Wait until year-end"], answer: "A. Debit Bank Fees Exp $15, Credit Cash $15" }
];

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 60;
let timer;
let userData = {};

const formContainer = document.getElementById("form-container");
const quizContainer = document.getElementById("quiz-container");
const resultScreen = document.getElementById("result-screen");
const thankYouScreen = document.getElementById("thank-you-screen");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const timerEl = document.getElementById("time-left");
const scoreEl = document.getElementById("score");
const exitBtn = document.getElementById("exit-btn");

window.onload = function () {
    formContainer.classList.remove("hidden");
};

document.getElementById("user-form").addEventListener("submit", function (e) {
    e.preventDefault();

    userData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value
    };

    formContainer.classList.add("hidden");
    quizContainer.classList.remove("hidden");

    loadQuestion();
});

function startTimer() {
    timeLeft = 60;
    timerEl.textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        if (timeLeft === 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);
}

function loadQuestion() {
    clearInterval(timer);
    startTimer();

    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    let currentQuestion = questions[currentQuestionIndex];
    questionEl.textContent = currentQuestion.question;
    optionsEl.innerHTML = "";

    currentQuestion.options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => checkAnswer(option);
        optionsEl.appendChild(button);
    });
}

function checkAnswer(selected) {
    clearInterval(timer);
    let correctAnswer = questions[currentQuestionIndex].answer;
    if (selected === correctAnswer) {
        score++;
    } else {
        alert("Wrong answer! Moving to the next question.");
    }
    nextQuestion();
}

function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

function showResults() {
    quizContainer.classList.add("hidden");
    resultScreen.classList.remove("hidden");
    scoreEl.textContent = `You scored ${score} out of ${questions.length}!`;
    saveUserData();
}

function saveUserData() {
    fetch("/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userData, score })
    });
}

exitBtn.addEventListener("click", () => {
    resultScreen.classList.add("hidden");
    thankYouScreen.classList.remove("hidden");
});
