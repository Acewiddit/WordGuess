
document.addEventListener("DOMContentLoaded", function () {

    const gameBoard = document.getElementById("game-board");
    const message = document.getElementById("message");
    const restartButton = document.getElementById("restart-button");
    const keyboard = document.getElementById("keyboard");
    const instructionsButton =
        document.getElementById("instructions-button");
    const instructions =
        document.getElementById("instructions");

    const numberOfRows = 6;
    const numberOfColumns = 5;

    // Words that can be selected as answers
    const wordList = [
        "APPLE", "PLANT", "HOUSE", "TRAIN", "CHAIR",
        "BREAD", "LIGHT", "WATER", "GRAPE", "SMILE",
        "CLOUD", "BEACH", "STONE", "MUSIC", "DREAM",
        "GREEN", "BRAVE", "SWEET", "TABLE", "RIVER"
    ];

    // Accepted guesses for this prototype
    const validWords = new Set([
        ...wordList,
        "CRANE", "PLATE", "TRAIL", "PAINT", "HEART",
        "WORLD", "BRAIN", "SHARE", "LEARN", "POINT",
        "SOUND", "ROUND", "NIGHT", "SNAKE", "FRUIT",
        "SUGAR", "FIELD", "FLOOR", "CLOCK", "BRICK"
    ]);

    const keyboardLayout = [
        ["Q","W","E","R","T","Y","U","I","O","P"],
        ["A","S","D","F","G","H","J","K","L"],
        ["ENTER","Z","X","C","V","B","N","M","BACK"]
    ];

    let secretWord = "";
    let currentRow = 0;
    let currentGuess = "";
    let gameOver = false;

    const keyStatuses = {};

    function chooseRandomWord() {
        const randomIndex = Math.floor(
            Math.random() * wordList.length
        );
        return wordList[randomIndex];
    }

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

    function updateBoard() {
        for (let col = 0; col < numberOfColumns; col++) {
            const tile = document.getElementById(
                `tile-${currentRow}-${col}`
            );

            const letter = currentGuess[col] || "";
            tile.textContent = letter;
            tile.classList.toggle("filled", letter !== "");
        }
    }

    function addLetter(letter) {
        if (currentGuess.length < numberOfColumns) {
            currentGuess += letter.toUpperCase();
            updateBoard();
        }
    }

    function removeLetter() {
        if (currentGuess.length > 0) {
            currentGuess = currentGuess.slice(0, -1);
            updateBoard();
        }
    }

    function checkGuess(guess) {
        const result = Array(numberOfColumns).fill("absent");
        const remainingLetters = secretWord.split("");

        // First pass: correct positions
        for (let i = 0; i < numberOfColumns; i++) {
            if (guess[i] === secretWord[i]) {
                result[i] = "correct";
                remainingLetters[i] = null;
            }
        }

        // Second pass: wrong positions
        for (let i = 0; i < numberOfColumns; i++) {
            if (result[i] === "correct") continue;

            const index = remainingLetters.indexOf(guess[i]);

            if (index !== -1) {
                result[i] = "present";
                remainingLetters[index] = null;
            }
        }

        return result;
    }

    function displayFeedback(guess, result) {
        const descriptions = {
            correct: "correct position",
            present: "wrong position",
            absent: "not matched"
        };

        for (let col = 0; col < numberOfColumns; col++) {
            const tile = document.getElementById(
                `tile-${currentRow}-${col}`
            );

            tile.classList.remove("filled");
            tile.classList.add(result[col]);

            tile.setAttribute(
                "aria-label",
                `${guess[col]}: ${descriptions[result[col]]}`
            );
        }
    }

    function createKeyboard() {
        keyboard.innerHTML = "";

        keyboardLayout.forEach(row => {
            const keyboardRow = document.createElement("div");
            keyboardRow.classList.add("keyboard-row");

            row.forEach(letter => {
                const key = document.createElement("button");
                key.type = "button";
                key.classList.add("key");

                if (letter.length > 1) {
                    key.classList.add("wide");
                }

                key.textContent =
                    letter === "BACK" ? "⌫" : letter;

                key.dataset.key = letter;

                key.addEventListener("click", function () {
                    handleKey(letter);
                });

                keyboardRow.appendChild(key);
            });

            keyboard.appendChild(keyboardRow);
        });
    }

    function updateKeyboard(guess, result) {
        const priority = {
            absent: 1,
            present: 2,
            correct: 3
        };

        for (let i = 0; i < guess.length; i++) {
            const letter = guess[i];
            const newStatus = result[i];
            const previousStatus = keyStatuses[letter];

            if (!previousStatus ||
                priority[newStatus] > priority[previousStatus]) {
                keyStatuses[letter] = newStatus;
            }
        }

        Object.entries(keyStatuses).forEach(([letter, status]) => {
            const key = keyboard.querySelector(
                `[data-key="${letter}"]`
            );

            if (key) {
                key.classList.remove(
                    "correct", "present", "absent"
                );
                key.classList.add(status);
            }
        });
    }

    function submitGuess() {
        if (currentGuess.length !== numberOfColumns) {
            message.textContent =
                "Your guess must contain five letters!";
            return;
        }

        if (!validWords.has(currentGuess)) {
            message.textContent =
                "Word not recognised. Try another word!";
            return;
        }

        const guess = currentGuess;
        const result = checkGuess(guess);

        displayFeedback(guess, result);
        updateKeyboard(guess, result);

        if (guess === secretWord) {
            gameOver = true;
            message.textContent =
                `Congratulations! You guessed the word in ${currentRow + 1} attempts!`;
            return;
        }

        currentRow++;
        currentGuess = "";

        if (currentRow >= numberOfRows) {
            gameOver = true;
            message.textContent =
                `Game over! The correct word was ${secretWord}.`;
        } else {
            message.textContent =
                `Attempt ${currentRow + 1} of ${numberOfRows}. Keep guessing!`;
        }
    }

    function handleKey(key) {
        if (gameOver) return;

        if (key === "ENTER") {
            submitGuess();
        } else if (key === "BACK") {
            removeLetter();
        } else if (/^[A-Z]$/.test(key)) {
            addLetter(key);
        }
    }

    function restartGame() {
        secretWord = chooseRandomWord();
        currentRow = 0;
        currentGuess = "";
        gameOver = false;

        Object.keys(keyStatuses).forEach(key => {
            delete keyStatuses[key];
        });

        createGameBoard();
        createKeyboard();

        message.textContent =
            "New game started! Enter your first guess.";
    }

    document.addEventListener("keydown", function (event) {
        if (event.ctrlKey || event.altKey || event.metaKey) {
            return;
        }

        if (event.key === "Enter") {
            event.preventDefault();
            handleKey("ENTER");
        } else if (event.key === "Backspace") {
            event.preventDefault();
            handleKey("BACK");
        } else if (/^[a-zA-Z]$/.test(event.key)) {
            handleKey(event.key.toUpperCase());
        }
    });

    restartButton.addEventListener("click", restartGame);

    instructionsButton.addEventListener("click", function () {
        instructions.hidden = !instructions.hidden;
        instructionsButton.setAttribute(
            "aria-expanded",
            String(!instructions.hidden)
        );
    });

    instructionsButton.setAttribute("aria-expanded", "false");

    restartGame();

});
