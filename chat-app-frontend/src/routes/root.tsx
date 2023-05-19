import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Container, Text } from "@chakra-ui/react";
import { useAtom, useSetAtom } from "jotai";
import {
  messagesAtom,
  privateMessagesAtom,
  usersAtom,
  usernameAtom,
  isUsernameSelectedAtom,
} from "../atoms";
import socket from "../socket";
import { Message } from "../components/Messages";
import { PrivateMessage, User } from "../types";

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
  }, [navigate, isUsernameSelected]); // include isLoading here

  const loadSession = () => {
    const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
    }
    // setIsLoading(false); // set loading to false once session is loaded
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
    setMessages((messages) => [...messages, msg]);
  };

  return (
    <Container maxW="2xl" bgColor="gray.300">
      <Text>
        Hello <strong>{username}</strong>!
      </Text>
      <hr />
      <Outlet />
    </Container>
  );
}

export default Root;
