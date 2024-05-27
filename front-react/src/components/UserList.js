import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../services/userService';
import { Link } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await getUsers();
    setUsers(response.data);
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    fetchUsers();
  };

  return (
    <div>
      <h2>User List</h2>
      <Link to="/add">Add User</Link>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.name} - {user.email}
            <Link to={`/edit/${user._id}`}>Edit</Link>
            <button onClick={() => handleDelete(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
