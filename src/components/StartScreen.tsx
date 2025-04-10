import { useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';

const StartScreen = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();

  const handleStartGame = () => {
    if (!socket) return;

    socket.emit('createRoom');

    socket.on('roomCreated', ({ roomId }) => {
      navigate(`/waiting-room/${roomId}`);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Rock Paper Scissors</h1>

        <button
          onClick={handleStartGame}
          disabled={!socket}
          className="w-full px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition duration-200 transform hover:scale-105"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
