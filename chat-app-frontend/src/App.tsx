import React, { useState, useEffect } from "react";
import socket from "./socket";
import MessagesList, { Message } from "./components/MessagesList";
import UsersList from "./components/UsersList";
import MessageForm from "./components/MessageForm";
import PrivateMessageForm from "./components/PrivateMessageForm";
import PrivateMessagesList from "./components/PrivateMessagesList";
import UsernameForm from "./components/UsernameForm";

export interface User {
  userID: string;
  username: string;
  id: string;
  sessionID: string;
  connected: boolean;
}

function App() {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [privateMessage, setPrivateMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isUsernameSelected, setIsUsernameSelected] = useState<boolean>(false);
  const [privateMessages, setPrivateMessages] = useState<Message[]>([]);

  console.log("users");
  console.log(users);

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
      socket.auth = { sessionID };
      console.log("will perform socket.connect()");
      socket.connect();
    }

    socket.emit("users", (users: User[]) => {
      console.log('users from emit');
      console.log(users);
      setUsers(users);
    });

    socket.on("users", (users: User[]) => {
      setUsers(users);
    });
    socket.on("private message", handleNewPrivateMessage);
    socket.on("chat message", handleNewMessage);

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    socket.on("session", ({ sessionID, userID, username }) => {
      // Username should come from session if was already set
      username && setUsername(username);
      setIsUsernameSelected(true);
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
      // save the ID of the user
      socket.userID = userID;
    });

    return () => {
      console.log("unmounting component and disconnecting shit");
      socket.disconnect();
      // if (socket.connected) socket.disconnect();
      socket.off("chat message", handleNewMessage);
      socket.off("private message", handleNewPrivateMessage);
    };
  }, []);

  const handleNewPrivateMessage = (msg: Message) => {
    setPrivateMessages((privateMessages) => [...privateMessages, msg]);
  };

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipient(e.target.value);
  };

  const handlePrivateMessageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPrivateMessage(e.target.value);
  };

  const handlePrivateMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    socket.emit(
      "private message",
      { recipient, text: privateMessage },
      (error: any, acknowledgement: any) => {
        if (error) {
          console.error(error);
        } else {
          console.log(acknowledgement); // Log the acknowledgement message
          setPrivateMessage("");
        }
      }
    );
  };

  const handleNewMessage = (msg: Message) => {
    setMessages((messages) => [...messages, msg]);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUsernameSelected(true);
    socket.connect();
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
          <div style={{ display: "flex", height: "300px" }}>
            <MessagesList messages={messages} />
            <UsersList users={users} />
          </div>
          <hr />
          <div>
            <PrivateMessageForm
              recipient={recipient}
              message={privateMessage}
              handleRecipientChange={handleRecipientChange}
              handleMessageChange={handlePrivateMessageChange}
              handleMessageSubmit={handlePrivateMessageSubmit}
            />
            <PrivateMessagesList messages={privateMessages} />
          </div>
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

// TODO: Separate logic
// Solve issue with private messages not being shown on the author
