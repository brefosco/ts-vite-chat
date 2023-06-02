import { Box, Flex, Text, chakra } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { messagesAtom, usernameAtom } from "../atoms";
import { useAtomValue } from "jotai";

// function Message({
//   index,
//   lastMessageRef,
//   messagesLength,
//   msg,
// }: {
//   index: number;
//   lastMessageRef: HTMLDivElement | null;
//   messagesLength: number;
//   msg: any;
// }) {
//   return (
//     <Flex
//       ref={index === messagesLength - 1 ? lastMessageRef : null}
//       key={index}
//       justifyContent={msg.username === username ? "flex-end" : "flex-start"}
//     >
//       <Box bgColor="blue.300" borderRadius="md" p={2} my={1}>
//         <Text fontWeight={300}>{msg.username}</Text>
//         <Text fontWeight={400}>
//           {msg.content} -{" "}
//           <chakra.span fontSize="xs" fontWeight={200}>
//             {new Date(msg.timestamp).toLocaleTimeString()}
//           </chakra.span>
//         </Text>
//       </Box>
//     </Flex>
//   );
// }

function MessagesList() {
  const messages = useAtomValue(messagesAtom);
  const username = useAtomValue(usernameAtom);

  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Box flex="1" overflow="auto">
      {messages.map((msg, index) => (
        <Flex
          ref={index === messages.length - 1 ? lastMessageRef : null}
          key={index}
          justifyContent={msg.username === username ? "flex-end" : "flex-start"}
        >
          <Box bgColor="blue.300" borderRadius="md" p={2} my={1}>
            <Text fontWeight={300}>{msg.username}</Text>
            <Text fontWeight={400}>
              {msg.content} -{" "}
              <chakra.span fontSize="xs" fontWeight={200}>
                {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </chakra.span>
            </Text>
          </Box>
        </Flex>
      ))}
    </Box>
  );
}

export default MessagesList;
