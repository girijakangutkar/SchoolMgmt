import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Workers.css";

const API_BASE_URL = "http://localhost:5000";

export default function Workers() {
  const [workers, setWorkers] = useState([]);
  const [newWorker, setNewWorker] = useState({ name: "", role: "" });
  const [error, setError] = useState(null);
  const [editingWorker, setEditingWorker] = useState(null);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/workers`);
      setWorkers(response.data);
    } catch (error) {
      console.error("Error fetching workers:", error);
      setError("Failed to fetch workers. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    setNewWorker({ ...newWorker, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingWorker) {
        await axios.put(
          `${API_BASE_URL}/api/workers/${editingWorker._id}`,
          newWorker
        );
      } else {
        await axios.post(`${API_BASE_URL}/api/workers`, newWorker);
      }
      setNewWorker({ name: "", role: "" });
      setEditingWorker(null);
      fetchWorkers();
    } catch (error) {
      console.error("Error adding/updating worker:", error);
      setError("Failed to add/update worker. Please try again.");
    }
  };

  const handleEdit = (worker) => {
    setEditingWorker(worker);
    setNewWorker({ name: worker.name, role: worker.role });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this worker?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/workers/${id}`);
        fetchWorkers();
      } catch (error) {
        setError("Failed to delete worker. Please try again.");
      }
    }
  };

  return (
    <div className="workers">
      <h1>Workers Management</h1>
      {error && <p className="error">{error}</p>}
      <div id="fom">
        <form onSubmit={handleSubmit} className="add-worker-form">
          <input
            type="text"
            name="name"
            value={newWorker.name}
            onChange={handleInputChange}
            placeholder="Name"
            required
          />
          <input
            type="text"
            name="role"
            value={newWorker.role}
            onChange={handleInputChange}
            placeholder="Role"
            required
          />
          <button type="submit">
            {editingWorker ? "Update" : "Add"} Worker
          </button>
        </form>
      </div>
      <div className="worker-cards">
        {workers.map((worker) => (
          <div key={worker._id} className="worker-card">
            <h3>{worker.name}</h3>
            <p>Role: {worker.role}</p>
            <div className="worker-actions">
              <button onClick={() => handleEdit(worker)}>Edit</button>
              <button onClick={() => handleDelete(worker._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
