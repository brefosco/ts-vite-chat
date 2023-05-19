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
    <Box display="flex" flexDirection="column" h="95vh">
      <Box flex="1" overflow="auto">
        {messages.map((msg, index) => (
          <Flex
            key={index}
            justifyContent={
              msg.username === username ? "flex-end" : "flex-start"
            }
          >
            <Box bgColor="blue.300" borderRadius="md" p={2} my={1}>
              <Text fontWeight={300}>{msg.username}</Text>
              <Text fontWeight={400}>{msg.content}</Text>
            </Box>
          </Flex>
        ))}
      </Box>
      <Box>
        <chakra.form
          textAlign="center"
          onSubmit={handleMessageSubmit}
          display="flex"
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
