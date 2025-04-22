import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';

const WaitingRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { socket } = useSocket();
  const [showCopied, setShowCopied] = useState(false);
  const navigate = useNavigate();

  const roomLink = `${window.location.origin}/waiting-room/${roomId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomLink).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  };

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit('joinRoom', roomId);

    socket.on('bothPlayersJoined', () => {
      navigate(`/game/${roomId}`);
    });

    return () => {
      socket.off('bothPlayersJoined');
    };
  }, [socket, roomId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="p-8 bg-card rounded-lg shadow-xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-card-foreground">Waiting for Opponent...</h2>

        <p className="mb-4 text-muted-foreground text-sm">Send this link to your friend:</p>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            value={roomLink}
            readOnly
            className="flex-1 p-2 border rounded-lg bg-card text-card-foreground"
          />
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-200"
          >
            {showCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <p className="text-muted-foreground text-sm animate-pulse">Waiting for second player to join...</p>
      </div>
    </div>
  );
};

export default WaitingRoom;
