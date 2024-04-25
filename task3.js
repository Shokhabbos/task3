const crypto = require('crypto');
const readline = require('readline');

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

function showHelpTable(moves) {
  console.log('Help Table:');
  console.log('   ' + moves.join(' | '));
  console.log('---|' + '-'.repeat(moves.length * 3 - 1));
  for (const move of moves) {
    const row = [move];
    for (const opponentMove of moves) {
      const result = findRoundWinner(move, opponentMove, moves);
      row.push(result);
    }
    console.log(row.join(' | '));
  }
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
  const hmac = computeHMAC(key, computerMove);

  console.log('Computer\'s move:', computerMove);
  console.log('HMAC:', hmac);

  const result = findRoundWinner(userMove, computerMove, moves);
  console.log('Result:', result);
  console.log('Computer\'s Original Key:', key.toString('hex'));
}

function initializeGame() {
  const moves = process.argv.slice(2);

  if (moves.length < 3 || moves.length % 2 === 0 || new Set(moves).size !== moves.length) {
    console.error('Error: Please provide an odd number >= 3 of non-repeating strings.');
    console.error('Example: node task3.js Rock Paper Scissors');
    process.exit(1);
  }

  console.log('Welcome to the Generalized Rock-Paper-Scissors Game!');
  console.log('Available moves:', moves.join(', '));

  showHelpTable(moves);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter your move (type 0 to exit): ', (userMove) => {
    if (userMove === '0') {
      rl.close();
      process.exit(0);
    }

    startGame(userMove, moves);
    rl.close();
  });
}

if (require.main === module) {
  initializeGame();
}
