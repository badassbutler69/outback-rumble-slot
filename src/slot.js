ECHO is on.
// Outback Rumble: Meth Heads vs. Kangaroos Slot Game

const readline = require('readline');

// Symbol definitions
const METH_HEAD = "🧑‍🦲"; // Meth head
const KANGAROO = "🦘";     // Kangaroo
const KOALA = "🐨";        // Wild
const CROC = "🐊";         // Scatter
const BEER = "🍺";
const SUNGLASSES = "🕶️";

const symbols = [METH_HEAD, KANGAROO, KOALA, CROC, BEER, SUNGLASSES];
const WILD = KOALA;
const SCATTER = CROC;

let balance = 100;
let highScore = 100;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Spin the reels
function spin() {
  let result = [];
  for (let i = 0; i < 3; i++) {
    const randIndex = Math.floor(Math.random() * symbols.length);
    result.push(symbols[randIndex]);
  }
  return result;
}

// Check for win (3 of a kind, wilds substitute)
function checkWin(result) {
  // If all symbols are the same OR all wilds OR wilds substitute for a match
  if (result.every((val) => val === result[0]) ||
      result.filter(sym => sym === WILD).length === 2) {
    return true;
  }
  return false;
}

// Count scatters for bonus trigger
function countScatters(result) {
  return result.filter(sym => sym === SCATTER).length;
}

// Bonus round: Pick a waterhole for a random prize
function bonusRound(callback) {
  console.log("\n🐊 Crocodile Chaos Bonus! Pick a waterhole (1, 2, or 3):");
  const prizes = [20, 50, 100];
  const brawl = Math.random() < 0.3; // 30% chance for a brawl
  rl.question("Your pick: ", (answer) => {
    const pick = parseInt(answer);
    if ([1,2,3].includes(pick)) {
      if (brawl) {
        const multiplier = [2, 5][Math.floor(Math.random()*2)];
        console.log(`\n💥 BRAWL! Meth Head fights Kangaroo! You win a x${multiplier} multiplier!`);
        const prize = prizes[pick-1] * multiplier;
        balance += prize;
        console.log(`You win ${prize} coins!`);
      } else {
        const prize = prizes[pick-1];
        balance += prize;
        console.log(`You win ${prize} coins!`);
      }
    } else {
      console.log("You fell in the mud! No bonus this time.");
    }
    callback();
  });
}

// Main game loop
function promptBet() {
  if (balance <= 0) {
    console.log("You're out of coins! Game over!");
    console.log(`Your highest balance was: ${highScore} coins`);
    rl.close();
    return;
  }
  rl.question('\nEnter your bet amount (or type "q" to quit): ', (answer) => {
    if (answer.toLowerCase() === 'q') {
      console.log(`Thanks for playing! Final balance: ${balance} coins`);
      console.log(`Your highest balance was: ${highScore} coins`);
      rl.close();
      return;
    }
    const bet = parseInt(answer);
    if (isNaN(bet) || bet <= 0) {
      console.log("Invalid bet amount. Please enter a positive number.");
      promptBet();
    } else if (bet > balance) {
      console.log("You don't have enough coins for that bet.");
      promptBet();
    } else {
      playRound(bet);
    }
  });
}

function playRound(betAmount) {
  balance -= betAmount;
  const result = spin();
  console.log(`\nSPIN: ${result.join(" | ")}`);

  // Check for scatters (crocodiles)
  const scatters = countScatters(result);
  if (scatters >= 2) {
    console.log(`🐊 Crocodile scatters! ${scatters} found!`);
    bonusRound(() => {
      if (balance > highScore) highScore = balance;
      console.log(`Balance: ${balance} coins`);
      promptBet();
    });
    return;
  }

  // Check for win (3 of a kind or wilds)
  if (checkWin(result)) {
    const win = betAmount * 5;
    balance += win;
    console.log(`🎉 WIN! You win ${win} coins! 🎉`);
  } else {
    console.log("Try again!");
  }

  if (balance > highScore) highScore = balance;
  console.log(`Balance: ${balance} coins`);
  promptBet();
}

// Start the game
console.log("Welcome to Outback Rumble: Meth Heads vs. Kangaroos!");
console.log(`You start with ${balance} coins.`);
promptBet();
