import { Box, Text } from "@chakra-ui/react";
import UsersList from "../components/UsersList";
import MessageForm from "../components/MessageForm";
import MessagesList from "../components/MessageList";

function Messages() {
  return (
    <Box display="flex" flexDirection="column" h="100vh">
      <Text fontSize="xl" textAlign="center">
        You are in the general room!
      </Text>
      <UsersList />
      <MessagesList />
      <MessageForm />
    </Box>
  );
}

export default Messages;
