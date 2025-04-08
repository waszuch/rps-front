// src/App.tsx
import React, { useState } from 'react';
import RoomJoin from './components/RoomJoin';
import Game from './components/Game';

function App() {
  const [room, setRoom] = useState<string>('');
  const [joined, setJoined] = useState(false);

  const handleJoin = (roomId: string) => {
    setRoom(roomId);
    setJoined(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {!joined ? (
        <RoomJoin onJoin={handleJoin} />
      ) : (
        <Game room={room} />
      )}
    </div>
  );
}

export default App;
