const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const btnXIns = document.getElementById("btnXIns");
const btnInstruction = document.getElementById("btnIns");
const instructionBox = document.getElementById("instructionBox");

const btnPlay = document.getElementById("btnPlay");
const mainMenu = document.getElementById("mainMenu");
const mainContent = document.getElementById("mainContent");
const leaderboard = document.getElementById("leaderboard");
const leaderboardContent = document.getElementById("leaderboardContent");
const sortBy = document.getElementById("sortBy");

const replayButton = document.getElementById("btnReplay");
const btnSave = document.getElementById("btnSave");
const usernameGameOver = document.getElementById("usernameGameOver");
const scoreGameOver = document.getElementById("scoreGameOver");

const playerName = document.getElementById("playerName");

const selectDiff = document.getElementById("diff");

const gun1radio = document.getElementById("gun1");
const gun2radio = document.getElementById("gun2");

const gameOverPage = document.getElementById("gameOver");

const continueBtn = document.getElementById("continueBtn");

const timerCountdown = document.getElementById("timerCountdown");
const textTimerCountdown = document.getElementById("textTimerCountdown");

const pauseMenu = document.getElementById("pauseGame");


const target1img = new Image();
target1img.src = 'media/Sprites/target1.png';

const gun1 = new Image();
gun1.src = 'media/Sprites/gun1.png';

let timer = 33;

let playerNames = 'Player didnt fill the name';
let pauseGame = false;


btnInstruction.addEventListener("click", () => {
    instructionBox.style.display = "block";
});
btnXIns.addEventListener("click", () => {
    instructionBox.style.display = "none";
});
playerName.addEventListener("input", (e) => {
    if (e.target.value != null) {
        btnPlay.disabled = false;
        btnPlay.style.backgroundColor = "green";
    } else {
        btnPlay.disabled = true;
        btnPlay.style.backgroundColor = "red";
    }
});
btnPlay.addEventListener("click", () => {
    updateLeaderboard();
    mainMenu.style.display = "none";
    leaderboard.style.display = "block";
    if (selectedDiffValue == 'Hard') {
        timer = 15 + 3;
    } else if (selectedDiffValue == 'Medium') {
        timer = 20 + 3;
    } else {
        timer = 30 + 3;
    }

    const gunRadios = document.getElementsByName("gun");
    for (const radio of gunRadios) {
        if (radio.checked) {
            gun1.src = `media/Sprites/${radio.id}.png`;
            break;
        }
    }

    const targetRadios = document.getElementsByName("target");
    for (const radio of targetRadios) {
        if (radio.checked) {
            target1img.src = `media/Sprites/${radio.id}.png`;
            break;
        }
    }

    playerNames = playerName.value ? playerName.value : 'Player didnt fill the name';
    timerCountdown.style.display = 'block';
    setTimeout(() => {
        textTimerCountdown.textContent = 2;
        setTimeout(() => {
            textTimerCountdown.textContent = 1;

            setTimeout(() => {
                textTimerCountdown.textContent = 3;

                main();
                timerCountdown.style.display = 'none';
            }, 1000);
        }, 1000);
    }, 1000);
});

let selectedDiffValue = '';
selectDiff.addEventListener("change", (e) => {
    selectedDiffValue = e.target.value;
});

continueBtn.addEventListener("click", (e) => {
    pauseMenu.style.display = "none";
    timerCountdown.style.display = 'block';
    setTimeout(() => {
        textTimerCountdown.textContent = 2;
        timer += 2;
        setTimeout(() => {
            textTimerCountdown.textContent = 1;
            timer += 2;
            pauseGame = false;
            setTimeout(() => {
                textTimerCountdown.textContent = 3;
                timerCountdown.style.display = 'none';
                main();

            }, 1000);
        }, 1000);
    }, 1000);
});


const croshair = new Image();
croshair.src = 'media/Sprites/pointer.png';

const boom = new Image();
boom.src = 'media/Sprites/boom.png';

let crosx = 0;
let crosy = 0;
let crosw = 50;
let crosh = 50;

