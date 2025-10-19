import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeForm from "../components/EmployeeForm";

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchEmployees = async () => {
     try {
       setLoading(true);
       setError("");

       console.log("Fetching ALL employees...");

       // ✅ CHANGE THIS LINE - Use the new /all endpoint ✅
       const res = await axios.get("/employees/all");

       console.log(`✅ Successfully fetched ${res.data.length} employees`);
       console.log("Employees data:", res.data);

       // ✅ SET THE EMPLOYEES DIRECTLY (no pagination handling needed) ✅
       setEmployees(res.data);

     } catch (err) {
       console.error("❌ Error fetching employees:", err);

       // Fallback to paginated endpoint if /all doesn't work
       console.log("Trying fallback to paginated endpoint...");
       try {
         const fallbackRes = await axios.get("/employees?size=100");
         let employeesData = fallbackRes.data.employees || fallbackRes.data || [];
         console.log(`Fallback fetched ${employeesData.length} employees`);
         setEmployees(employeesData);
       } catch (fallbackErr) {
         setError("Failed to load employees. Please try again.");
       }
     } finally {
       setLoading(false);
     }
   };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async id => {
    const employee = employees.find(emp => emp.id === id);
    if (window.confirm(`Are you sure you want to delete ${employee?.firstName} ${employee?.lastName}?`)) {
      try {
        setError("");
        await axios.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (err) {
        console.error("Error deleting employee:", err);
        setError("Failed to delete employee. Please try again.");
      }
    }
  };

  const handleEdit = emp => {
    setEditing(emp);
    setShowForm(true);
  };

  const handleFormSubmit = async empData => {
    try {
      setError("");

      console.log("=== FRONTEND: SUBMITTING EMPLOYEE DATA ===");
      console.log("Editing:", editing);
      console.log("Employee Data:", empData);

      let response;
      if (editing) {
        console.log("Making PUT request to:", `/employees/${editing.id}`);
        response = await axios.put(`/employees/${editing.id}`, empData);
      } else {
        console.log("Making POST request to:", "/employees");
        response = await axios.post("/employees", empData);
      }

      console.log("Server Response:", response.data);

      setShowForm(false);
      setEditing(null);
      await fetchEmployees();
    } catch (err) {
      console.error("Error saving employee:", err);
      console.error("Full error response:", err.response?.data);

      // Show detailed error message from backend
      const errorData = err.response?.data;
      let errorMessage = "Failed to save employee";

      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.error) {
        errorMessage = errorData.error;
      } else if (err.response?.status === 400) {
        errorMessage = "Validation error - please check your data";
      }

      setError(errorMessage);
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setShowForm(false);
    setError("");
  };

  const handleAddNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Employee Management</h2>
        <button
          className="btn btn-primary"
          onClick={handleAddNew}
          disabled={showForm}
        >
          + Add New Employee
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {/* Employee Form */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              {editing ? `Edit Employee: ${editing.firstName} ${editing.lastName}` : "Add New Employee"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleCancel}
              aria-label="Close"
            ></button>
          </div>
          <div className="card-body">
            <EmployeeForm
              onSubmit={handleFormSubmit}
              initialData={editing}
            />
          </div>
        </div>
      )}

      {/* Employee Table */}
      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading employees...</p>
        </div>
      ) : (
        <EmployeeTable
          employees={employees}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default EmployeePage;