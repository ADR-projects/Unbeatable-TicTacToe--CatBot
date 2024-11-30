const cells = document.querySelectorAll(".cell");
const text = document.querySelector("#Text");
const rematchBtn = document.querySelector("#rematchButton");
const promptDiv = document.getElementById("yes-no-radio");

const yesButton = document.getElementById("yes");
const noButton = document.getElementById("no");
document.getElementById("yes").addEventListener("click", fadeOutPrompt);
document.getElementById("no").addEventListener("click", fadeOutPrompt);

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "🐱"; // Cat
let isRunning = false;

startGame();


function fadeOutPrompt() {
  promptDiv.style.transition = "opacity 0.5s ease-in-out"; 
  promptDiv.style.opacity = 0;
  setTimeout(() => {
      promptDiv.style.display = "none";
  }, 500); 
}
function fadeInPrompt(){
  promptDiv.style.transition = "opacity 0.5s ease-in-out"; 
  promptDiv.style.opacity = 100;
  setTimeout(() => {
      promptDiv.style.display = "block";
  }, 500); 
}
function startGame() {
   fadeInPrompt();
    yesButton.addEventListener("click", userStart);
    noButton.addEventListener("click", catBotStart);
    rematchBtn.addEventListener("click", rematch);
    isRunning = true;
  }


function userStart() {
    currentPlayer = "🐟"; // Fish
    cells.forEach((cell) => cell.addEventListener("click", cellClicked));
}


function catBotStart() {
    if (options.includes("")) {
        currentPlayer = "🐱";
        text.innerText = `${currentPlayer} is thinking...`;
        setTimeout(getCatBotMove, 1000);
    }
}

function getCatBotMove() {
    const catIndex = getBestMove();
    updateCell(cells[catIndex], catIndex);
    whoWon();
}

function getBestMove() {
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
        if (options[i] === "") {
            options[i] = "🐱";
            let score = minimax(options, 0, false);
            options[i] = ""; //UNDO move
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    const winner = checkWinner(board);
    if (winner === "🐱") 
      return 1; 
    if (winner === "🐟") 
      return -1;
    if (!board.includes(""))
       return 0; //Tie

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "🐱";
                let score = minimax(board, depth + 1, false);
                board[i] = ""; //UNDO move
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "🐟";
                let score = minimax(board, depth + 1, true);
                board[i] = ""; //UNDO move
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function cellClicked() {
    const cindex = this.getAttribute("cellIndex");
    if (options[cindex] !== "" || !isRunning) {
        return;
    }
    updateCell(this, cindex);
    whoWon();
}

function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.innerText = currentPlayer;
    changePlayer();
}

function changePlayer() {
    currentPlayer = currentPlayer === "🐱" ? "🐟" : "🐱";
    text.innerText = `It's ${currentPlayer}'s turn...`;
    if (currentPlayer === "🐱") {
        catBotStart();
    }
}

function whoWon() {
    const winner = checkWinner(options);
    if (winner) {
        text.innerText = `${winner} has WON!!`;
        isRunning = false;
        return;
    }
    if (!options.includes("")) {
        text.innerText = `It's a TIE?!\nYou can have a Rematch.`;
        isRunning = false;
    }
}

function checkWinner(board) {
    for (const condition of winConditions) {
        const positions = condition;
        if (board[positions[0]]==board[positions[1]]&&board[positions[2]]==board[positions[1]]) {
            return board[positions[0]]; //we returnin the winner
        }
    }
    return null; //No winner yet
}

function rematch() {
  options = ["", "", "", "", "", "", "", "", ""];
  cells.forEach((cell) => (cell.textContent = ""));
  promptDiv.style.display = "block";
  text.innerText = ""; 
  startGame();
}

