import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Students.css";

const API_BASE_URL = "https://schoolmanagent.onrender.com";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    department: "",
    phoneNumber: "",
    year: "",
  });
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchDepartments();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/students`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to fetch students. Please try again.");
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
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/students`, newStudent);
      setNewStudent({
        name: "",
        email: "",
        department: "",
        phoneNumber: "",
        year: "",
      });
      fetchStudents();
    } catch (error) {
      console.error("Error adding student:", error);
      setError("Failed to add student. Please try again.");
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setNewStudent({ ...student, department: student.department._id });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_BASE_URL}/api/students/${editingStudent._id}`,
        newStudent
      );
      setEditingStudent(null);
      setNewStudent({
        name: "",
        email: "",
        department: "",
        phoneNumber: "",
        year: "",
      });
      fetchStudents();
    } catch (error) {
      setError("Failed to update student. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/students/${id}`);
        fetchStudents();
      } catch (error) {
        setError("Failed to delete student. Please try again.");
      }
    }
  };

  const filteredStudents = students.filter((student) => {
    return (
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterDepartment === "" ||
        (student.department && student.department._id === filterDepartment))
    );
  });

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="students">
      <h1>Students Management</h1>
      {error && <p className="error">{error}</p>}

      <div id="fom">
        <form
          onSubmit={editingStudent ? handleUpdate : handleSubmit}
          className="add-student-form"
        >
          <input
            type="text"
            name="name"
            value={newStudent.name}
            onChange={handleInputChange}
            placeholder="Name"
            required
          />
          <input
            type="email"
            name="email"
            value={newStudent.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          <select
            name="department"
            value={newStudent.department}
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
          <input
            type="tel"
            name="phoneNumber"
            value={newStudent.phoneNumber}
            onChange={handleInputChange}
            placeholder="Phone Number"
          />
          <input
            type="text"
            name="year"
            value={newStudent.year}
            onChange={handleInputChange}
            placeholder="Year"
          />
          <button type="submit">
            {editingStudent ? "Update Student" : "Add Student"}
          </button>
          {editingStudent && (
            <button type="button" onClick={() => setEditingStudent(null)}>
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>
      <div id="tbl">
        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Phone Number</th>
              <th>Year</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>
                  {student.department
                    ? student.department.name
                    : "No Department"}
                </td>
                <td>{student.phoneNumber}</td>
                <td>{student.year}</td>
                <td>
                  <button onClick={() => handleEdit(student)}>Edit</button>
                  <button onClick={() => handleDelete(student._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        {Array.from({
          length: Math.ceil(filteredStudents.length / studentsPerPage),
        }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
