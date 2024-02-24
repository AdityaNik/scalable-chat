'use client'
import React, { ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from 'socket.io-client'; 

interface SocketProviderProps {
    children?: ReactNode
}

interface SocketContextType {
    sendMessage: (msg: string) => any;
    message: string[]
}

const SocketContext = React.createContext<SocketContextType | null> (null);

export const useSocket = () => {
    const state = useContext(SocketContext);
    if(!state){
        throw new Error('state is undefined...');
    }

    return state;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({children}) => {
    const [socket, setSocket]  = useState<Socket>();
    const [message, setMessage] = useState<string[]>([]);
    
    const sendMessage: SocketContextType['sendMessage'] = useCallback((msg) => {
        if(socket){
            socket.emit('event:message', {message: msg});
        }
    }, [socket]);

    const onMessageReceived = useCallback((msg: string) => {
        const { message } = JSON.parse(msg) as {message: string};
        setMessage((prev) => [...prev, message]);
    }, []);

    useEffect(() => {
        const _socket = io('http://localhost:8000');
        _socket.on('message', onMessageReceived);
        setSocket(_socket);

        return () =>{
            _socket.disconnect();
            _socket.off('message', onMessageReceived);
            setSocket(undefined);
        }
    }, []);

    return (
        <SocketContext.Provider value={{sendMessage, message}}>
            {children}
        </SocketContext.Provider>
    )
}