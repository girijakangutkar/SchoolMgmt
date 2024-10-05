import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Home.css";

const API_BASE_URL = "https://schoolmanagent.onrender.com";

export default function Home() {
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDepartments();
    fetchTeachers();
    fetchStudents();
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

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/teachers`);
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setError("Failed to fetch teachers. Please try again.");
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/students`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to fetch students. Please try again.");
    }
  };

  const getHODForDepartment = (departmentId) => {
    return teachers.find(
      (teacher) =>
        teacher.department &&
        teacher.department._id === departmentId &&
        teacher.isHOD
    );
  };

  const getStudentsInDepartment = (departmentId) => {
    return students.filter(
      (student) => student.department && student.department._id === departmentId
    );
  };

  return (
    <div className="home">
      <h1>Welcome to School Management System</h1>
      {error && <p className="error">{error}</p>}

      <h2>Departments and HODs</h2>
      <div id="tbl">
        <table className="department-table">
          <thead>
            <tr>
              <th>Department</th>
              <th>HOD</th>
              <th>Number of Students</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => {
              const hod = getHODForDepartment(department._id);
              const studentsCount = getStudentsInDepartment(
                department._id
              ).length;
              return (
                <tr key={department._id}>
                  <td>{department.name}</td>
                  <td>{hod ? hod.name : "Not assigned"}</td>
                  <td>{studentsCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2>School Statistics</h2>
      <div className="statistics">
        <div className="stat-card departments">
          <h3>Total Departments</h3>
          <p>{departments.length}</p>
        </div>
        <div className="stat-card teachers">
          <h3>Total Teachers</h3>
          <p>{teachers.length}</p>
        </div>
        <div className="stat-card students">
          <h3>Total Students</h3>
          <p>{students.length}</p>
        </div>
      </div>
    </div>
  );
}
