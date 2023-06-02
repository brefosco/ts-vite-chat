import { useState } from "react";
import { Input, chakra, Button, Box, Text } from "@chakra-ui/react";
import { useAtom, useSetAtom } from "jotai";
import { usernameAtom, isUsernameSelectedAtom } from "../atoms";
import socket from "../socket";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

function UsernameForm() {
  const [username, setUsername] = useAtom(usernameAtom);
  const setIsUsernameSelected = useSetAtom(isUsernameSelectedAtom);
  const inputRef = useRef<HTMLInputElement>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    socket.connect();

    socket.emit("set_username", trimmedUsername, (error?: string | null) => {
      console.log(usernameError);
      console.log(error);
      if (error) {
        console.log(`error ${error} why da FUCK`);
        setUsernameError(error);
      } else {
        console.log("entered else");
        setIsUsernameSelected(true);
        navigate("/general");
      }
    });
  };

  console.log(usernameError);

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
          color="black"
          required
          type="text"
          placeholder="Select your username"
          value={username}
          onChange={handleUsernameChange}
        />
        <Button w="100%" mt={2} colorScheme="facebook" type="submit">
          Enter
        </Button>
        {usernameError && <Text color="red.500">{usernameError}</Text>}
      </chakra.form>
    </Box>
  );
}

export default UsernameForm;
