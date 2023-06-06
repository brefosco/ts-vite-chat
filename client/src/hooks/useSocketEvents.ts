import { useEffect } from "react";
import {  useSetAtom } from "jotai";
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

const useSocketEvents = () => {
  const setUsers = useSetAtom(usersAtom);
  const setMessages = useSetAtom(messagesAtom);
  const setIsUsernameSelected = useSetAtom(
    isUsernameSelectedAtom
  );
  const setUsername = useSetAtom(usernameAtom);
  const setPrivateMessages = useSetAtom(privateMessagesAtom);

  const handleConnectError = (err: Error) => {
    console.log(`connect_error due to ${err.message}`);
  };

  const handleSession = ({ sessionID, userID, username }: SessionData) => {
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
    setPrivateMessages((privateMessages) => [...privateMessages, msg]);
  };

  const handleNewMessage = (msg: ChatMessage) => {
    setMessages((messages) => [...messages, msg]);
  };

  const getUsers = () => {
    socket.emit("users", (users: User[]) => {
      setUsers(users);
    });
  };

  useEffect(() => {
    getUsers();
    socket.on("users", (users: User[]) => {
      setUsers(users);
    });
    socket.on("private message", handleNewPrivateMessage);
    socket.on("chat_message", handleNewMessage);
    socket.on("chat messages", handleChatMessages);
    socket.on("connect_error", handleConnectError);
    socket.on("session", handleSession);

    return () => {
      socket.off("chat_message", handleNewMessage);
      socket.off("private message", handleNewPrivateMessage);
      socket.off("users");
      socket.off("connect_error");
      socket.off("session");
    };
  }, []);

  return { handleNewMessage, handleNewPrivateMessage, handleSession };
};

export default useSocketEvents;
