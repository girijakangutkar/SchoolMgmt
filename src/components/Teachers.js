import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Teachers.css";

const API_BASE_URL = "http://localhost:5000";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    department: "",
    isHOD: false,
    phoneNumber: "",
  });
  const [error, setError] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);

  useEffect(() => {
    fetchTeachers();
    fetchDepartments();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/teachers`);
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setError("Failed to fetch teachers. Please try again.");
    }
  };

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
    const { name, value, type, checked } = e.target;
    setNewTeacher({
      ...newTeacher,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        await axios.put(
          `${API_BASE_URL}/api/teachers/${editingTeacher._id}`,
          newTeacher
        );
        setEditingTeacher(null);
      } else {
        await axios.post(`${API_BASE_URL}/api/teachers`, newTeacher);
      }
      setNewTeacher({
        name: "",
        email: "",
        department: "",
        isHOD: false,
        phoneNumber: "",
      });
      fetchTeachers();
    } catch (error) {
      console.error("Error adding/updating teacher:", error);
      setError("Failed to add/update teacher. Please try again.");
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setNewTeacher({ ...teacher, department: teacher.department._id });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/teachers/${id}`);
        fetchTeachers();
      } catch (error) {
        setError("Failed to delete teacher. Please try again.");
      }
    }
  };

  return (
    <div className="teachers">
      <h1>Teachers Management</h1>
      {error && <p className="error">{error}</p>}
      <div id="fom">
        <form onSubmit={handleSubmit} className="add-teacher-form">
          <input
            type="text"
            name="name"
            value={newTeacher.name}
            onChange={handleInputChange}
            placeholder="Name"
            required
          />
          <input
            type="email"
            name="email"
            value={newTeacher.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          <input
            type="tel"
            name="phoneNumber"
            value={newTeacher.phoneNumber}
            onChange={handleInputChange}
            placeholder="Phone Number"
          />
          <select
            name="department"
            value={newTeacher.department}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
          <label>
            <input
              type="checkbox"
              name="isHOD"
              checked={newTeacher.isHOD}
              onChange={handleInputChange}
            />
            Assign as HOD
          </label>
          <button type="submit">
            {editingTeacher ? "Update" : "Add"} Teacher
          </button>
        </form>
      </div>
      <div id="tbl">
        <table className="teacher-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Department</th>
              <th>HOD</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher._id}>
                <td>{teacher.name}</td>
                <td>{teacher.email}</td>
                <td>{teacher.phoneNumber}</td>
                <td>
                  {teacher.department
                    ? teacher.department.name
                    : "No Department"}
                </td>
                <td>{teacher.isHOD ? "Yes" : "No"}</td>
                <td>
                  <button onClick={() => handleEdit(teacher)}>Edit</button>
                  <button onClick={() => handleDelete(teacher._id)}>
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
