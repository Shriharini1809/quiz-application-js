const configContainer = document.querySelector(".config-container");
const quizContainer = document.querySelector(".quiz-container");
const answerOptions = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const questionStatus = document.querySelector(".question-status");
const timerDisplay=document.querySelector(".time-duration");
const resultContainer = document.querySelector(".result-container");

const QUIZ_TIME_LIMIT=10;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;
let correctAnswerCount=0;

let quizCategory = "programming";
let numberOfQuestion = 5;
const questionsIndexHistory=[];

const showQuizResult=()=>{
    quizContainer.style.display="none";
    resultContainer.style.display="block";
    const resultText = `You answered <b>${correctAnswerCount}</b> out of <b>${numberOfQuestion}</b> questions correctly. Great effort`;
    document.querySelector(".result-content").innerHTML = resultText;
}

document.querySelectorAll(".category-option, .question-option").forEach(option => {
    option.addEventListener("click",()=> {
        option.parentNode.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    });
});

const resetTimer = () => {
    clearInterval(timer);
    currentTime = QUIZ_TIME_LIMIT;
    timerDisplay.textContent =  `${currentTime}s`;
}

const startTimer = () => {
    timer = setInterval(() => {
        currentTime--;
        timerDisplay.textContent =  `${currentTime}s`;

        if(currentTime <= 0){
            clearInterval(timer);
            HighlightCorrectAnswer();
            nextQuestionBtn.style.visibility="visible";
            const quizTimer=document.querySelector(".quiz-timer");
            quizTimer.style.background="#c31402"
            //disable all answer options after one option is selected
            answerOptions.querySelectorAll(".answer-option").forEach(option => option.style.pointerEvents = "none");
    
        }
    },1000);
}

const getRandomQuestion = () => {
    const categoryQuestions = questions.find(cat => 
        cat.category.toLowerCase() == quizCategory.toLowerCase()
    ).questions || [];

    if(questionsIndexHistory.length >= Math.min(categoryQuestions.length, numberOfQuestion)){
        return showQuizResult();
    }

const availableQuestion = categoryQuestions.filter((_,index)=> !questionsIndexHistory.includes(index));

    const randomQuestion = categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];
    
    return randomQuestion;
}

const HighlightCorrectAnswer = () => {
    const correctOption = answerOptions.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];
    correctOption.classList.add("correct");
    const iconHTML = `<span class="material-symbols-rounded">check_circle</span>`;

    correctOption.insertAdjacentHTML("beforeend", iconHTML);
}
//handle the users
const handleAnswer = (option,answerIndex) => {
    clearInterval(timer);

    const isCorrect=currentQuestion.correctAnswer === answerIndex;
    option.classList.add(isCorrect ? 'correct' : 'cancel');
    !isCorrect ? HighlightCorrectAnswer() : correctAnswerCount++;

    //insert icon based on corrections
    const iconHTML = `<span class="material-symbols-rounded">${isCorrect ? `check_circle` : `cancel`}</span>`

    option.insertAdjacentHTML("beforeend", iconHTML);

    //disable all answer options after one option is selected
    answerOptions.querySelectorAll(".answer-option").forEach(option => option.style.pointerEvents = "none");
    nextQuestionBtn.style.visibility="visible";
}

//render the current question and its options in the quiz
let currentQuestion = null;
const renderQuestion = () => {
    currentQuestion = getRandomQuestion();
    if(!currentQuestion) return;
    console.log(currentQuestion);
    questionsIndexHistory.push(currentQuestion);

    //timer
    resetTimer()
    startTimer();

    //update the ui
    answerOptions.innerHTML = "";
    nextQuestionBtn.style.visibility="hidden";
    

    document.querySelector(".question-text").textContent = currentQuestion.question;
    questionStatus.innerHTML=`<b>${questionsIndexHistory.length}</b> of <b>${numberOfQuestion}</b> Questions`;

    //create option <li> elements, append them, and add click event listeners
    currentQuestion.options.forEach((option ,index) => {
        const li = document.createElement("li");
        li.classList.add("answer-option"); // fixed
        li.textContent = option;
        answerOptions.appendChild(li);
        li.addEventListener("click",()=> handleAnswer(li,index));
    });
}

renderQuestion();

const startQuiz = () =>{
    configContainer.style.display="none";
    quizContainer.style.display="block";

    //update the quiz category and number of questions
    quizCategory=configContainer.querySelector(".category-option.active").textContent;
    numberOfQuestion=configContainer.querySelector(".question-option.active").textContent;

}

const resetQuiz=()=>{
    resetTimer();
    correctAnswerCount=0;
    questionsIndexHistory.length=0;
    configContainer.style.display="block";
    resultContainer.style.display="none";
}
nextQuestionBtn.addEventListener("click",renderQuestion);
document.querySelector(".result-try-again-btn").addEventListener("click",resetQuiz);
document.querySelector(".quiz-start-button").addEventListener("click",startQuiz);