const inputBox = document.querySelector('#playerinput');
const submitBtn = document.querySelector('.submitbtn');
const restart = document.querySelector('.restart');
const startBtn = document.querySelector('#startgame')
const guessDisplay = document.querySelector('.guess-display');
const disappear = document.querySelector('.disappear');
const circlesBox = document.querySelector('.circlesbox');
const digitNumber = document.querySelector('.digitnumber')
const errorMsg = document.querySelector('.errormsg');
const mainBox = document.querySelector('.main')
const guessBox = document.querySelector('.guessbox');
const resultsBox = document.querySelector('.resultsbox');
const sampleYes = document.querySelector('#sampleyes');
const sampleNo = document.querySelector('#sampleno');
const sampleCircles = document.querySelector('.samplecircles');

let difficultyLvl = "easy"; // Default difficulty is "easy"
let playerScore = 0; // Number of guesses (or player's score)
let gameNumber = 0; // The number the player has to try to guess
let error = false; // Error is set to false by default (only true when there's an error)
let guesses = []; // Will be array of all guesses
let unique = []; // Will be array of unique guesses

// Retart button restarts game
restart.addEventListener('click', restartGame); 
// Submit button runs "gamePlay", which runs a round of the game
submitBtn.addEventListener('click', gamePlay);

// Ensures that an array has only unique values
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

// Generates a random four-digit number (for Easy mode)
function generateNumber(difficulty) {
    let val = 0;
    if(difficulty === "easy") {
        val = Math.floor(1000 + Math.random() * 9000);
    } else if (difficulty === "hard") {
        val = Math.floor(Math.random() * 90000) + 10000;
    }
    return val;
}

// Starts the game and sets the difficulty conditions
function startGame() {
    if(difficultyLvl === "easy" || difficultyLvl === "insane") {
        inputBox.placeholder = "Ex: 9999";
        digitNumber.innerHTML = "4-digit";
        gameNumber = generateNumber("easy");
    } else if (difficultyLvl === "hard" || difficultyLvl === "impossible") {
        inputBox.placeholder = "Ex: 99999";
        digitNumber.innerHTML = "5-digit";
        gameNumber = generateNumber("hard");
    }

    if(disappear.style.display === 'flex') {
        disappear.style.display = 'none';
        startBtn.style.display = 'block';
    } else {
        disappear.style.display = 'flex';
        startBtn.style.display = 'none';
    }

    var ctx = sampleYes.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.arc(10, 10, 5, 0, 2 * Math.PI);
    ctx.fill();

    var ctx2 = sampleNo.getContext('2d');
    ctx2.beginPath();
    ctx2.fillStyle = "black";
    ctx2.arc(10, 10, 5, 0, 2 * Math.PI);
    ctx2.fill();

    if(difficultyLvl === "easy" || difficultyLvl === "hard") {
        sampleCircles.style.display = "flex";
    } else {
        sampleCircles.style.display = "none";
    }

    inputBox.focus();
}

// A round of the game
function gamePlay() {
    let userInput = inputBox.value;
    let gameNumberStr = String(gameNumber);
    let userArr = [];
    let displayArr = [];
    let gameArr = gameNumberStr.split('');
    userArr = userInput.split('');

    /* Error conditions & results. Error is generated if number is too big or too 
    short, or if user tries to enter something other than a number. */
    if(userInput.length > gameArr.length || userInput.length < gameArr.length || !userInput.match(/\d/ig)) {
        errorMsg.style.display = "block";
        errorMsg.classList.add('error');
        mainBox.classList.remove('regback');
        mainBox.classList.add('errorback');
        submitBtn.classList.add('btnbackerror');
        submitBtn.classList.remove('btnbackwin');
        restart.classList.add('btnbackerror');
        restart.classList.remove('btnbackwin');
        circlesBox.style.display = "none";
        guessBox.style.display = 'none';
        sampleCircles.style.display = 'none';
        errorMsg.innerHTML = `<strong>ERROR</strong>: Please enter a valid ${digitNumber.innerHTML} number.`;
        error = true;
    } else {
        mainBox.classList.remove('errorback');
        mainBox.classList.add('regback');
        submitBtn.classList.remove('btnbackerror');
        restart.classList.remove('btnbackerror');
        errorMsg.style.display = "none";
        circlesBox.style.display = "flex";
        sampleCircles.style.display = 'flex';
        guessBox.style.display = 'inline-block';
        guesses.push(userInput);
        error = false;
    }

    
    if(difficultyLvl === "easy" || difficultyLvl === "hard") {
        sampleCircles.style.display = "flex";
    } else {
        sampleCircles.style.display = "none";
    }

    
    // Puts only unique guess numbers into the "unique" array
    unique = [...new Set(guesses)];

    // "x" if a number is correct, "o" if a number is incorrect
    for(let i = 0; i < userArr.length; i++) {
        if(userArr[i] === gameArr[i]) {
            displayArr.push('x');
        } else {
            displayArr.push('o');
        }
    }

    // Sets player's score (aka number of guesses)
    playerScore = unique.length;
    guessDisplay.textContent = playerScore;

    // Generates the game progress display. For "insane", this is just how many numbers are correct w/ nothing about the positions being correct or incorrect.
    generateProgressDisplay(displayArr);

    // Game-ending conditions
    if(unique.length === 10) {
        if(userInput === String(gameNumber)) {
            endGame("winner");
        } else {
            endGame("loser");
        }
    } else if (userInput === String(gameNumber)) {
        endGame("winner");
    }
    
    /* Sets the input box's value to empty and puts focus back on it so the 
    player doesn't have to click on it every time */
    inputBox.value = "";
    inputBox.focus();

    /* For development purposes, logs the player's score and the "display array" 
    (the array containing "x" and "o" version of Mastermind circles) to the 
    console. */
    console.log(displayArr); 
    console.log(`Player score: ${playerScore}`);
}

