import { Flex, Text } from "@chakra-ui/react";
import UsernameForm from "../components/UsernameForm";
import Layout from "./Layout";
import ToggleMode from "../components/ToggleMode";

function UsernameSelect() {
  return (
    <>
      <Flex justifyContent="flex-end" mt={2}>
        <ToggleMode />
      </Flex>
      <Layout justifyContent="center" alignItems="center">
        <Text fontSize="2xl" fontWeight="light">
          Hi! Welcome to my chat app
        </Text>
        <UsernameForm />
      </Layout>
    </>
  );
}

export default UsernameSelect;
