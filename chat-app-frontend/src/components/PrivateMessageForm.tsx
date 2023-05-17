function PrivateMessageForm({
  recipient,
  message,
  handleRecipientChange,
  handleMessageChange,
  handleMessageSubmit,
}: any) {
  return (
    <form onSubmit={handleMessageSubmit}>
      <h3>Private message</h3>
      <input
        type="text"
        placeholder="Recipient"
        value={recipient}
        onChange={handleRecipientChange}
      />
      <input
        type="text"
        placeholder="Type your private message"
        value={message}
        onChange={handleMessageChange}
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default PrivateMessageForm;
