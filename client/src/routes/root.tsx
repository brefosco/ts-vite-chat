import React, { useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Container } from "@chakra-ui/react";
import { useAtom, useSetAtom } from "jotai";
import {
  messagesAtom,
  privateMessagesAtom,
  usersAtom,
  usernameAtom,
  isUsernameSelectedAtom,
} from "../atoms";
import socket from "../socket";
import { ChatMessage, PrivateMessage, User } from "../types";

interface SessionData {
  sessionID: string;
  userID: string;
  username: string;
}

function Root() {
  const [username, setUsername] = useAtom(usernameAtom);
  const setUsers = useSetAtom(usersAtom);
  const setMessages = useSetAtom(messagesAtom);
  const [isUsernameSelected, setIsUsernameSelected] = useAtom(
    isUsernameSelectedAtom
  );
  const setPrivateMessages = useSetAtom(privateMessagesAtom);
  const navigate = useNavigate();

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

  const handleSession = ({ sessionID, userID, username }: SessionData) => {
    console.log("handling session");
    console.log(username);
    setIsUsernameSelected(true);
    username && setUsername(username);
    socket.auth = { sessionID };
    localStorage.setItem("sessionID", sessionID);
    socket.userID = userID;
  };

  const handleChatMessages = (msgs: ChatMessage[]) => {
    setMessages(msgs);
  };

  const handleNewPrivateMessage = (msg: PrivateMessage) => {
    console.log("new private msg");
    console.log(msg);

    setPrivateMessages((privateMessages) => [...privateMessages, msg]);
  };

  const handleNewMessage = (msg: ChatMessage) => {
    setMessages((messages) => [...messages, msg]);
  };

  const cleanUpSocketEvents = () => {
    socket.disconnect();
    socket.off("chat message", handleNewMessage);
    socket.off("private message", handleNewPrivateMessage);
    socket.off("users");
    socket.off("connect_error");
    socket.off("session");
  };

  useEffect(() => {
    loadSession();
    getUsers();
    registerSocketEvents();
    return cleanUpSocketEvents;
  }, []);

  useEffect(() => {
    // only run redirection when loading is done
    if (username && isUsernameSelected) {
      navigate("/general");
    } else {
      navigate("/select-username");
    }
  }, [navigate, isUsernameSelected]);

  return (
    <Container maxW="container.xl" bgColor="gray.300" h="100vh" w="100%">
      <Outlet />
    </Container>
  );
}

export default Root;
// TODO: Maybe add lerna
// Censor profanity
// Refresh chat every day
// Max messages
