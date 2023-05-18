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
    <div style={{ marginLeft: "100px" }}>
      <h3>Connected users: </h3>
      <ul style={{ listStyle: "none" }}>
        {users?.map((user, index) => (
          <chakra.li cursor='pointer' key={index} onClick={() => selectUser(user.username)}>
            {user.username}
          </chakra.li>
        ))}
      </ul>
    </div>
  );
}

export default UsersList;
