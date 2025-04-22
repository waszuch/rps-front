import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { toast, Toaster } from 'sonner';

interface ResultData {
  yourMove: string;
  opponentMove: string;
  result: string;
}

const Game: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [playerMove, setPlayerMove] = useState('');
  const [opponentMove, setOpponentMove] = useState('');
  const [result, setResult] = useState('');
  const [opponentHasMoved, setOpponentHasMoved] = useState(false);
  const [rematchRequested, setRematchRequested] = useState(false);
  const [rematchAccepted, setRematchAccepted] = useState(false);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.off('result');
    socket.off('opponentMoved');
    socket.off('rematchRequested');
    socket.off('rematchAccepted');
    socket.off('opponentLeft');

    socket.on('result', (data: ResultData) => {
      console.log('Received result:', data);
      setOpponentMove(data.opponentMove);
      setResult(data.result);
    });

    socket.on('opponentMoved', () => {
      console.log('Opponent moved');
      setOpponentHasMoved(true);
    });

    socket.on('rematchRequested', () => {
      console.log('Opponent requested rematch');
      setRematchRequested(true);
      toast.info('Przeciwnik chce rewanż');
    });

    socket.on('rematchAccepted', () => {
      console.log('Rematch accepted');
      setResult('');
      setOpponentMove('');
      setPlayerMove('');
      setOpponentHasMoved(false);
      setRematchRequested(false);
      setRematchAccepted(false);
      toast.success('Rozpoczynacie rewanż!');
    });

    socket.on('opponentLeft', () => {
      console.log('Opponent left');
      toast('Przeciwnik opuścił pokój', {
        action: {
          label: 'OK',
          onClick: () => navigate('/')
        }
      });
      
      // Automatically redirect after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    });

    return () => {
      socket.off('result');
      socket.off('opponentMoved');
      socket.off('rematchRequested');
      socket.off('rematchAccepted');
      socket.off('opponentLeft');
    };
  }, [socket, roomId, navigate]);

  const handleMove = (move: string) => {
    if (!socket || !roomId) return;
    console.log(`Sending move: ${move} in room: ${roomId}`);
    setPlayerMove(move);
    socket.emit('move', { roomId, move });
  };

  const handleRematch = () => {
    if (!socket || !roomId) return;
    
    if (!rematchRequested) {
      console.log(`Requesting rematch in room: ${roomId}`);
      socket.emit('requestRematch', { roomId });
      toast.info('Wysłano prośbę o rewanż');
    } else {
      console.log(`Accepting rematch in room: ${roomId}`);
      socket.emit('acceptRematch', { roomId });
      setRematchAccepted(true);
    }
  };

  if (!roomId) {
    return <div className="text-center text-destructive p-4">Błąd: Brak ID pokoju</div>;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Toaster position="top-center" richColors />
      <div className="bg-card shadow-2xl rounded-xl p-6 w-full max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-card-foreground">
          Rock-Paper-Scissors
        </h2>

        <div className="flex flex-col items-center space-y-6">
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => handleMove('rock')} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-200 text-lg font-semibold min-w-[120px]">Rock</button>
            <button onClick={() => handleMove('paper')} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-200 text-lg font-semibold min-w-[120px]">Paper</button>
            <button onClick={() => handleMove('scissors')} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-200 text-lg font-semibold min-w-[120px]">Scissors</button>
          </div>

          <div className="w-full max-w-md space-y-4">
            {playerMove && (
              <div className="bg-muted p-4 rounded-lg border border-border">
                <p className="text-center text-card-foreground">
                  Twój ruch: <span className="font-semibold text-primary">{playerMove}</span>
                </p>
              </div>
            )}

            <div className="bg-muted p-4 rounded-lg border border-border">
              <p className="text-center text-card-foreground">
                {opponentMove 
                  ? <>Ruch przeciwnika: <span className="font-semibold text-primary">{opponentMove}</span></>
                  : opponentHasMoved
                    ? <>Przeciwnik wybrał swój ruch.</>
                    : <>Oczekiwanie na wybór przeciwnika...</>}
              </p>
            </div>

            {result && (
              <div className="flex flex-col gap-4">
                <div className="bg-muted p-4 rounded-lg border border-border">
                  <p className="text-center font-bold text-lg text-card-foreground">
                    Wynik: <span className="uppercase text-primary">{result}</span>
                  </p>
                </div>

                {!rematchAccepted && (
                  <button
                    onClick={handleRematch}
                    className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition duration-200">
                    Rematch
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
