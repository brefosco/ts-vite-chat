import { Box, Flex, Text, chakra } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import { privateMessagesAtom, recipientAtom } from "../atoms";
import type { PrivateMessage } from "../types";
import { useEffect, useRef } from "react";

function PrivateMessage({
  index,
  messagesLength,
  msg,
  username,
}: {
  index: number;
  messagesLength: number;
  msg: PrivateMessage;
  username: string;
}) {
  const messageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (index === messagesLength - 1 && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [index, messagesLength]);

  return (
    <Flex
      ref={messageRef}
      key={index}
      justifyContent={msg.username === username ? "flex-end" : "flex-start"}
    >
      <Box bgColor="blue.300" borderRadius="md" p={2} my={1}>
        <Text fontWeight={300}>
          {msg.content} -{" "}
          <chakra.span fontSize="xs" fontWeight={200}>
            {/* {new Date(msg).toLocaleTimeString()} */}
          </chakra.span>
        </Text>
      </Box>
    </Flex>
  );
}

function PrivateMessagesList() {
  const recipient = useAtomValue(recipientAtom);
  const privateMessages = useAtomValue(privateMessagesAtom);
  const navigate = useNavigate();

  console.log(privateMessages);

  return (
    <Box flex="1" overflow="auto">
      <button
        onClick={() => {
          navigate("/general");
        }}
      >
        back
      </button>
      <Text fontWeight={800} fontSize="xl" textAlign="center">
        Chat with {recipient}
      </Text>
      <Box>
        {privateMessages.map((msg, index) => (
          <PrivateMessage
            index={index}
            messagesLength={privateMessages.length}
            msg={msg}
            username={msg.username ?? ""}
          />
        ))}
      </Box>
    </Box>
  );
}

export default PrivateMessagesList;
