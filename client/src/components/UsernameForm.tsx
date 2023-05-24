import { Input, chakra, Button, Box } from "@chakra-ui/react";
import { useAtom, useSetAtom } from "jotai";
import { usernameAtom, isUsernameSelectedAtom } from "../atoms";
import socket from "../socket";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

function UsernameForm() {
  const [username, setUsername] = useAtom(usernameAtom);
  const setIsUsernameSelected = useSetAtom(isUsernameSelectedAtom);
  const inputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUsernameSelected(true);
    socket.connect();
    socket.emit("set_username", username);
    navigate("/general");
  };

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, []);

  return (
    <Box>
      <chakra.form onSubmit={handleUsernameSubmit} p={3}>
        <Input
          ref={inputRef}
          minLength={4}
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
    </Box>
  );
}

export default UsernameForm;
