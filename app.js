const buttonSound = new Audio("https://www.soundjay.com/buttons/sounds/button-09.mp3");

function playButtonSound() {
  buttonSound.currentTime = 0;
  buttonSound.play();
}
const clickSound = new Audio("https://www.soundjay.com/buttons/sounds/button-16.mp3");
const winSound = new Audio("https://www.soundjay.com/human/sounds/applause-8.mp3");
const loseSound = new Audio("https://www.soundjay.com/button/sounds/beep-10.mp3");

const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const difficultySelect = document.getElementById("difficulty");

let board = ["", "", "", "", "", "", "", "", ""];
let human = "X";
let ai = "O";
let currentPlayer = human;
let gameActive = true;

// 🎨 SYMBOLS
const symbols = {
  X: `<img src="cathead.png" class="cat-img">`,
  O: `<img src="joshhead.png" class="human-img">`
};

// 🧠 WIN CONDITIONS
const winConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// 🎯 CLICK HANDLER (FIXED)
cells.forEach(cell => cell.addEventListener("click", handleClick));

function handleClick(e) {
  const index = e.currentTarget.dataset.index; // ✅ FIXED

  if (index === undefined) return;
  if (board[index] !== "" || !gameActive || currentPlayer !== human) return;

  makeMove(index, human);

  if (gameActive) setTimeout(aiMove, 400);
}

// 🎮 MAKE MOVE
function makeMove(index, player) {
  board[index] = player;
  cells[index].innerHTML = symbols[player];

  clickSound.currentTime = 0;
  clickSound.play();

  vibrate(50);

  if (checkWinner(player)) {

    if (player === human) {
      statusText.textContent = "🐱 You Win! 🎉";
      winSound.play();
      vibrate([200, 100, 200]);

      // 😈 CAT SMILE
      document.querySelectorAll(".cat .mouth").forEach(mouth => {
        mouth.setAttribute("d", "M40 65 Q50 85 60 65");
        mouth.setAttribute("stroke-width", "3");
      });

    } else {
      statusText.textContent = "🤖 Josh Wins!";
      loseSound.play();
      vibrate([400]);
    }

    gameActive = false;
    return;
  }

  if (!board.includes("")) {
    statusText.textContent = "It's a Draw!";
    vibrate([100, 50, 100]);
    gameActive = false;
    return;
  }

  currentPlayer = player === human ? ai : human;
  statusText.textContent =
    currentPlayer === human ? "🐱 Your Turn" : "🤖 Thinking...";
}

// 📳 VIBRATION
function vibrate(pattern) {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

// 🤖 AI MOVE
function aiMove() {
  const difficulty = difficultySelect.value;
  let move;

  if (difficulty === "easy") {
    move = randomMove();
  } else if (difficulty === "medium") {
    move = Math.random() < 0.5 ? smartMove() : randomMove();
  } else {
    move = minimaxMove();
  }

  makeMove(move, ai);
}

// EASY
function randomMove() {
  const empty = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

// MEDIUM
function smartMove() {
  return findBestMoveSimple();
}

// HARD (MINIMAX)
function minimaxMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = ai;
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board, depth, isMaximizing) {
  if (checkWinner(ai)) return 10 - depth;
  if (checkWinner(human)) return depth - 10;
  if (!board.includes("")) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = ai;
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = human;
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = "";
      }
    }
    return best;
  }
}

// SIMPLE SMART
function findBestMoveSimple() {
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = ai;
      if (checkWinner(ai)) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = human;
      if (checkWinner(human)) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  return randomMove();
}

// 🏆 CHECK WINNER
function checkWinner(player) {
  return winConditions.some(c =>
    c.every(i => board[i] === player)
  );
}

// 🔄 RESTART
function restartGame() {
  board = ["","","","","","","","",""];
  currentPlayer = human;
  gameActive = true;

  cells.forEach(cell => cell.innerHTML = "");
  statusText.textContent = "Your Turn";
}
function startGame() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "block";
}

function showGuide() {
  alert(`
🎮 HOW TO PLAY:

- You are 🐱
- Computer is 🤖
- Get 3 in a row to win
- Choose difficulty

Good luck 😈
  `);
}
function exitGame() {
  document.getElementById("game").style.display = "none";
  document.getElementById("menu").style.display = "flex";

  restartGame(); // optional: reset game when exiting
}
function exitGame() {
  if (confirm("Are you sure you want to exit?")) {
    document.getElementById("game").style.display = "none";
    document.getElementById("menu").style.display = "flex";
    restartGame();
  }
}
