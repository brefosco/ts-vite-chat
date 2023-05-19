import { Box, Button, Text } from "@chakra-ui/react";
import { Link, Outlet } from "react-router-dom";

function ChatSelection() {
  return (
    <Box>
      <Text>Select type of chat</Text>
      <Link to="/general">
        <Button>General</Button>
      </Link>
      <Link to="/private">
        <Button>Private</Button>
      </Link>
      <Outlet />
    </Box>
  );
}

export default ChatSelection;