let score = 0;

let isLeftClick = false;

let isHitTarget = false;

//kita mengambil marginleft dari canvas, supaya kita bisa menyesuaikan posisi draw croshair dengan kursor mouse
let ml = window.getComputedStyle(canvas, null).getPropertyValue("margin-left");
ml = ml.substring(0, ml.length - 2);

function main() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateTarget();
    if (timer <= 0) {
        clearInterval(timerInterval);
    }
    ctx.strokeStyle = "black";
    ctx.lineWidth = 100;
    ctx.rect(0, 0, 1000, 10);
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.font = "24px arial";
    ctx.fillText(playerNames, 20, 40);
    ctx.fillText("Score : " + score, 400, 40);
    ctx.fillText("Time : " + timer, 850, 40);

    ctx.drawImage(croshair, crosx - ml / 2, crosy - ml / 2, crosw, crosh);
    ctx.drawImage(gun1, 410, 400, 200, 200);
    if (isHitTarget) {
        ctx.drawImage(boom, crosx - ml / 2, crosy - ml / 2, 60, 60);
        setTimeout(() => {
            isHitTarget = false;
        }, 100);
    }
    if (timer <= 0) {
        gameOver();
    }
    if (!pauseGame) {
        requestAnimationFrame(main);
    }
    if (pauseGame) {
        pauseMenu.style.display = "block";
    }
}

function collideTarget() {
    for (let j = 0; j < targets.length; j++) {
        const target = targets[j];
        if (crosx - ml / 2 + crosw > target.x &&
            crosx - ml / 2 < target.x + target.width &&
            crosy - ml / 2 + crosh > target.y &&
            crosy - ml / 2 < target.y + target.height
        ) {
            if (isLeftClick) {
                isHitTarget = true;
                score += target.point;
                targets.splice(j, 1);
                console.log(targets);
            }
        }
    }
}

function gameOver() {
    gameOverPage.style.display = "block";
    usernameGameOver.textContent = playerNames;
    scoreGameOver.textContent = score;
}

btnSave.addEventListener('click', () => {
    if (!gameOverPage.dataset.submitted) {
        gameOverPage.dataset.submitted = true;

        let scores = localStorage.getItem('scores');
        if (scores) {
            scores = JSON.parse(scores);
        } else {
            scores = [];
        }

        scores.push({ playerName: playerNames, score: score });

        localStorage.setItem('scores', JSON.stringify(scores));
        updateLeaderboard();
        location.reload();
    }
});

replayButton.addEventListener('click', () => {
    location.reload();
});

function updateLeaderboard() {
    let scores = localStorage.getItem('scores');
    if (scores) {
        scores = JSON.parse(scores);
    } else {
        scores = [];
    }

    // Sort scores dari selected option
    if (sortBy.value === 'score') {
        scores.sort((a, b) => b.score - a.score);
    } else if (sortBy.value === 'recent') {
        scores.sort((a, b) => b.timestamp - a.timestamp);
    }

    // Update leaderboard content
    leaderboardContent.innerHTML = '';
    scores.forEach(entry => {
        const div = document.createElement('div');
        div.textContent = `${entry.playerName}: ${entry.score}`;
        leaderboardContent.appendChild(div);
    });
}

sortBy.addEventListener('change', updateLeaderboard);

const timerInterval = setInterval(() => {
    timer--;
}, 1000);

setInterval(() => {
    targets = [];
    spawnTarget();
    console.log('spawn');
}, 3000);

addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    crosx = e.clientX - rect.left;
    crosy = e.clientY - rect.top;
});
addEventListener("mousedown", (e) => {
    if (e.button === 0) {
        isLeftClick = true;
        collideTarget();
    }
});
addEventListener("mouseup", (e) => {
    isLeftClick = true;
});

addEventListener("keydown", (e) => {
    if (e.key == "Escape") {
        if (!pauseGame) {
            pauseGame = true;
        }
    }
    if (e.key == ' ') {
        console.log('change wp');
    }
});
