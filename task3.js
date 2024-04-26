const crypto = require('crypto');
const readline = require('readline');

function generateSecretKey() {
  return crypto.randomBytes(32);
}

function selectRandomMove(moves) {
  return moves[Math.floor(Math.random() * moves.length)];
}


function findRoundWinner(playerMove, opponentMove, moves) {
  const totalMoves = moves.length;
  const half = Math.floor(totalMoves / 2);
  const playerIndex = moves.indexOf(playerMove);
  const opponentIndex = moves.indexOf(opponentMove);

  if ((playerIndex + half) % totalMoves === opponentIndex) {
    return 'Win';
  } else if ((opponentIndex + half) % totalMoves === playerIndex) {
    return 'Lose';
  } else {
    return 'Draw';
  }
}

function startGame(userMove, moves) {
  if (!moves.includes(userMove)) {
    console.log('Error: Invalid move. Please choose from the provided moves.');
    return;
  }

  const key = generateSecretKey();
  const computerMove = selectRandomMove(moves);

  console.log('Your move:', userMove);
  console.log('Computer move:', computerMove);
  console.log('Result:', findRoundWinner(userMove, computerMove, moves));
  console.log('HMAC key:', key.toString('hex'));
}

function initializeGame() {
  const moves = process.argv.slice(2);

  if (moves.length < 3 || moves.length % 2 === 0 || new Set(moves).size !== moves.length) {
    console.error('Error: Please provide an odd number >= 3 of non-repeating strings.');
    console.error('Example: node task3.js Rock Paper Scissors');
    process.exit(1);
  }

  console.log('HMAC:', generateSecretKey().toString('hex'));
  console.log('Available moves:');
  moves.forEach((move, index) => {
    console.log(`${index + 1} - ${move}`);
  });
  console.log('0 - exit');
  console.log('? - help');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter your move: ', (userMove) => {
    if (userMove === '0') {
      rl.close();
      process.exit(0);
    }

    startGame(moves[parseInt(userMove) - 1], moves);
    rl.close();
  });
}

if (require.main === module) {
  initializeGame();
}
