import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:3000');

function App() {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  console.log(messages)
  console.log(users)
  console.log(username)

  useEffect(() => {
    socket.on('users', (users: Record<string, string>) => {
      setUsers(users);
    });

    socket.on('chat message', (msg: string) => {
      setMessages((messages) => [...messages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    socket.emit('set_username', username);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    socket.emit('chat message', message);
    setMessage('');
  };

  return (
    <div>
      <form onSubmit={handleUsernameSubmit}>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={handleUsernameChange}
        />
        <button type="submit">Set Username</button>
      </form>
      <ul>
        {Object.values(users).map((user) => (
          <li key={user}>{user}</li>
        ))}
      </ul>
      <form onSubmit={handleMessageSubmit}>
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={handleMessageChange}
        />
        <button type="submit">Send</button>
      </form>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
