import { User } from "../App";

function UsersList({ users }: { users: User[] }) {
  return (
    <div style={{ marginLeft: "100px" }}>
      <h3>Connected users: </h3>
      <ul style={{ listStyle: "none" }}>
        {users?.map((user, index) => (
          <li key={index}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
}

export default UsersList;
