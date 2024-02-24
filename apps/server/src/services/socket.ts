import { Server } from 'socket.io';
import Redis from 'ioredis';

const pub = new Redis({
    host: 'redis-1284a989-adityanikam481-60c1.a.aivencloud.com',
    port: 14845,
    username: 'default',
    password: 'AVNS__ydUnHWwO8UE47agDXF'
});
const sub = new Redis({
    host: 'redis-1284a989-adityanikam481-60c1.a.aivencloud.com',
    port: 14845,
    username: 'default',
    password: 'AVNS__ydUnHWwO8UE47agDXF'
});

export class SocketService{
    private _io: Server;
    
    constructor(){
        this._io = new Server({
            cors: {
                allowedHeaders: ['*'],
                origin: '*',
            },
        });
        sub.subscribe('MESSAGES');
    }

    public initListeners(){
        const io = this._io;

        io.on("connect", (socket) => {
            console.log("New user connected.... with socket id: " + socket.id);
            socket.on('event:message', async ({message} : {message: string}) => {
                console.log("Messege Received: " + message);
                await pub.publish('MESSAGES', JSON.stringify({ message }));
            });
        });
        sub.on('message', (event, message) => {
            if(event === 'MESSAGES'){
                io.emit('message', message);
            }
        });
    }

    public get io() : Server {
        return this._io;
    }
}