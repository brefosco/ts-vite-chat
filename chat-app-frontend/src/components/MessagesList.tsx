export interface Message {
  author: string;
  text: string;
  timestamp: number;
}

function MessagesList({ messages }: { messages: Message[] }) {
  return (
    <div>
      <h3>Messages:</h3>
      <ul style={{ listStyle: "none" }}>
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.author}</strong>: {msg.text}{" "}
            {/* <em>{new Date(msg.timestamp).toLocaleString()}</em> */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MessagesList;
