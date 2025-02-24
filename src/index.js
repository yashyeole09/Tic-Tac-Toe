import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Toaster, toast } from "react-hot-toast";
import "tailwindcss/tailwind.css";

const TicTacToe = () => {
    const [mode, setMode] = useState(null);
    const [playerXName, setPlayerXName] = useState("");
    const [playerOName, setPlayerOName] = useState("");
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState("X");
    const [winner, setWinner] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        if (mode === "computer" && currentPlayer === "O" && !winner) {
            setTimeout(computerMove, 500);
        }
    }, [currentPlayer, mode, winner]);

    const handleModeSelection = (selectedMode) => {
        setMode(selectedMode);
        setGameStarted(false);
        if (selectedMode === "computer") {
            setPlayerXName("You");
            setPlayerOName("Computer");
        } else {
            setPlayerXName("");
            setPlayerOName("");
        }
    };

    const startGameWithFriend = () => {
        if (!playerXName.trim() || !playerOName.trim()) {
            toast.error("Please enter both player names!");
            return;
        }
        setGameStarted(true);
    };

    const handleBoxClick = (index) => {
        if (board[index] || winner || (mode === "computer" && currentPlayer === "O")) {
            toast.error("Invalid move!");
            return;
        }

        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        setBoard(newBoard);
        checkGameState(newBoard, currentPlayer);
    };

    const computerMove = () => {
        let emptyIndexes = board.reduce((acc, val, index) => (!val ? [...acc, index] : acc), []);
        if (emptyIndexes.length === 0 || winner) return;

        let randomMove = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
        const newBoard = [...board];
        newBoard[randomMove] = "O";
        setBoard(newBoard);
        checkGameState(newBoard, "O");
    };

    const checkGameState = (newBoard, player) => {
        if (checkWinner(newBoard, player)) {
            setWinner(player);
            toast.success(`${player === "X" ? playerXName : playerOName} wins! 🎉`);
            return;
        }
        if (newBoard.every((box) => box)) {
            toast("It's a draw! 🤝");
            setWinner("Draw");
            return;
        }
        setCurrentPlayer(player === "X" ? "O" : "X");
    };

    const checkWinner = (board, player) => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winPatterns.some(pattern => pattern.every(index => board[index] === player));
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setCurrentPlayer("X");
        setWinner(null);
        toast("Game restarted!", { icon: "🔄" });
    };

    const exitToModeSelection = () => {
        setMode(null);
        setGameStarted(false);
        setBoard(Array(9).fill(null));
        setWinner(null);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <Toaster />
            <h1 className="text-3xl font-bold mb-4">Tic-Tac-Toe</h1>
            {!mode ? (
                <div className="space-x-4">
                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded-lg" onClick={() => handleModeSelection("friend")}>
                        Play with Friend
                    </button>
                    <button className="px-4 py-2 bg-green-500 hover:bg-green-700 rounded-lg" onClick={() => handleModeSelection("computer")}>
                        Play with Computer
                    </button>
                </div>
            ) : mode === "friend" && !gameStarted ? (
                <div className="flex flex-col items-center gap-4">
                    <input
                        className="px-3 py-2 text-black rounded"
                        type="text"
                        placeholder="Enter Player X Name"
                        value={playerXName}
                        onChange={(e) => setPlayerXName(e.target.value)}
                    />
                    <input
                        className="px-3 py-2 text-black rounded"
                        type="text"
                        placeholder="Enter Player O Name"
                        value={playerOName}
                        onChange={(e) => setPlayerOName(e.target.value)}
                    />
                    <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-700 rounded-lg" onClick={startGameWithFriend}>
                        Start Game
                    </button>
                    <button className="px-4 py-2 bg-red-500 hover:bg-red-700 rounded-lg" onClick={exitToModeSelection}>
                        Exit
                    </button>
                </div>
            ) : (
                <>
                    <h3 className="text-xl mb-3">Current Player: {winner ? "Game Over" : currentPlayer === "X" ? playerXName : playerOName}</h3>
                    <div className="grid grid-cols-3 gap-2 bg-gray-800 p-4 rounded-lg">
                        {board.map((box, index) => (
                            <div key={index} className="w-24 h-24 flex items-center justify-center text-3xl bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer" onClick={() => handleBoxClick(index)}>
                                {box}
                            </div>
                        ))}
                    </div>
                    {winner && <h2 className="text-2xl mt-4 font-bold">{winner === "Draw" ? "It's a Draw! 🤝" : `${winner === "X" ? playerXName : playerOName} Wins! 🏆`}</h2>}
                    <button className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-700 rounded-lg" onClick={resetGame}>
                        Restart
                    </button>
                    <button className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded-lg" onClick={exitToModeSelection}>
                        Exit
                    </button>
                </>
            )}
        </div>
    );
};

ReactDOM.render(<TicTacToe />, document.getElementById("root"));
