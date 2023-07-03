import { Box, Button, Input, chakra } from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";
import { privateMessageAtom, recipientAtom } from "../atoms";
import socket from "../socket";
import { PRIVATE_MESSAGE } from "../../../constants";
import { IoMdSend } from "react-icons/io";
import { useRef } from "react";

function PrivateMessageForm() {
  const [privateMessage, setPrivateMessage] = useAtom(privateMessageAtom);
  const recipient = useAtomValue(recipientAtom);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleMessageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPrivateMessage(e.target.value);
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    socket.emit(
      PRIVATE_MESSAGE,
      { recipient, text: privateMessage },
      (error: any, acknowledgement: any) => {
        if (error) {
          console.error(error);
        } else {
          console.log(acknowledgement); // Log the acknowledgement message
          setPrivateMessage("");
        }
      }
    );
  };
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
          backgroundColor="white"
          color="black"
          placeholder="Type your message"
          minLength={1}
          required
          boxShadow="sm"
          value={privateMessage}
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

export default PrivateMessageForm;
