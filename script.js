const minesweeper = document.getElementById("minesweeper");
const gridSize = 10;
const numMines = 15;
let cells = [];
let gameEnded = false;

function createGrid() {
  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-id", i);
    cell.setAttribute("data-bomb", "false");
    cell.addEventListener("click", () => handleClick(cell));
    cell.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (!gameEnded) toggleFlag(cell);
    });
    minesweeper.appendChild(cell);
    cells.push(cell);
  }
  placeMines();
}

function placeMines() {
  let placedMines = 0;
  while (placedMines < numMines) {
    const randomIndex = Math.floor(Math.random() * gridSize * gridSize);
    const cell = cells[randomIndex];
    if (cell.getAttribute("data-bomb") === "false") {
      cell.setAttribute("data-bomb", "true");
      placedMines++;
    }
  }
}

function handleClick(cell) {
  if (
    gameEnded ||
    cell.classList.contains("revealed") ||
    cell.classList.contains("flag")
  )
    return;

  if (cell.getAttribute("data-bomb") === "true") {
    endGame(false);
  } else {
    revealCell(cell);
    checkWin();
  }
}

function revealCell(cell) {
  const id = parseInt(cell.getAttribute("data-id"));
  const adjacentBombs = countAdjacentBombs(id);
  cell.classList.add("revealed");
  if (adjacentBombs > 0) {
    cell.textContent = adjacentBombs;
  } else {
    revealAdjacentCells(id);
  }
}

function countAdjacentBombs(id) {
  const adjacentCells = getAdjacentCells(id);
  return adjacentCells.filter(
    (cell) => cell.getAttribute("data-bomb") === "true"
  ).length;
}

function revealAdjacentCells(id) {
  const adjacentCells = getAdjacentCells(id);
  adjacentCells.forEach((cell) => {
    if (!cell.classList.contains("revealed")) {
      revealCell(cell);
    }
  });
}

function getAdjacentCells(id) {
  const adjacent = [];
  const row = Math.floor(id / gridSize);
  const col = id % gridSize;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      if (
        newRow >= 0 &&
        newRow < gridSize &&
        newCol >= 0 &&
        newCol < gridSize
      ) {
        adjacent.push(cells[newRow * gridSize + newCol]);
      }
    }
  }
  return adjacent;
}

function toggleFlag(cell) {
  if (cell.classList.contains("flag")) {
    cell.classList.remove("flag");
  } else {
    cell.classList.add("flag");
  }
}

function checkWin() {
  const revealedCells = cells.filter((cell) =>
    cell.classList.contains("revealed")
  ).length;
  if (revealedCells === gridSize * gridSize - numMines) {
    endGame(true);
  }
}

function endGame(win) {
  gameEnded = true;
  cells.forEach((cell) => {
    if (cell.getAttribute("data-bomb") === "true") {
      cell.classList.add("bomb");
    }
  });
  setTimeout(() => {
    alert(win ? "You Win!" : "Game Over");
  }, 100);
}

createGrid();
