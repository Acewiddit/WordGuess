
document.addEventListener("DOMContentLoaded", function () {

    const gameBoard = document.getElementById("game-board");
    const message = document.getElementById("message");
    const restartButton = document.getElementById("restart-button");

    const numberOfRows = 6;
    const numberOfColumns = 5;

    // List of possible hidden words
    const wordList = [
        "APPLE", "PLANT", "HOUSE", "TRAIN", "CHAIR",
        "BREAD", "LIGHT", "WATER", "GRAPE", "SMILE",
        "CLOUD", "BEACH", "STONE", "MUSIC", "DREAM",
        "GREEN", "BRAVE", "SWEET", "TABLE", "RIVER"
    ];

    let secretWord = "";
    let currentRow = 0;
    let currentGuess = "";
    let gameOver = false;

    // Choose a random hidden word
    function chooseRandomWord() {
        const randomIndex = Math.floor(
            Math.random() * wordList.length
        );

        return wordList[randomIndex];
    }

    // Create the game board
    function createGameBoard() {

        gameBoard.innerHTML = "";

        for (let row = 0; row < numberOfRows; row++) {

            const boardRow = document.createElement("div");
            boardRow.classList.add("board-row");

            for (let col = 0; col < numberOfColumns; col++) {

                const tile = document.createElement("div");
                tile.classList.add("tile");
                tile.id = `tile-${row}-${col}`;

                boardRow.appendChild(tile);
            }

            gameBoard.appendChild(boardRow);
        }
    }

    // Display the letters being typed
    function updateBoard() {

        for (let col = 0; col < numberOfColumns; col++) {

            const tile = document.getElementById(
                `tile-${currentRow}-${col}`
            );

            const letter = currentGuess[col] || "";

            tile.textContent = letter;

            if (letter !== "") {
                tile.classList.add("filled");
            } else {
                tile.classList.remove("filled");
            }
        }
    }

    // Add a letter
    function addLetter(letter) {

        if (currentGuess.length < numberOfColumns) {
            currentGuess += letter.toUpperCase();
            updateBoard();
        }
    }

    // Delete the last letter
    function removeLetter() {

        if (currentGuess.length > 0) {
            currentGuess = currentGuess.slice(0, -1);
            updateBoard();
        }
    }

    // Compare the guess against the hidden word
    function checkGuess(guess) {

        const result = Array(numberOfColumns).fill("absent");
        const remainingLetters = secretWord.split("");

        // First pass: identify correct positions
        for (let i = 0; i < numberOfColumns; i++) {

            if (guess[i] === secretWord[i]) {
                result[i] = "correct";
                remainingLetters[i] = null;
            }
        }

        // Second pass: identify letters in wrong positions
        for (let i = 0; i < numberOfColumns; i++) {

            if (result[i] === "correct") {
                continue;
            }

            const letterIndex = remainingLetters.indexOf(
                guess[i]
            );

            if (letterIndex !== -1) {
                result[i] = "present";
                remainingLetters[letterIndex] = null;
            }
        }

        return result;
    }

    // Apply colour feedback to the submitted row
    function displayFeedback(guess, result) {

        for (let col = 0; col < numberOfColumns; col++) {

            const tile = document.getElementById(
                `tile-${currentRow}-${col}`
            );

            tile.classList.remove("filled");
            tile.classList.add(result[col]);

            const descriptions = {
                correct: "correct position",
                present: "wrong position",
                absent: "not matched"
            };

            tile.setAttribute(
                "aria-label",
                `${guess[col]}: ${descriptions[result[col]]}`
            );
        }
    }

    // Submit the current guess
    function submitGuess() {

        if (currentGuess.length !== numberOfColumns) {
            message.textContent =
                "Your guess must contain five letters!";
            return;
        }

        const guess = currentGuess;
        const result = checkGuess(guess);

        displayFeedback(guess, result);

        // Check whether the player has won
        if (guess === secretWord) {
            gameOver = true;
            message.textContent =
                `Congratulations! You guessed the word in ${currentRow + 1} attempts!`;
            return;
        }

        currentRow++;
        currentGuess = "";

        // Check whether the player has lost
        if (currentRow >= numberOfRows) {
            gameOver = true;
            message.textContent =
                `Game over! The correct word was ${secretWord}.`;
        } else {
            message.textContent =
                `Attempt ${currentRow + 1} of ${numberOfRows}. Keep guessing!`;
        }
    }

    // Start a new game
    function restartGame() {

        secretWord = chooseRandomWord();
        currentRow = 0;
        currentGuess = "";
        gameOver = false;

        createGameBoard();

        message.textContent =
            "New game started! Enter your first guess.";

        console.log("New WordGuess game started.");
    }

    // Listen for keyboard input
    document.addEventListener("keydown", function (event) {

        if (gameOver) {
            return;
        }

        const key = event.key;

        if (/^[a-zA-Z]$/.test(key)) {
            addLetter(key);

        } else if (key === "Backspace") {
            event.preventDefault();
            removeLetter();

        } else if (key === "Enter") {
            event.preventDefault();
            submitGuess();
        }
    });

    // Restart button event
    restartButton.addEventListener("click", restartGame);

    // Initialise the game
    restartGame();

});
