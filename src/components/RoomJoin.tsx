// src/components/RoomJoin.tsx
import React, { useContext, useState } from 'react';
import { SocketContext } from '../contexts/SocketContext';

interface RoomJoinProps {
  onJoin: (roomId: string) => void;
}

const RoomJoin: React.FC<RoomJoinProps> = ({ onJoin }) => {
  const { socket } = useContext(SocketContext);
  const [roomId, setRoomId] = useState('');

  const handleJoinRoom = () => {
    if (!roomId.trim() || !socket) return;
    socket.emit('joinRoom', roomId.trim());
    onJoin(roomId.trim());
  };

  return (
    <div className="bg-white shadow-md rounded px-8 py-6 max-w-md w-full">
      <h2 className="text-xl font-bold mb-4 text-center">Dołącz do pokoju</h2>
      <input
        type="text"
        placeholder="Podaj ID pokoju"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none"
      />
      <button
        onClick={handleJoinRoom}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
      >
        Dołącz
      </button>
    </div>
  );
};

export default RoomJoin;
