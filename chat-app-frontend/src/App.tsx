import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:3000');

function MessagesList(messages: any) {
  console.log(messages)

  // const { messages } = messages
  return (
    <ul>
      {messages?.messages?.map((msg, index) => (
        <li key={index}>{msg}</li>
      ))}
    </ul>
  )
}

function UsernameForm({ username, handleUsernameChange, handleUsernameSubmit }: any) {
  return (
    <form onSubmit={handleUsernameSubmit}>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={handleUsernameChange}
      />
      <button type="submit">Set Username</button>
    </form>
  )
}


function MessageForm({ message, handleMessageSubmit, handleMessageChange }: any) {
  return (
    <form onSubmit={handleMessageSubmit}>
      <input
        type="text"
        placeholder="Type your message"
        value={message}
        onChange={handleMessageChange}
      />
      <button type="submit">Send</button>
    </form>
  )
}

function App() {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const [isUsernameSelected, setIsUsernameSelected] = useState<boolean>(false)


  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
      // Now you can start emitting events
    });

    socket.on('users', (users: Record<string, string>) => {
      setUsers(users);
    });

    socket.on('chat-message', (msg: string) => {
      console.log('socket msg')
      console.log(msg)
      setMessages((messages) => [...messages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [setMessages]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUsernameSelected(true)
    socket.emit('set_username', username);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // e.preventDefault()
    setMessage(e.target.value);
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handling submit')
    socket.emit('chat-message', message);
    setMessage('');
  };




  function UsersList(users: any) {
    console.log('users')
    console.log(users)

    return (
      <ul>
        {Object.values(users)?.map((user) => (
          <li key={user}>{user}</li>
        ))}
      </ul>)
  }
  console.log(messages)

  return (
    <div>
      <UsernameForm username={username} handleUsernameChange={handleUsernameChange} handleUsernameSubmit={handleUsernameSubmit} />
      {isUsernameSelected ? <div>
        Hello {username}
        <MessageForm message={message} handleMessageChange={handleMessageChange} handleMessageSubmit={handleMessageSubmit} />
        {/* <MessagesList messages={messages} /> */}

        {/* <UsersList users={users} /> */}
      </div>
        : <p>Please select a username</p>}
      {/* <ul>
        {Object.values(users).map((user) => (
          <li key={user}>{user}</li>
        ))}
      </ul>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul> */}
    </div>
  );
}

export default App;
