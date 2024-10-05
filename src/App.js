import React, { useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Students from "./components/Students";
import Teachers from "./components/Teachers";
import Departments from "./components/Departments";
import Workers from "./components/Workers";
import Home from "./components/Home";
import Attendance from "./components/Attendance";
import "./App.css";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-container">
            <Link to="/" className="navbar-logo">
              SchoolMS
            </Link>
            <div className="menu-icon" onClick={toggleMenu}>
              <i className={isOpen ? "fas fa-times" : "fas fa-bars"} />
            </div>
            <ul className={isOpen ? "nav-menu active" : "nav-menu"}>
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={toggleMenu}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/students" className="nav-link" onClick={toggleMenu}>
                  Students
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/teachers" className="nav-link" onClick={toggleMenu}>
                  Teachers
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/departments"
                  className="nav-link"
                  onClick={toggleMenu}
                >
                  Departments
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/workers" className="nav-link" onClick={toggleMenu}>
                  Workers
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/attendance"
                  className="nav-link"
                  onClick={toggleMenu}
                >
                  Attendance
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/students" element={<Students />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/workers" element={<Workers />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
