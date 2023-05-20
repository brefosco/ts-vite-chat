import { Flex, Text } from "@chakra-ui/react";
import UsernameForm from "../components/UsernameForm";

function UsernameSelect() {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Text fontSize='2xl' fontWeight='light'>Hi! Welcome to my chat app</Text>
      <UsernameForm />
    </Flex>
  );
}

export default UsernameSelect;
