import { gameBoard } from "./app.js";

export default function  loadBoard () {
    const boardDiv = document.getElementById('boardDiv');
    const hoverDiv = document.getElementById('hoverDiv');
    const statusDiv = document.getElementById('status');
        const board = gameBoard.board
        board.forEach(boardEl => boardEl.forEach((cells, index) => {
            const cellBtn = document.createElement('button');
            cellBtn.classList.add('cell')
            cellBtn.dataset.index = index;
            cellBtn.textContent = cells.getValue();
            boardDiv.appendChild(cellBtn)
        }))
        
        for (let i = 0; i < 7; i++){
            const hoverCell = document.createElement('button');
            hoverCell.classList.add('hover-cell');
            hoverCell.dataset.hover = i;
            hoverDiv.appendChild(hoverCell);
        }

        const message = document.createElement('h2');
        message.classList.add("message");
        statusDiv.appendChild(message)
};