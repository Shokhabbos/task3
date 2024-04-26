const crypto = require('crypto');
const readline = require('readline');
const Table = require('cli-table3');

function generateSecretKey() {
  return crypto.randomBytes(32);
}

function selectRandomMove(moves) {
  return moves[Math.floor(Math.random() * moves.length)];
}

function computeHMAC(key, message) {
  const hmac = crypto.createHmac('sha256', key);
  hmac.update(message);
  return hmac.digest('hex');
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

function initializeGame() {
  const moves = process.argv.slice(2);

  if (moves.length < 3 || moves.length % 2 === 0 || new Set(moves).size !== moves.length) {
    console.error('Error: Please provide an odd number >= 3 of non-repeating strings.');
    console.error('Example: node task3.js Rock Paper Scissors');
    process.exit(1);
  }

  const key = generateSecretKey();
  const hmac = computeHMAC(key, 'initialization');

  console.log('HMAC:', hmac);
  console.log('Available moves:', moves.join(', '));

  const helpTable = new Table();
  helpTable.push(['', ...moves]);
  for (const move of moves) {
    const row = [move];
    for (const opponentMove of moves) {
      row.push(findRoundWinner(move, opponentMove, moves));
    }
    helpTable.push(row);
  }
  console.log(helpTable.toString());

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter your move: ', (userMove) => {
    if (userMove === '0') {
      rl.close();
      process.exit(0);
    }

    startGame(userMove, moves, key);
    rl.close();
  });
}

function startGame(userMove, moves, key) {
  if (!moves.includes(userMove)) {
    console.log('Error: Invalid move. Please choose from the provided moves.');
    return;
  }

  const computerMove = selectRandomMove(moves);
  const hmac = computeHMAC(key, computerMove);

  console.log('Your move:', userMove);
  console.log('Computer move:', computerMove);
  console.log('Result:', findRoundWinner(userMove, computerMove, moves));

  console.log('HMAC Key:',  key.toString('hex'));
}

if (require.main === module) {
  initializeGame();
}
