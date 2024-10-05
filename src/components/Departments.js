import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Departments.css";

const API_BASE_URL = "http://localhost:5000";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
  });
  const [error, setError] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/departments`);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setError("Failed to fetch departments. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    setNewDepartment({ ...newDepartment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDepartment) {
        await axios.put(
          `${API_BASE_URL}/api/departments/${editingDepartment._id}`,
          newDepartment
        );
        setEditingDepartment(null);
      } else {
        await axios.post(`${API_BASE_URL}/api/departments`, newDepartment);
      }
      setNewDepartment({ name: "" });
      fetchDepartments();
    } catch (error) {
      console.error("Error adding/updating department:", error);
      setError("Failed to add/update department. Please try again.");
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setNewDepartment({ name: department.name });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/departments/${id}`);
        fetchDepartments();
      } catch (error) {
        setError("Failed to delete department. Please try again.");
      }
    }
  };

  return (
    <div className="departments">
      <h1>Departments Management</h1>
      {error && <p className="error">{error}</p>}
      <div id="fom">
        <form onSubmit={handleSubmit} className="add-department-form">
          <input
            type="text"
            name="name"
            value={newDepartment.name}
            onChange={handleInputChange}
            placeholder="Department Name"
            required
          />
          <button type="submit">
            {editingDepartment ? "Update" : "Add"} Department
          </button>
        </form>
      </div>
      <div id="tbl">
        <table className="department-table">
          <thead>
            <tr>
              <th>Department Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department._id}>
                <td>{department.name}</td>
                <td>
                  <button onClick={() => handleEdit(department)}>Edit</button>
                  <button onClick={() => handleDelete(department._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
