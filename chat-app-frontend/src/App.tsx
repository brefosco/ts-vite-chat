import React, { useEffect, useState } from "react";
import { Box, Button, Container, chakra, Text } from "@chakra-ui/react";
import socket from "./socket";
import Messages, { Message } from "./components/Messages";
import { useAtom, useSetAtom } from "jotai";
import {
  messagesAtom,
  privateMessagesAtom,
  usersAtom,
  usernameAtom,
  isUsernameSelectedAtom,
} from "./atoms";
// import PrivateMessageForm from "./components/PrivateMessageForm";
// import PrivateMessages from "./components/PrivateMessages";
import UsernameForm from "./components/UsernameForm";
import { PrivateMessage, User } from "./types";
import UsersList from "./components/UsersList";
import PrivateMessages from "./components/PrivateMessages";

function App() {
  const [username, setUsername] = useAtom(usernameAtom);
  const setUsers = useSetAtom(usersAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  // const [privateMessage, setPrivateMessage] = useAtom(privateMessageAtom);
  const [isUsernameSelected, setIsUsernameSelected] = useAtom(
    isUsernameSelectedAtom
  );
  const setPrivateMessages = useSetAtom(privateMessagesAtom);
  const [chatType, setChatType] = useState<"not-set" | "private" | "general">(
    "not-set"
  );

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
      socket.auth = { sessionID };
      console.log("will perform socket.connect()");
      socket.connect();
    }

    socket.emit("users", (users: User[]) => {
      console.log("users from emit");
      console.log(users);
      setUsers(users);
    });

    socket.on("users", (users: User[]) => {
      setUsers(users);
    });
    socket.on("private message", handleNewPrivateMessage);

    socket.on("chat message", handleNewMessage);

    socket.on("chat messages", handleChatMessages);

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
      console.log("setting the localStorage item yet again...");
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
      socket.off("users");
      socket.off("connect_error");
      socket.off("session");
    };
  }, []);

  const handleChatMessages = (msgs: Message[]) => {
    setMessages(msgs);
  };

  const handleNewPrivateMessage = (msg: PrivateMessage) => {
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
    <Container bgColor="gray.300" h="100vh">
      <Text>Hello {username}!</Text>

      {isUsernameSelected ? (
        <chakra.div>
          {chatType === "not-set" ? (
            <SelectChatType />
          ) : (
            <Box>
              {chatType === "general" ? (
                <Messages  />
              ) : (
                <PrivateMessages />
              )}
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
