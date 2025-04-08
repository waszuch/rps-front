// src/components/Game.tsx
import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../contexts/SocketContext';

interface GameProps {
  room: string;
}

interface ResultData {
  yourMove: string;
  opponentMove: string;
  result: string;
}

const Game: React.FC<GameProps> = ({ room }) => {
  const { socket } = useContext(SocketContext);
  const [playerMove, setPlayerMove] = useState('');
  const [opponentMove, setOpponentMove] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    if (!socket) return;

    // Nasłuchuj wyniku gry od serwera
    socket.on('result', (data: ResultData) => {
      setOpponentMove(data.opponentMove);
      setResult(data.result);
    });

    // Czyścimy nasłuch po odmontowaniu
    return () => {
      socket.off('result');
    };
  }, [socket]);

  const handleMove = (move: string) => {
    if (!socket) return;
    setPlayerMove(move);
    // Wyślij ruch (z informacją o pokoju)
    socket.emit('move', { roomId: room, move });
  };

  return (
    <div className="bg-white shadow-md rounded px-8 py-6 max-w-md w-full">
      <h2 className="text-xl font-bold mb-4 text-center">Rock-Paper-Scissors</h2>
      <p className="text-center mb-4">
        Pokój: <span className="font-semibold">{room}</span>
      </p>

      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={() => handleMove('rock')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Rock
        </button>
        <button
          onClick={() => handleMove('paper')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Paper
        </button>
        <button
          onClick={() => handleMove('scissors')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Scissors
        </button>
      </div>

      {playerMove && (
        <p className="text-center mb-2">
          Twój ruch: <span className="font-semibold">{playerMove}</span>
        </p>
      )}
      {opponentMove && (
        <p className="text-center mb-2">
          Ruch przeciwnika: <span className="font-semibold">{opponentMove}</span>
        </p>
      )}
      {result && (
        <p className="text-center font-bold">
          Wynik: <span className="uppercase">{result}</span>
        </p>
      )}
    </div>
  );
};

export default Game;
