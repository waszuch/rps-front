// src/contexts/SocketContext.tsx
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface ISocketContext {
  socket: Socket | null;
}

// Tworzymy kontekst z początkową wartością null
export const SocketContext = createContext<ISocketContext>({ socket: null });

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Połącz się z backendem. Upewnij się, że adres i port są poprawne
    const newSocket = io('http://localhost:3001', {
      transports: ['websocket']
    });
    setSocket(newSocket);

    // Zamknij połączenie po odmontowaniu komponentu
    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
