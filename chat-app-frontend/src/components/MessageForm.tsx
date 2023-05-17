function MessageForm({
  message,
  handleMessageSubmit,
  handleMessageChange,
}: any) {
  return (
    <form onSubmit={handleMessageSubmit}>
      <input
        type="text"
        placeholder="Type your message"
        minLength={3}
        required
        value={message}
        onChange={handleMessageChange}
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default MessageForm;