import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
}

export const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Only use localhost:3001 for consistent connection
    const SERVER_URL = 'https://rps-back.onrender.com';
    console.log(`Connecting to Socket.IO server at: ${SERVER_URL}`);
    
    const newSocket = io(SERVER_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    newSocket.on('connect', () => {
      console.log('Połączono z serwerem socket.io - ID:', newSocket.id);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Błąd połączenia z serwerem:', error);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Rozłączono z serwerem socket.io:', reason);
    });

    newSocket.on('reconnect', (attempt) => {
      console.log(`Ponowne połączenie - próba ${attempt}`);
    });

    setSocket(newSocket);

    return () => {
      console.log('Zamykanie połączenia socket.io');
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
