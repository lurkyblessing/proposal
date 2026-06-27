const startBtn = document.getElementById('startBtn');
const quizModal = document.getElementById('quizModal');
const closeBtn = document.getElementById('closeBtn');

startBtn.addEventListener('click', () => {
    quizModal.classList.add('show');
});

closeBtn.addEventListener('click', () => {
    quizModal.classList.remove('show');
    // Reset quiz
    document.querySelectorAll('.quiz-step').forEach(step => step.classList.remove('active'));
    document.getElementById('step1').classList.add('active');
});

function nextStep(stepNumber) {
    document.querySelectorAll('.quiz-step').forEach(step => step.classList.remove('active'));
    document.getElementById('step' + stepNumber).classList.add('active');
}
