import { Message } from "./MessagesList";

function PrivateMessagesList({ messages }: { messages: Message[] }) {
    return (
      <div>
        Private messages
        <ul style={{ listStyle: "none" }}>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.author} (Private)</strong>: {msg.text}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  export default PrivateMessagesList;