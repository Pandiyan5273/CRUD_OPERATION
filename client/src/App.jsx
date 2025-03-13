import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [userData, setUserData] = useState({ _id: null, name: "", age: "", city: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/users");
      setUsers(res.data);
      setFilterUsers(res.data);
    } catch (error) {
      alert("Error fetching users! Please check your API connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleDelete = async (_id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:8000/users/${_id}`);
        getAllUsers();
      } catch (error) {
        alert("Error deleting user! Please try again.");
      }
    }
  };

  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText) ||
        user.city.toLowerCase().includes(searchText)
    );
    setFilterUsers(filteredUsers);
  };

  const handleAddRecord = () => {
    setUserData({ _id: null, name: "", age: "", city: "" });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleEditRecord = (user) => {
    setUserData(user);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (!userData.name || !userData.age || !userData.city) {
        alert("All fields are required!");
        return;
      }

      if (isEdit) {
        await axios.put(`http://localhost:8000/users/${userData._id}`, userData);
      } else {
        await axios.post("http://localhost:8000/users", userData);
      }

      getAllUsers();
      setIsModalOpen(false);
    } catch (error) {
      alert("Error submitting user! Please try again.");
    }
  };

  return (
    <div className="container">
      <h3>CRUD Operations in React</h3>
      <div className="input-search">
        <input type="search" placeholder="Search users..." onChange={handleSearchChange} />
        <button className="btn green" onClick={handleAddRecord}>
          Add User
        </button>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filterUsers.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>{user.city}</td>
                <td>
                  <button className="btn green" onClick={() => handleEditRecord(user)}>
                    Edit
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDelete(user._id)} className="btn red">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className="modal" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setIsModalOpen(false)}>
              &times;
            </span>
            <h3>{isEdit ? "Edit User" : "Add User"}</h3>
            <div className="input-group">
              <input type="text" name="name" placeholder="Name" value={userData.name} onChange={handleData} />
              <input type="number" name="age" placeholder="Age" value={userData.age} onChange={handleData} />
              <input type="text" name="city" placeholder="City" value={userData.city} onChange={handleData} />
              <button className="btn green" onClick={handleSubmit}>
                {isEdit ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}

export default App;
