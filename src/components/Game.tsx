import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';

interface ResultData {
  yourMove: string;
  opponentMove: string;
  result: string;
}

const Game: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { socket } = useSocket();
  const [playerMove, setPlayerMove] = useState('');
  const [opponentMove, setOpponentMove] = useState('');
  const [result, setResult] = useState('');
  const [opponentHasMoved, setOpponentHasMoved] = useState(false); // 💡 NOWOŚĆ

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.on('result', (data: ResultData) => {
      setOpponentMove(data.opponentMove);
      setResult(data.result);
    });

    // 💡 nasłuchuj ruchu przeciwnika
    socket.on('opponentMoved', () => {
      setOpponentHasMoved(true);
    });

    return () => {
      socket.off('result');
      socket.off('opponentMoved');
    };
  }, [socket, roomId]);

  const handleMove = (move: string) => {
    if (!socket || !roomId) return;
    setPlayerMove(move);
    socket.emit('move', { roomId, move });
  };

  if (!roomId) {
    return <div className="text-center text-red-500 p-4">Błąd: Brak ID pokoju</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-xl p-6 w-full max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
          Rock-Paper-Scissors
        </h2>

        <div className="flex flex-col items-center space-y-6">
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => handleMove('rock')} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 text-lg font-semibold min-w-[120px]">Rock</button>
            <button onClick={() => handleMove('paper')} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 text-lg font-semibold min-w-[120px]">Paper</button>
            <button onClick={() => handleMove('scissors')} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 text-lg font-semibold min-w-[120px]">Scissors</button>
          </div>

          <div className="w-full max-w-md space-y-4">
            {playerMove && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-center text-gray-700">
                  Twój ruch: <span className="font-semibold text-blue-600">{playerMove}</span>
                </p>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-center text-gray-700">
                {opponentMove || opponentHasMoved
                  ? <>Przeciwnik wybrał swój ruch.</>
                  : <>Oczekiwanie na wybór przeciwnika...</>}
              </p>
            </div>

            {result && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-center font-bold text-lg">
                  Wynik: <span className="uppercase text-blue-600">{result}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
