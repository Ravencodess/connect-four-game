import loadBoard from "./initializeBoard.js";

export const gameBoard = (()=> {
    const board = [];
    const columns = 7;
    const rows = 6;   
    
    for (let i = 0; i < rows; i++){
        board[i] = [];
        for(let j = 0; j < columns; j++){
            board[i].push(cell())
        }
    }
    
    const dropToken = (column, token) =>{
        const filteredBoard = board.filter((rows) => rows[column].getValue() === "").map((row) => row[column]);

        if(!filteredBoard.length) return;
        const lowestRow = filteredBoard.length - 1
        board[lowestRow][column].addToken(token);
    }

    return {
        dropToken,
        board
    }
})()


function cell (){
    let value = "";
    
    const addToken = (token) => value = token;
    const getValue = () => value;

    return {
        getValue,
        addToken
    }
};


const Player = (token) =>{
    const getToken = () => token;
    return {
        getToken
    }
}
// initial board render

const gameController = (() =>{
    let isOver = false;
    const player1 = Player('red');
    const player2 = Player('yellow');
    const players = [player1, player2];
    const randomPlayer = Math.floor(Math.random() * players.length);
    let currentPlayer = players[randomPlayer].getToken();
    
    const playRound = (column) => {
        gameBoard.dropToken(column, currentPlayer);
        // check win
        if (checkWin()){
            displayController.setResultMessage(currentPlayer);
            isOver = true;
            return;
        };
        // check draw
        const checkEmptySpaces = gameBoard.board.map(rows => rows.filter(columns => columns.getValue() === "")).reduce((rows, columns) => rows.concat(columns))
        if(!checkEmptySpaces.length){
            displayController.setResultMessage("draw");
            isOver = true;
            return;
        }

        switchPlayer();
        displayController.setDisplayMessage(`${currentPlayer[0].toUpperCase() + currentPlayer.substr(1)}'s Turn`);
    }

    
    
    const switchPlayer = () => {
        currentPlayer = (currentPlayer === player1.getToken()) ? player2.getToken() : player1.getToken();
    }
    
    const checkWin = () => {
        // get gameboard
        const board = gameBoard.board
        let rows = 6;
        let columns = 7;

        //horizontal check
        for(let i = 0; i< rows; i++){
            for(let j = 0; j< columns - 3; j++){
                if(board[i][j].getValue() === currentPlayer && board[i][j+1].getValue() === currentPlayer && board[i][j+2].getValue() === currentPlayer && board[i][j+3].getValue() === currentPlayer){
                    return true;
                }
            }
        }

        //vertical check
        for(let i = 0; i < rows - 3; i++){
            for(let j = 0; j< columns; j++){
                if(board[i][j].getValue() === currentPlayer && board[i+1][j].getValue() === currentPlayer && board[i+2][j].getValue() === currentPlayer && board[i+3][j].getValue() === currentPlayer){
                    return true;
                }
            }
        }
        
        // diagonal check -- descending
        for(let i = 0; i < rows - 3; i++){
            for(let j = 0; j< columns - 3; j++){
                if(board[i][j].getValue() === currentPlayer && board[i+1][j+1].getValue() === currentPlayer && board[i+2][j+2].getValue() === currentPlayer && board[i+3][j+3].getValue() === currentPlayer){
                    return true;
                }
            }
        }

        // diagonal check -- ascending
        for(let i = rows - 3; i < rows; i++){
            for(let j = 0; j< columns - 3; j++){
                if(board[i][j].getValue() === currentPlayer && board[i-1][j+1].getValue() === currentPlayer && board[i-2][j+2].getValue() === currentPlayer && board[i-3][j+3].getValue() === currentPlayer){
                    return true;
                }
            }
        }
    }

    const getCurrentPlayer = () => currentPlayer;

    const getIsOver = () => isOver;
    
    return{
        playRound,
        getCurrentPlayer,
        getIsOver
    }
})();


const displayController = (() => {
    loadBoard();
    const boardCells = document.querySelectorAll('.cell');
    const allCells = document.querySelectorAll('button');
    const hoverCells = document.querySelectorAll(".hover-cell");
    const messageEl = document.querySelector(".message");
    const firstPlayer = gameController.getCurrentPlayer();
    
    document.addEventListener("DOMContentLoaded", ()=> {
        document.querySelectorAll('button').forEach(button => {
            button.classList.add(firstPlayer);
        });
        setDisplayMessage(`${firstPlayer[0].toUpperCase() + firstPlayer.substr(1)}'s Turn`);
    })

    
    boardCells.forEach(cells => cells.addEventListener('click', (e) => {
        if(e.target.classList.contains("played") || gameController.getIsOver()) return;   
        gameController.playRound(parseInt(e.target.dataset.index));
        toggleClass(gameController.getCurrentPlayer());
        updateScreen();
        removeBoardHover();
    }))
    
    
    const toggleClass = (currentPlayer) => {
        allCells.forEach(button => {
            button.classList.remove('red');
            button.classList.remove('yellow');
            if (currentPlayer === 'red'){
                button.classList.toggle('red');
            } else if (currentPlayer === 'yellow'){
                button.classList.toggle('yellow');
            }
        })
    }
    
    const updateScreen = () => {
        const board = gameBoard.board;     
        const boardContents = board.reduce((a,b) => a.concat(b));   

        boardCells.forEach((cells, index) => {
            if(boardContents[index].getValue() === 'red'){
                cells.classList.add("show-red");
                cells.classList.add("played");
            }else if(boardContents[index].getValue() === 'yellow'){
                cells.classList.add("show-yellow");
                cells.classList.add("played");
            }
        })
    }

    const handleHoverDiv = (() => {
        const column1 = document.querySelectorAll('[data-index="0"]');
        const column2 = document.querySelectorAll('[data-index="1"]');
        const column3 = document.querySelectorAll('[data-index="2"]');
        const column4 = document.querySelectorAll('[data-index="3"]');
        const column5 = document.querySelectorAll('[data-index="4"]');
        const column6 = document.querySelectorAll('[data-index="5"]');
        const column7 = document.querySelectorAll('[data-index="6"]');

        const columns = [column1, column2, column3, column4, column5, column6, column7];

        columns.forEach((column, index) => {
            column.forEach(cells =>{
                cells.addEventListener("mouseover", () =>{
                    if(cells.classList.contains("played")) return;
                    if(cells.classList.contains("yellow")){
                        hoverCells[index].classList.add("show-yellow");
                    } else if(cells.classList.contains("red")){
                        hoverCells[index].classList.add("show-red");
                    }
                })
                cells.addEventListener("mouseout", () =>{
                    hoverCells[index].classList.remove("show-yellow");
                    hoverCells[index].classList.remove("show-red");
                })
                cells.addEventListener("click", () =>{
                    if(cells.classList.contains("played") || gameController.getIsOver()) return;
                    hoverCells[index].classList.toggle("show-yellow");
                    hoverCells[index].classList.toggle("show-red");
                })
            })
    
        })
    })()

    const removeBoardHover = () => {
        boardCells.forEach(cells => {
            if(cells.classList.contains("played")){
                cells.classList.remove("red");
                cells.classList.remove("yellow");
            }
        })
    }
    
    const setResultMessage = (winner) => {
        if(winner === "draw"){
            setDisplayMessage("It's a Draw!⛔");
            return;
        }
        setDisplayMessage(`${winner[0].toUpperCase() + winner.substr(1)} wins!!💥`)
    }

    const setDisplayMessage = (message) => messageEl.textContent = message

    return {
        setDisplayMessage,
        setResultMessage
    }
    
})()


