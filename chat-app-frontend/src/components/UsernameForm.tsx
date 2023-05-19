import { Input, chakra, Button } from "@chakra-ui/react";
import { useAtom, useSetAtom } from "jotai";
import { usernameAtom, isUsernameSelectedAtom } from "../atoms";
import socket from "../socket";
import { useNavigate } from "react-router-dom";

function UsernameForm() {
  const [username, setUsername] = useAtom(usernameAtom);
  const setIsUsernameSelected = useSetAtom(isUsernameSelectedAtom);

  const navigate = useNavigate();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUsernameSelected(true);
    socket.connect();
    socket.emit("set_username", username);
    
    // TODO: this will eventually get 
    navigate("/general");
  };

  return (
    <chakra.form onSubmit={handleUsernameSubmit} p={3}>
      <Input
        minLength={3}
        bgColor="white"
        required
        type="text"
        placeholder="Select your username"
        value={username}
        onChange={handleUsernameChange}
      />
      <Button w="100%" mt={2} colorScheme="facebook" type="submit">
        Enter
      </Button>
    </chakra.form>
  );
}

export default UsernameForm;
