import { Flex, Text, Box } from "@chakra-ui/react";
import UsersList from "../components/UsersList";
import MessageForm from "../components/MessageForm";
import MessagesList from "../components/MessagesList";
import Layout from "./Layout";
import ToggleMode from "../components/ToggleMode";

function Messages() {
  return (
    <Layout>
      <Flex justifyContent="space-between">
        <div></div>
        <Text fontSize="xl">You are in the general room!</Text>
        <Box>
          <ToggleMode />
        </Box>
      </Flex>
      <UsersList />
      <MessagesList />
      <MessageForm />
    </Layout>
  );
}

export default Messages;
