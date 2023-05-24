import { Box, Button, Input, Text, chakra } from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";
import {
  privateMessageAtom,
  privateMessagesAtom,
  recipientAtom,
} from "../atoms";
import socket from "../socket";
import UsersList from "./UsersList";

function PrivateMessageForm() {
  const [privateMessage, setPrivateMessage] = useAtom(privateMessageAtom);
  const recipient = useAtomValue(recipientAtom);

  const handlePrivateMessageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPrivateMessage(e.target.value);
  };

  const handlePrivateMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    socket.emit(
      "private message",
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
        position="sticky"
        bottom={0}
        left={0}
        right={0}
        p={3}
        onSubmit={handlePrivateMessageSubmit}
        display="flex"
      >
        <Input
          type="text"
          bgColor="white"
          placeholder="Type your private message"
          value={privateMessage}
          onChange={handlePrivateMessageChange}
        />
        <Button colorScheme="telegram" type="submit">
          Send
        </Button>
      </chakra.form>
    </Box>
  );
}

function PrivateMessagesList() {
  const recipient = useAtomValue(recipientAtom);
  const privateMessages = useAtomValue(privateMessagesAtom);

  return (
    <Box display="flex">
      {/* set the display to flex and direction to column, and make sure it has full height */}
      <Box flex="1" overflow="auto">
        {/* this box will take all available space and have scrollbar if content is longer than available space */}
        {recipient.length > 0 ? (
          <Box>
            <Text fontWeight={800} fontSize="xl" textAlign="center">
              {recipient}
            </Text>
            <chakra.ul listStyleType="none">
              {privateMessages.map((msg, index) => (
                <li key={index}>{msg.content}</li>
              ))}
            </chakra.ul>
            <Box>
              {/* this box will be sticky on the bottom */}
              <PrivateMessageForm />
            </Box>
          </Box>
        ) : (
          <UsersList />
        )}
      </Box>
    </Box>
  );
}

export default PrivateMessagesList;

// Change the layout so it's similar to the other chat, but with the name of the receiver on top
