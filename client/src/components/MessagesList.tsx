import { Box, Flex, Text, chakra } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { messagesAtom, usernameAtom } from "../atoms";
import { useAtomValue } from "jotai";
import { ChatMessage } from "../types";

// Outside your components
const colors = ["purple", "green", "red", "blue"];
let colorIndex = 0;
const usernameColors: Record<string, string> = {};

function getColorForUsername(username: string): string {
  if (!usernameColors[username]) {
    usernameColors[username] = colors[colorIndex % colors.length];
    colorIndex++;
  }

  return usernameColors[username];
}

function Message({
  index,
  messagesLength,
  msg,
  username,
}: {
  index: number;
  messagesLength: number;
  msg: ChatMessage;
  username: string;
}) {
  const messageRef = useRef<HTMLDivElement | null>(null);
  const messageColor = getColorForUsername(msg.username);

  useEffect(() => {
    if (index === messagesLength - 1 && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [index, messagesLength]);

  return (
    <Flex
      ref={messageRef}
      key={index}
      justifyContent={msg.username === username ? "flex-end" : "flex-start"}
    >
      <Box bgColor="blue.300" borderRadius="md" p={2} my={1}>
        <Text fontWeight={600} color={messageColor}>
          {msg.username}
        </Text>
        <Text fontWeight={300}>
          {msg.content} -{" "}
          <chakra.span fontSize="xs" fontWeight={200}>
            {new Date(msg.timestamp).toLocaleTimeString()}
          </chakra.span>
        </Text>
      </Box>
    </Flex>
  );
}

function MessagesList() {
  const messages = useAtomValue(messagesAtom);
  const username = useAtomValue(usernameAtom);

  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Box flex="1" overflow="auto">
      {messages.map((msg, index) => (
        <Message
          key={`${index}`}
          index={index}
          messagesLength={messages.length}
          msg={msg}
          username={username}
        />
      ))}
    </Box>
  );
}

export default MessagesList;
