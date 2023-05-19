import React, { useEffect, useState } from "react";
import { Box, Button, Container, chakra, Text } from "@chakra-ui/react";
import { useAtom, useSetAtom } from "jotai";
import {
  messagesAtom,
  privateMessagesAtom,
  usersAtom,
  usernameAtom,
  isUsernameSelectedAtom,
} from "./atoms";
import socket from "./socket";
import Messages, { Message } from "./components/Messages";
import UsernameForm from "./components/UsernameForm";
import PrivateMessages from "./components/PrivateMessages";
import { PrivateMessage, User } from "./types";

function App() {
  const [username, setUsername] = useAtom(usernameAtom);
  const setUsers = useSetAtom(usersAtom);
  const setMessages = useSetAtom(messagesAtom);
  const [isUsernameSelected, setIsUsernameSelected] = useAtom(
    isUsernameSelectedAtom
  );
  const setPrivateMessages = useSetAtom(privateMessagesAtom);
  const [chatType, setChatType] = useState<"not-set" | "private" | "general">(
    "not-set"
  );

  useEffect(() => {
    loadSession();
    getUsers();
    registerSocketEvents();
    return cleanUpSocketEvents;
  }, []);

  const loadSession = () => {
    const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
    }
  };

  const getUsers = () => {
    socket.emit("users", (users: User[]) => {
      setUsers(users);
    });
  };

  const registerSocketEvents = () => {
    socket.on("users", (users: User[]) => {
      setUsers(users);
    });
    socket.on("private message", handleNewPrivateMessage);
    socket.on("chat message", handleNewMessage);
    socket.on("chat messages", handleChatMessages);
    socket.on("connect_error", handleConnectError);
    socket.on("session", handleSession);
  };

  const handleConnectError = (err: Error) => {
    console.log(`connect_error due to ${err.message}`);
  };
  interface SessionData {
    sessionID: string;
    userID: string;
    username: string;
  }

  const handleSession = ({ sessionID, userID, username }: SessionData) => {
    username && setUsername(username);
    setIsUsernameSelected(true);
    socket.auth = { sessionID };
    localStorage.setItem("sessionID", sessionID);
    socket.userID = userID;
  };

  const cleanUpSocketEvents = () => {
    socket.disconnect();
    socket.off("chat message", handleNewMessage);
    socket.off("private message", handleNewPrivateMessage);
    socket.off("users");
    socket.off("connect_error");
    socket.off("session");
  };

  const handleChatMessages = (msgs: Message[]) => {
    setMessages(msgs);
  };

  const handleNewPrivateMessage = (msg: PrivateMessage) => {
    console.log("new private msg");
    console.log(msg);

    setPrivateMessages((privateMessages) => [...privateMessages, msg]);
  };

  const handleNewMessage = (msg: Message) => {
    console.log("new msg to add");
    console.log(msg);
    setMessages((messages) => [...messages, msg]);
  };

  function SelectChatType() {
    return (
      <Box>
        <Text>Select type of chat</Text>
        <Button
          onClick={() => {
            setChatType("general");
          }}
        >
          General
        </Button>
        <Button
          onClick={() => {
            setChatType("private");
          }}
        >
          Private
        </Button>
      </Box>
    );
  }

  return (
    // TODO: use ts-pattern match or some match to simplify this
    <Container bgColor="gray.300">
      <Text>
        Hello <strong>{username}</strong>!
      </Text>
      <hr />
      {isUsernameSelected ? (
        <chakra.div>
          {chatType === "not-set" ? (
            <SelectChatType />
          ) : (
            <Box>
              {chatType === "general" ? <Messages /> : <PrivateMessages />}
            </Box>
          )}
        </chakra.div>
      ) : (
        <UsernameForm />
      )}
    </Container>
  );
}

export default App;

// TODO: Separate logic
// REFACTOR INTO PAGES or CONTAINERS
// Add react router into it
