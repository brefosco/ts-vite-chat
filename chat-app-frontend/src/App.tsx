import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3000");

interface Message {
  author: string;
  text: string;
  timestamp: number;
}

function MessagesList({ messages }: { messages: Message[] }) {
  return (
    <ul style={{ listStyle: "none" }}>
      {messages.map((msg, index) => (
        <li key={index}>
          <strong>{msg.author}</strong>: {msg.text}{" "}
          {/* <em>{new Date(msg.timestamp).toLocaleString()}</em> */}
        </li>
      ))}
    </ul>
  );
}

function UsernameForm({
  username,
  handleUsernameChange,
  handleUsernameSubmit,
}: any) {
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
  );
}

function MessageForm({
  message,
  handleMessageSubmit,
  handleMessageChange,
}: any) {
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
  );
}

function UsersList({ users }: { users: Record<string, string> }) {
  return (
    <div>
      <h3>Connected users: </h3>

      <ul style={{ listStyle: "none" }}>
        {Object.values(users)?.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const [isUsernameSelected, setIsUsernameSelected] = useState<boolean>(false);

  const handleNewMessage = (msg: Message) => {
    setMessages((messages) => [...messages, msg]);
  };

  useEffect(() => {
    socket.on("users", (users: Record<string, string>) => {
      setUsers(users);
    });

    socket.on("chat message", handleNewMessage);

    return () => {
      if (socket.connected) socket.disconnect();
      socket.off("chat message", handleNewMessage);
    };
  }, []);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUsernameSelected(true);
    socket.emit("set_username", username);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    socket.emit("chat message", message);
    setMessage("");
  };

  return (
    <div>
      {isUsernameSelected ? (
        <div>
          Hello {username}
          <MessageForm
            message={message}
            handleMessageChange={handleMessageChange}
            handleMessageSubmit={handleMessageSubmit}
          />
          <MessagesList messages={messages} />
          <UsersList users={users} />
        </div>
      ) : (
        <div>
          <p>Please select a username</p>
          <UsernameForm
            username={username}
            handleUsernameChange={handleUsernameChange}
            handleUsernameSubmit={handleUsernameSubmit}
          />
        </div>
      )}
    </div>
  );
}

export default App;