// Generates the circles display.
function generateProgressDisplay(arr) {
    const rectBox = document.createElement('div');
    rectBox.classList.add('rect-box');
    if(error === false) {
        circlesBox.prepend(rectBox);
        if(difficultyLvl === "insane" || difficultyLvl === "impossible") {
            const newRect = document.createElement("div");
            newRect.classList.add('insane-rect');
            rectBox.appendChild(newRect);
            let correctNums = 0;
            for(let i = 0; i < arr.length; i++) {
                if(arr[i] === "x") {
                    correctNums += 1;
                }
            }
            newRect.innerHTML = `<strong>Correct</strong>: ${correctNums}`;
        } else {
            for(let i = 0; i < arr.length; i++) {
                const newRect = document.createElement('canvas');
                newRect.width = '20';
                newRect.height = '20';
                newRect.style.border = '1px solid black';  
                rectBox.appendChild(newRect); 
                var ctx = newRect.getContext('2d');
                ctx.beginPath();
                if(arr[i] === "x") {
                    ctx.fillStyle = "blue";
                } else if (arr[i] === "o") { 
                    ctx.fillStyle = "black";
                }
                ctx.arc(10, 10, 5, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }
    let userInput = inputBox.value;
    let userNum = document.createElement('span');
    userNum.textContent = userInput;
    userNum.classList.add('usernum');
    rectBox.append(userNum);
}

function generateInsaneDisplay() {
    const rectBox = document.createElement('div');
    let correctNums = 0;
    if(error === false) {
        circlesBox.prepend(rectBox);
        for(let i = 0; i < arr.length; i++) {
            if(arr[i] === "x") {
                correctNums += 1;
            }
        }
        rectBox.innerHTML = `<strong>Correct numbers</strong>: ${correctNums}`;
    }
    let userInput = inputBox.value;
    let userNum = document.createElement('span');
    userNum.textContent = userInput;
    userNum.classList.add('usernum');
    rectBox.append(userNum);
}

// Ends the game (both win and lose).
function endGame(status) {
    inputBox.disabled = true;
    const endWords = document.createElement('p');
    endWords.classList.add('endwords');
    if(status === "winner") {
        endWords.textContent = `You did it - you guessed the number ${gameNumber}! Congratulations, you win!`;
        endWords.classList.add('green');
        mainBox.classList.remove('regback', 'errorback');
        mainBox.classList.add('winback');
        submitBtn.classList.remove('btnbackerror');
        submitBtn.classList.add('btnbackwin');
        restart.classList.remove('btnbackerror');
        restart.classList.add('btnbackwin');
    } else {
        endWords.textContent = `The number was ${gameNumber}, but you couldn't guess it within 10 tries. Game over!`;
        endWords.classList.add('error');
        mainBox.classList.remove('regback', 'winback');
        mainBox.classList.add('errorback');
        submitBtn.classList.add('btnbackerror');
        restart.classList.add('btnbackerror');
    }

    resultsBox.prepend(endWords);
}

// Function for the popup modal window, which allows player to select difficulty.
$(function() {
    $("#dialog").dialog({
        show: true,
        buttons: [
            {
                text: "Easy Mode",
                click: function() {
                    $( this ).dialog( "close" );
                    difficultyLvl = "easy";
                    startGame();
                }
            },
            {
                text: "Hard Mode",
                click: function() {
                    $( this ).dialog( "close" );
                    difficultyLvl = "hard";
                    startGame();
                }
            },
            {
                text: "Insane Mode",
                click: function() {
                    $( this ).dialog( "close" );
                    difficultyLvl = "insane";
                    startGame();
                }
            },
            {
                text: "Impossible Mode",
                click: function() {
                    $( this ).dialog( "close" );
                    difficultyLvl = "impossible";
                    startGame();
                }
            }
        ],
        modal: true,
        autoOpen: false,
        open: function() {
            $(".ui-dialog-titlebar-close").hide();
        },
        dialogClass: "no-close",
        resizable: false,
        title: "Choose Difficulty",
    });

    $("#startgame").click(function () {
        $('#dialog').dialog('open');
    });
});

// Restarts game.
function restartGame() {
    // If the input box is disabled (aka if the game is over anyway), restart immediately.
    if(inputBox.disabled === true) {
        window.location.reload();
    /* Otherwise, confirmation box pops up asking if the player is sure they want to start over. Must confirm to restart. */
    } else {
        if(confirm("The game isn't over! Are you sure you want to start over?")) {
            window.location.reload();
        }

    }
}

// Keyboard shortcut: When in input box, Enter = Submit
inputBox.addEventListener('keydown', function(e) {
    if(e.key === 'Enter') {
        submitBtn.click();
    }
})

document.addEventListener('keydown', function(e) {
    // Keyboard shortcut: Shift + R = Restart
    if(e.shiftKey && e.key === "R") {
        restartGame();
    }

    // Keyboard shortcut: Shift + S = Start Game
    if(e.shiftKey && e.key === "S") {
        startBtn.click();
    }
})