import { useEffect, useRef } from "react";
import {
  Box,
  chakra,
  Button,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { IoMdSend } from "react-icons/io";
import { useAtom } from "jotai";
import socket from "../socket";
import { messageAtom } from "../atoms";
import { CHAT_MESSAGE } from "../../../constants";

function MessageForm() {
  const [message, setMessage] = useAtom(messageAtom);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputBgColor = useColorModeValue("white", "black");
  const inputTextColor = useColorModeValue("black", "white");

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    socket.emit(CHAT_MESSAGE, message);
    setMessage("");
  };

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, []);

  return (
    <Box>
      <chakra.form
        role="form"
        textAlign="center"
        onSubmit={handleMessageSubmit}
        display="flex"
        py={3}
      >
        <Input
          ref={inputRef}
          type="text"
          backgroundColor={inputBgColor}
          color={inputTextColor}
          placeholder="Type your message"
          minLength={1}
          required
          boxShadow="sm"
          value={message}
          onChange={handleMessageChange}
          mr={1}
        />
        <Button colorScheme="telegram" type="submit" aria-label="Send">
          <IoMdSend />
        </Button>
      </chakra.form>
    </Box>
  );
}

export default MessageForm;
