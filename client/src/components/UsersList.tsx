import { useAtomValue, useSetAtom } from "jotai";
import { recipientAtom, usernameAtom, usersAtom } from "../atoms";
import { Box, Button, chakra, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();
  const setUsername = useSetAtom(usernameAtom);

  const handleLogOut = () => {
    localStorage.setItem("sessionID", "");

    // localStorage.removeItem("sessionID");
    // The above solution should work, I don't know why it isn't :*(

    setUsername("");
    navigate("/select-username");
  };

  return <Button onClick={handleLogOut}>Log out</Button>;
}

function UsersList() {
  const users = useAtomValue(usersAtom);
  const setRecipient = useSetAtom(recipientAtom);

  const selectUser = (username: string) => {
    setRecipient(username);
  };

  return (
    <Box>
      <Flex justifyContent="flex-end">
        <LogoutButton />
      </Flex>
      <Box>
        <Text size="lg">Connected users:</Text>
        <chakra.ul listStyleType="none" display="flex">
          {users?.map((user, index) => (
            <chakra.li
              cursor="pointer"
              key={index}
              bgColor="gray.400"
              onClick={() => selectUser(user.username)}
              borderRadius={4}
              p={2}
              m={1}
            >
              {user.username}
            </chakra.li>
          ))}
        </chakra.ul>
      </Box>
    </Box>
  );
}

export default UsersList;
