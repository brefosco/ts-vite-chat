import { Box, Button, Input, Text, chakra } from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";
import {
  privateMessageAtom,
  privateMessagesAtom,
  recipientAtom,
} from "../atoms";
import socket from "../socket";
import UsersList from "./UsersList";

function PrivateMessagesList() {
  const [privateMessage, setPrivateMessage] = useAtom(privateMessageAtom);
  const [recipient, setRecipient] = useAtom(recipientAtom);
  const privateMessages = useAtomValue(privateMessagesAtom);

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipient(e.target.value);
  };

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
    <div>
      <UsersList />
      <hr />
      <Text>To: {recipient}</Text>
      <chakra.ul listStyleType="none">
        {privateMessages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.from}</strong>: {msg.content}
          </li>
        ))}
      </chakra.ul>
      <Box>
        <form onSubmit={handlePrivateMessageSubmit}>
          <Input
            type="text"
            placeholder="Type your private message"
            value={privateMessage}
            onChange={handlePrivateMessageChange}
          />
          <Button colorScheme="telegram" type="submit">
            Send
          </Button>
        </form>
      </Box>
    </div>
  );
}

export default PrivateMessagesList;

// TODO: Add functionality to first click on the user to message, then open the chat.
// Change the layout so it's similar to the other chat, but with the name of the receiver on top
