
document.addEventListener("DOMContentLoaded", function () {

    const gameBoard = document.getElementById("game-board");

    const numberOfRows = 6;
    const numberOfColumns = 5;

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

    createGameBoard();

    console.log("WordGuess board created successfully!");

});
