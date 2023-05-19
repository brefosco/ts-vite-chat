import { useAtomValue, useSetAtom } from "jotai";
import { recipientAtom, usersAtom } from "../atoms";
import { chakra } from "@chakra-ui/react";

function UsersList() {
  const users = useAtomValue(usersAtom);
  const setRecipient = useSetAtom(recipientAtom);

  const selectUser = (username: string) => {
    setRecipient(username);
  };

  return (
    <div>
      <h3>Connected users:</h3>
      <chakra.ul listStyleType="none">
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
    </div>
  );
}

export default UsersList;
