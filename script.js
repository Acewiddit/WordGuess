
document.addEventListener("DOMContentLoaded", function () {

    const gameBoard = document.getElementById("game-board");
    const message = document.getElementById("message");

    const numberOfRows = 6;
    const numberOfColumns = 5;

    let currentRow = 0;
    let currentGuess = "";
    let gameOver = false;

    // Create the 6 x 5 game board
    function createGameBoard() {

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

    // Update the letters displayed on the current row
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

    // Add a letter to the current guess
    function addLetter(letter) {

        if (currentGuess.length < numberOfColumns) {

            currentGuess += letter.toUpperCase();
            updateBoard();
        }
    }

    // Remove the last entered letter
    function removeLetter() {

        if (currentGuess.length > 0) {

            currentGuess = currentGuess.slice(0, -1);
            updateBoard();
        }
    }

    // Submit the current guess
    function submitGuess() {

        if (currentGuess.length !== numberOfColumns) {

            message.textContent =
                "Your guess must contain five letters!";

            return;
        }

        message.textContent = "Guess submitted successfully!";

        currentRow++;
        currentGuess = "";

        if (currentRow >= numberOfRows) {

            gameOver = true;

            message.textContent =
                "You have used all six attempts!";
        }
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

    createGameBoard();

    console.log("WordGuess Prototype 2 loaded successfully!");

});
