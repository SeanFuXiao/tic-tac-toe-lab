let board;
let turn;
let winner;
let tie;
let bigBoardStatus;

const boards = document.querySelectorAll('.board');
const messageEl = document.getElementById('message');
const resetBtnEl = document.getElementById('reset');

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

document.addEventListener('DOMContentLoaded', init);

resetBtnEl.addEventListener('click', init);

boards.forEach(function(boardEl, boardIndex) {
  for (let i = 0; i < 9; i++) {
    const square = document.createElement('div');
    square.className = 'sqr';
    square.id = boardIndex + '-' + i;
    square.addEventListener('click', handleClick);
    boardEl.appendChild(square);
  }
});



function init() {
 
  board = [];
  for (let i = 0; i < 9; i++) {

    let smallBoard = [];
    for (let j = 0; j < 9; j++) {

      smallBoard.push(''); 
    }
    board.push(smallBoard);
  }

  bigBoardStatus = [];
  for (let i = 0; i < 9; i++) {
    bigBoardStatus.push(''); 
  }

  turn = 'player1';
  winner = false;
  tie = false;


  render();
}


function render() {
  updateBoard();
  updateMessage();
}

function updateBoard() {
  for (let boardIndex = 0; boardIndex < board.length; boardIndex++) {

    let smallBoard = board[boardIndex];
    for (let squareIndex = 0; squareIndex < smallBoard.length; squareIndex++) 
      {
      const square = document.getElementById(boardIndex + '-' + squareIndex);
      const mark = smallBoard[squareIndex];

      square.className = 'sqr'; 

      if (mark) {

        square.classList.add(mark);
      }
    }

    const boardEl = document.getElementById('board-' + boardIndex);
    
    if (bigBoardStatus[boardIndex] === 'player1') {
      boardEl.classList.add('won-by-player1');
      boardEl.querySelectorAll('.sqr').forEach(function(sqr) {
        sqr.style.visibility = 'hidden';
      });

    } else if (bigBoardStatus[boardIndex] === 'player2') {
      boardEl.classList.add('won-by-player2');
      boardEl.querySelectorAll('.sqr').forEach(function(sqr) {
        sqr.style.visibility = 'hidden';
      });

    } else {
      boardEl.classList.remove('won-by-player1', 'won-by-player2');
      boardEl.querySelectorAll('.sqr').forEach(function(sqr) {
        sqr.style.visibility = 'visible';
      });
    }
  }
}

function updateMessage() {
  if (winner) {
    messageEl.textContent = 'Player' + (turn === 'player1' ? 1 : 2) + ' Win !!!';
  } else if (tie) {
    messageEl.textContent = "Tie !!!";
  } else {
    messageEl.textContent = (turn === 'player1' ? "Player 1's" : "Player 2's") + ' Turn';
  }
}

function handleClick(evt) {

  const idParts = evt.target.id.split('-');

  const boardIndex = parseInt(idParts[0]);
  const squareIndex = parseInt(idParts[1]);

  const selectedBoard = board[boardIndex];

  const selectedSquare = selectedBoard[squareIndex];

  if (selectedSquare || bigBoardStatus[boardIndex] || winner) return;

  placePiece(boardIndex, squareIndex);
  
  if (!checkForSmallBoardWinner(boardIndex)) {

    if (checkForSmallBoardTie(boardIndex)) {

      resetSmallBoard(boardIndex); 

    }



  }
  
  checkForBigBoardWinner();
  checkForTie();

  switchPlayerTurn();

  render();
}

function placePiece(boardIndex, squareIndex) {
  var selectedBoard = board[boardIndex];

  selectedBoard[squareIndex] = turn;
  board[boardIndex] = selectedBoard;
}

function checkForSmallBoardWinner(boardIndex) {

  let smallBoardWon = false;

  const selectedBoard = board[boardIndex];

  winningCombos.forEach(function(combo) {
    const a = selectedBoard[combo[0]];


    
    const b = selectedBoard[combo[1]];
    const c = selectedBoard[combo[2]];

    if (a && a === b && a === c) {
      bigBoardStatus[boardIndex] = turn;
      smallBoardWon = true;
    }
  });





  return smallBoardWon;
}

function checkForSmallBoardTie(boardIndex) {

  const selectedBoard = board[boardIndex];
  return !selectedBoard.includes('') && !bigBoardStatus[boardIndex];

}

function resetSmallBoard(boardIndex) {
  board[boardIndex] = Array(9).fill('');

}

function checkForBigBoardWinner() {

  winningCombos.forEach(function(combo) {
    const a = bigBoardStatus[combo[0]];
    const b = bigBoardStatus[combo[1]];
    const c = bigBoardStatus[combo[2]];

    if (a && a === b && a === c) {
      winner = true;
    }
  });
}

function checkForTie() {
  if (!winner) {
    let allBoardsWon = true;
    for (let i = 0; i < bigBoardStatus.length; i++) {
      if (!bigBoardStatus[i]) {
        allBoardsWon = false;
        break;
      }
    }

    if (allBoardsWon) {
      tie = true;
    }
  }
}

function switchPlayerTurn() {

  if (!winner) {

    if (turn === 'player1') {
      turn = 'player2';

    } else {
      turn = 'player1';
    }
  }
}

