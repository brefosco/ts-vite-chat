function UsernameForm({
  username,
  handleUsernameChange,
  handleUsernameSubmit,
}: any) {
  return (
    <form onSubmit={handleUsernameSubmit}>
      <input
        minLength={3}
        required
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={handleUsernameChange}
      />
      <button type="submit">Set Username</button>
    </form>
  );
}

export default UsernameForm;
