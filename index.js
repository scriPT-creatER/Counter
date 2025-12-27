const countDisplay = document.getElementById("count");
const numCount = document.getElementById("num-count");
const malaCount = document.getElementById("mala-count");
const startBtn = document.getElementById("start-btn");
const progressRing = document.getElementById("progress-ring");

const radius = 172;
const circumference = 2 * Math.PI  * radius;

progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
progressRing.style.strokeDashoffset = circumference;

let counting = 0;
let mala = 0;
const maxCount = 108;
let intervalId = null;
let startTime = null;
let isRunning = false;
const chantAudio = new Audio("audio/audio1.mpeg");
chantAudio.loop = true;
let btnAudio = new Audio('audio/click.mp3');
let pausedElapsed = 0;



startBtn.addEventListener("click", () => {
    btnAudio.play();
    if (startBtn.textContent === "Start") {
        counterStart();
        startBtn.textContent = "Pause";
        isRunning = true;
    }
    else if (startBtn.textContent === "Pause") {
        counterStop();
        startBtn.textContent = "Start";
    }
});




function counterStart() {
    if (intervalId !== null) return;
    
    chantAudio.play();

    isRunning = true;
    startTime = null;

    intervalId = setInterval(() => {
        counting++;

        countDisplay.textContent = `${counting} / ${maxCount}`;
        numCount.textContent = `Count: ${counting}`;
        malaCount.textContent = `mala: ${mala}`;

        if(counting >= maxCount) {
            finishCycle();
        }
    }, 1000);
    requestAnimationFrame(animateProgress);

};

function finishCycle(){
    clearInterval(intervalId);
    intervalId = null;

    chantAudio.pause();
    chantAudio.currentTime = 0;

    mala++;
    counting = 0;

    pausedElapsed = 0;
    startTime = null;
    isRunning = false;


    malaCount.textContent = `mala: ${mala}`;
    numCount.textContent = `Count: ${counting}`;
    countDisplay.textContent = `${counting} / ${maxCount}`;

    setProgress(0);

    startBtn.textContent = "Start";
}


function setProgress(value) {
    const percent = (value / maxCount) * 100;
    const offset = circumference - (percent / 100) * circumference;
    progressRing.style.strokeDashoffset = offset;
}


function counterStop(){
    clearInterval(intervalId);
    intervalId = null;

    chantAudio.pause();
    isRunning = false;

    pausedElapsed = counting;
}


function animateProgress(timestamp) {

    if (!isRunning) return;

    if (!startTime) startTime = timestamp;



    const elapsed = (timestamp - startTime) / 1000 + pausedElapsed;

    const progress = Math.min(elapsed, maxCount);

    setProgress(progress);

    if(progress < maxCount && intervalId !== null) {
        requestAnimationFrame(animateProgress);
    }
}

