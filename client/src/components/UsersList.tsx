import { useAtom, useSetAtom } from "jotai";
import { usernameAtom, usersAtom } from "../atoms";
import { Box, Button, chakra, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import socket from "../socket";

function LogoutButton() {
  const navigate = useNavigate();
  const setUsername = useSetAtom(usernameAtom);

  const handleLogOut = () => {
    localStorage.setItem("sessionID", "");

    // localStorage.removeItem("sessionID");
    // The above solution (removeItem) should work, I don't know why it isn't :*(

    setUsername("");
    navigate("/select-username");
  };

  return <Button onClick={handleLogOut}>Log out</Button>;
}

function UsersList() {
  const [users, setUsers] = useAtom(usersAtom);
  // const setRecipient = useSetAtom(recipientAtom);
  // const navigate = useNavigate();

  // const selectUser = (username: string) => {
  //   setRecipient(username);
  //   navigate("/private");
  // };

  useEffect(() => {
    socket.on("users", (updatedUsers) => {
      setUsers(updatedUsers);
    });

    // Clean up the event listener when the component is unmounted
    return () => {
      socket.off("users");
    };
  }, []);

  return (
    <Box>
      <Flex justifyContent="flex-end" marginTop={4}>
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
              // onClick={() => selectUser(user.username)}
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
