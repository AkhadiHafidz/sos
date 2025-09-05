let board = [];
let size = 5;
let turn = 0;
let scores = [0, 0];
let player1 = "";
let player2 = "";
let roomCode = "";

const boardEl = document.getElementById("board");
const turnInfo = document.getElementById("turnInfo");
const score1Text = document.getElementById("score1Text");
const score2Text = document.getElementById("score2Text");

const setupScreen = document.getElementById("setupScreen");
const waitScreen = document.getElementById("waitScreen");
const gameScreen = document.getElementById("gameScreen");
const roomCodeDisplay = document.getElementById("roomCodeDisplay");

document.getElementById("startBtn").onclick = () => {
  player1 = document.getElementById("player1Name").value.trim();
  if (!player1) return alert("Masukkan nama pemain 1!");
  roomCode = generateRoomCode();
  roomCodeDisplay.textContent = roomCode;

  setupScreen.style.display = "none";
  waitScreen.style.display = "block";
};

document.getElementById("joinBtn").onclick = () => {
  player2 = document.getElementById("player2Name").value.trim();
  if (!player2) return alert("Masukkan nama pemain 2!");
  waitScreen.style.display = "none";
  gameScreen.style.display = "block";

  size = parseInt(document.getElementById("sizeInput").value);
  startGame();
};

document.getElementById("resetBtn").onclick = () => {
  gameScreen.style.display = "none";
  setupScreen.style.display = "block";
  boardEl.innerHTML = "";
  player1 = "";
  player2 = "";
  roomCode = "";
};

function startGame() {
  board = Array.from({ length: size }, () => Array(size).fill(""));
  scores = [0, 0];
  turn = 0;
  renderBoard();
  updateInfo();
}

function renderBoard() {
  boardEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  boardEl.innerHTML = "";

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = board[r][c];

      cell.onclick = () => {
        if (board[r][c] === "") {
          const letter = prompt(`Giliran ${turn === 0 ? player1 : player2}. Masukkan S atau O:`).toUpperCase();
          if (letter === "S" || letter === "O") {
            board[r][c] = letter;
            const points = checkSOS(r, c);
            scores[turn] += points;
            if (points === 0) turn = 1 - turn;
            updateInfo();
            renderBoard();
          }
        }
      };

      boardEl.appendChild(cell);
    }
  }
}

function updateInfo() {
  turnInfo.textContent = `Giliran: ${turn === 0 ? player1 : player2}`;
  score1Text.textContent = `${player1}: ${scores[0]}`;
  score2Text.textContent = `${player2}: ${scores[1]}`;
}

function checkSOS(r, c) {
  const dirs = [
    [0,1],[1,0],[1,1],[1,-1],
    [0,-1],[-1,0],[-1,-1],[-1,1]
  ];
  let points = 0;
  for (let [dr, dc] of dirs) {
    try {
      let line = [
        board[r - dr][c - dc],
        board[r][c],
        board[r + dr][c + dc]
      ];
      if (line[0] === "S" && line[1] === "O" && line[2] === "S") points++;
    } catch {}
  }
  return points;
}

function generateRoomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
