import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Container } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { usernameAtom, isUsernameSelectedAtom } from "../atoms";
import { useColorModeValue } from "@chakra-ui/react";
import useSocketEvents from "../hooks/useSocketEvents";
import { loadSession } from "../utils";

function Root() {
  const username = useAtomValue(usernameAtom);
  const isUsernameSelected = useAtomValue(isUsernameSelectedAtom);
  const navigate = useNavigate();

  const bgColor = useColorModeValue("gray.300", "gray.800");

  useSocketEvents();

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    // only run redirection when loading is done
    if (username && isUsernameSelected) {
      navigate("/general");
    } else {
      navigate("/select-username");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, isUsernameSelected]);

  return (
    <Container maxW="container.xl" bgColor={bgColor} w="100%">
      <Outlet />
    </Container>
  );
}

export default Root;
// TODO:
// Unify MessageForm and PrivateMessageForm
// Hide select username button until socket is connected (or connect socket when a username is selected)
