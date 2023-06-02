import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Container } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { usernameAtom, isUsernameSelectedAtom } from "../atoms";
import { LightMode } from "@chakra-ui/react";
import socket from "../socket";
import useSocketEvents from "../hooks/useSocketEvents";

function Root() {
  const username = useAtomValue(usernameAtom);
  const isUsernameSelected = useAtomValue(isUsernameSelectedAtom);
  const navigate = useNavigate();

  useSocketEvents();

  const loadSession = () => {
    const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
    }
  };

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
    <Container maxW="container.xl" bgColor="gray.300" w="100%">
      <LightMode>
        <Outlet />
      </LightMode>
    </Container>
  );
}

export default Root;
// TODO: Censor profanity
// Refresh chat every day
// Max messages
