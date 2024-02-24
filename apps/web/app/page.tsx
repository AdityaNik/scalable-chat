'use client';
import { useContext, useState } from 'react';
import { useSocket } from '../context/SocketProvider';
import classes from './page.module.css';

export default function page() {
  const { sendMessage, message } = useSocket();
  const [msg, setMsg] = useState('');

  const handleClick = () =>{
    console.log("Before sending: " + msg);
    sendMessage(msg);
  }

  return <div style={{padding: "20px"}}>
    <h1>Welcome to Scaleable-Chat App</h1>
    <div style={{paddingTop: "20px"}}>
      <div>
        <h2>All messeges will appear here..</h2>
        {message.map((ele) => (
          <li>{ele}</li>
        ))}
      </div>
      <div className={classes['utils-component']}>
        <input onChange={(e) => setMsg(e.target.value)} className={classes['chat-input']} type="text" placeholder="message"/>
        <button onClick={handleClick} className={classes['send-button']}>send</button>
      </div>
    </div>
  </div>
}