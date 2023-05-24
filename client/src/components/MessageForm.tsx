import { useEffect, useRef } from "react";
import { Box, chakra, Button, Input } from "@chakra-ui/react";
import { IoMdSend } from "react-icons/io";
import { useAtom } from "jotai";
import socket from "../socket";
import { messageAtom } from "../atoms";

function MessageForm() {
  const [message, setMessage] = useAtom(messageAtom);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("emitting " + message);
    socket.emit("chat message", message);
    setMessage("");
  };

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, []);

  return (
    <Box>
      <chakra.form
        textAlign="center"
        onSubmit={handleMessageSubmit}
        display="flex"
        py={3}
      >
        <Input
          ref={inputRef}
          type="text"
          backgroundColor="white"
          placeholder="Type your message"
          minLength={1}
          required
          boxShadow="sm"
          value={message}
          onChange={handleMessageChange}
          mr={1}
        />
        <Button colorScheme="telegram" type="submit">
          <IoMdSend />
        </Button>
      </chakra.form>
    </Box>
  );
}

export default MessageForm;
