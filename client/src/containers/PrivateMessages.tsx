import { Box } from "@chakra-ui/react";
import PrivateMessagesList from "../components/PrivateMessagesList";
import PrivateMessageForm from "../components/PrivateMessageForm";

function Messages() {
  return (
    <Box display="flex" flexDirection="column" h="100vh">
      <PrivateMessagesList />
      <PrivateMessageForm />
    </Box>
  );
}

export default Messages;
