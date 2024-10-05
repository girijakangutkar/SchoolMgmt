import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Attendance.css";
const API_BASE_URL = "http://localhost:5000";

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceData, setAttendanceData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      fetchStudents();
      fetchAttendance();
    }
  }, [selectedDepartment, selectedMonth, selectedYear]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/departments`);
      setDepartments(response.data);
    } catch (error) {
      setError("Failed to fetch departments. Please try again.");
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/students`);
      const departmentStudents = response.data.filter(
        (student) => student.department._id === selectedDepartment
      );
      setStudents(departmentStudents);
    } catch (error) {
      setError("Failed to fetch students. Please try again.");
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/attendance?month=${selectedMonth}&year=${selectedYear}&departmentId=${selectedDepartment}`
      );

      const attendanceMap = {};
      response.data.forEach((record) => {
        if (!attendanceMap[record.student._id]) {
          attendanceMap[record.student._id] = {};
        }
        const day = new Date(record.date).getDate();
        attendanceMap[record.student._id][day] = record.status;
      });

      setAttendanceData(attendanceMap);
    } catch (error) {
      setError("Failed to fetch attendance data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = async (studentId, day, status) => {
    try {
      const date = new Date(selectedYear, selectedMonth - 1, day);
      await axios.post(`${API_BASE_URL}/api/attendance`, {
        studentId,
        date: date.toISOString(),
        status: status ? "present" : "absent",
      });
      fetchAttendance();
    } catch (error) {
      setError("Failed to update attendance. Please try again.");
    }
  };

  const handleDownloadMonthlyExcel = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/attendance/report/monthly/excel?month=${selectedMonth}&year=${selectedYear}&departmentId=${selectedDepartment}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `attendance_report_${selectedMonth}_${selectedYear}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError("Failed to download monthly report. Please try again.");
    }
  };
  const handleDownloadDailyPDF = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/attendance/report/daily?date=${selectedDate}&departmentId=${selectedDepartment}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `attendance_report_${selectedDate}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      setError("Failed to download daily report. Please try again.");
    }
  };

  const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

  const renderAttendanceTable = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const today = new Date();
    const isCurrentMonth =
      selectedMonth === today.getMonth() + 1 &&
      selectedYear === today.getFullYear();

    return (
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Student Name</th>
            {[...Array(daysInMonth)].map((_, index) => (
              <th key={index + 1}>{index + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              {[...Array(daysInMonth)].map((_, index) => {
                const day = index + 1;
                const isDisabled = isCurrentMonth && day > today.getDate();
                const isPresent =
                  attendanceData[student._id]?.[day] === "present";

                return (
                  <td key={day}>
                    <input
                      type="checkbox"
                      checked={isPresent}
                      onChange={(e) =>
                        handleAttendanceChange(
                          student._id,
                          day,
                          e.target.checked
                        )
                      }
                      disabled={isDisabled}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="attendance">
      <h1>Student Attendance Management</h1>
      {error && <p className="error">{error}</p>}
      <div className="filters">
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </select>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        >
          {[...Array(12)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {new Date(0, index).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {[...Array(5)].map((_, index) => {
            const year = new Date().getFullYear() - 2 + index;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          disabled
        />
      </div>
      <div className="download-buttons">
        <button onClick={handleDownloadDailyPDF} disabled={!selectedDepartment}>
          Download Daily Report
        </button>
        <button
          onClick={handleDownloadMonthlyExcel}
          disabled={!selectedDepartment}
        >
          Download Monthly Excel Report
        </button>
      </div>
      <div id="tbl">
        {selectedDepartment &&
          (loading ? <p>Loading...</p> : renderAttendanceTable())}
      </div>
    </div>
  );
}
