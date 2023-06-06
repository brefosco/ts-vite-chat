import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Container } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { usernameAtom, isUsernameSelectedAtom } from "../atoms";
import { LightMode } from "@chakra-ui/react";
import useSocketEvents from "../hooks/useSocketEvents";
import { loadSession } from "../utils";

function Root() {
  const username = useAtomValue(usernameAtom);
  const isUsernameSelected = useAtomValue(isUsernameSelectedAtom);
  const navigate = useNavigate();

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
// Unify casing (chat message, set_username)
// Hide select username button until socket is connected (or connect socket when a username is selected)
// Update when a user connects or disconnects (currently it doesnt update them)
// Random color for users in permanent room
