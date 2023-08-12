import React, { useState, useEffect } from "react";
import './TicTacToe.css'

const apiURL = "https://hiring-react-assignment.vercel.app/api/bot";

const TicTacToe  = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [playerSymbol, setPlayerSymbol] = useState(null);
    const [winner, setWinner] = useState(null);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  
    useEffect(() => {
      if (!isPlayerTurn) {
        computerMove();
      }
    }, [isPlayerTurn]);
  
    const handleSymbolSelect = (symbol) => {
      setPlayerSymbol(symbol);
      setIsPlayerTurn(symbol === "X"); // Set isPlayerTurn to true for 'X', false for 'O'
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
      const data = await response.json();
      if (data !== null && !winner) {
        const newBoard = [...board];
        newBoard[data] = playerSymbol === "X" ? "O" : "X";
        setBoard(newBoard);
        setIsPlayerTurn(true);
        checkWinner(newBoard, newBoard[data]);
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
  
    return (
      <div className="app">
        {!playerSymbol ? (
          <div className="symbol-selection">
            <button onClick={() => handleSymbolSelect("X")}>Select X</button>
            <button onClick={() => handleSymbolSelect("O")}>Select O</button>
          </div>
        ) : (
          <>
            <h2>{`Player: ${playerSymbol}`}</h2>
            <div className="board">{renderBoxes()}</div>
            {winner && <h2>{`Winner: ${winner}`}</h2>}
          </>
        )}
      </div>
    );
  }
  

export default TicTacToe 
