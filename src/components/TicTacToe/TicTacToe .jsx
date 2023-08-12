import "./TicTacToe.css";
import React, { useState, useEffect } from "react";

const apiURL = "https://hiring-react-assignment.vercel.app/api/bot";

const TicTacToe  = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [xWinCount, setXWinCount] = useState(0);
  const [oWinCount, setOWinCount] = useState(0);

  useEffect(() => {
    if (!isPlayerTurn) {
      computerMove();
    }
  }, [isPlayerTurn]);

  const handleSymbolSelect = (symbol) => {
    setPlayerSymbol(symbol);
    setIsPlayerTurn(symbol === "X");
  };

  const handleBoxClick = (index) => {
    if (isPlayerTurn && !board[index] && !winner) {
      const newBoard = [...board];
      newBoard[index] = playerSymbol;
      setBoard(newBoard);
      setIsPlayerTurn(false);
      checkWinner(newBoard, playerSymbol);
    }
  };

  const computerMove = async () => {
    const requestBody = [...board];
    const response = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain"
      },
      body: JSON.stringify(requestBody)
    });
    const data = await response.text(); 
    if (data !== null && !winner) {
      const moveIndex = parseInt(data, 10); 
      const newBoard = [...board];
      newBoard[moveIndex] = playerSymbol === "X" ? "O" : "X";
      setBoard(newBoard);
      setIsPlayerTurn(true);
      checkWinner(newBoard, newBoard[moveIndex]);
    }
  };

  const checkWinner = (currentBoard, symbol) => {
    const winCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let combo of winCombos) {
      const [a, b, c] = combo;
      if (
        currentBoard[a] === symbol &&
        currentBoard[b] === symbol &&
        currentBoard[c] === symbol
      ) {
        setWinner(symbol);
        if (symbol === "X") {
          setXWinCount(xWinCount + 1);
        } else if (symbol === "O") {
          setOWinCount(oWinCount + 1);
        }
        break;
      }
    }
  };
  const renderBoxes = () => {
    return board.map((value, index) => (
      <div
        key={index}
        className={`box ${value}`}
        onClick={() => playerSymbol && handleBoxClick(index)}
      >
        {value}
      </div>
    ));
  };

  const handleReset = async () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(playerSymbol === 'X' ? 'X':"O");
    
    if (playerSymbol === 'O') {
      await computerMove(); 
    }
  };
  return (
    <div className="app">
      {!playerSymbol ? (
        <div className="symbol-selection">
        <h1 className="symbol-title">Select Your Symbol</h1>
          <button className="select-btn" onClick={() => handleSymbolSelect("X")}>Select X</button>
          <button className="select-btn" onClick={() => handleSymbolSelect("O")}>Select O</button>
        </div>
      ) : (
        <>
          <h2 className="player">{`Player: ${playerSymbol}`}</h2>
          <div className="board">{renderBoxes()}</div>
          {winner && <h2>{`Winner: ${winner}`}</h2>}
          <div>
            {`X Wins: ${xWinCount}`} <br />
            {`O Wins: ${oWinCount}`}
          </div>
          <button className="reset-btn" onClick={handleReset}>Reset</button>
        </>
      )}
    </div>
  );
}
export default TicTacToe;
