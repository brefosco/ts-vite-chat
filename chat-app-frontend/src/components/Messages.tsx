import { Box, Text, Flex, chakra, Button, Input } from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";
import { messageAtom, messagesAtom, usernameAtom } from "../atoms";
import socket from "../socket";

export interface Message {
  from: string;
  content: string;
  username: string;
}

function Messages() {
  const [message, setMessage] = useAtom(messageAtom);
  const username = useAtomValue(usernameAtom);
  const messages = useAtomValue(messagesAtom);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("emitting " + message);
    socket.emit("chat message", message);
    setMessage("");
  };

  return (
    <Box width="100%">
      <Box>
        {messages.map((msg, index) => (
          <Flex
            key={index}
            justifyContent={
              msg.username === username ? "flex-end" : "flex-start"
            }
          >
            <Box>
              <Text display="inline" fontWeight={500}>
                {msg.username}:
              </Text>{" "}
              {msg.content}
            </Box>
          </Flex>
        ))}
      </Box>
      <Box>
        <chakra.form
          textAlign="center"
          onSubmit={handleMessageSubmit}
          display="flex"
          position="fixed"
          bottom={0}
          left={0}
          right={0}
          p={3}
        >
          <Input
            type="text"
            backgroundColor="white"
            placeholder="Type your message"
            minLength={1}
            required
            boxShadow="sm"
            value={message}
            onChange={handleMessageChange}
          />
          <Button colorScheme="telegram" type="submit">
            Send
          </Button>
        </chakra.form>
      </Box>
    </Box>
  );
}

export default Messages;
