import React, { useState, useEffect } from "react";

const EmployeeForm = ({ onSubmit, initialData, onCancel }) => {
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    salary: "",
    department: "",
    role: "",
    dateOfJoining: "",
    dateOfBirth: "",
    status: "ACTIVE" // ADD STATUS FIELD
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Populate form if editing
  useEffect(() => {
    if (initialData) {
      console.log("Initial data for form:", initialData);

      // Format dates for input fields (YYYY-MM-DD)
      const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        } catch (error) {
          console.error("Error formatting date:", error);
          return '';
        }
      };

      setEmployee({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        salary: initialData.salary || "",
        department: initialData.department || "",
        role: initialData.role || "",
        dateOfJoining: formatDate(initialData.dateOfJoining),
        dateOfBirth: formatDate(initialData.dateOfBirth),
        status: initialData.status || "ACTIVE" // ADD STATUS
      });
    } else {
      // Reset form when adding new employee
      setEmployee({
        firstName: "",
        lastName: "",
        email: "",
        salary: "",
        department: "",
        role: "",
        dateOfJoining: "",
        dateOfBirth: "",
        status: "ACTIVE" // ADD STATUS
      });
    }
  }, [initialData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setEmployee(prev => ({
      ...prev,
      [name]: name === 'salary' ? (value === '' ? '' : Number(value)) : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!employee.firstName?.trim()) newErrors.firstName = "First name is required";
    if (!employee.lastName?.trim()) newErrors.lastName = "Last name is required";
    if (!employee.email?.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(employee.email)) newErrors.email = "Email is invalid";
    if (!employee.salary || employee.salary <= 0) newErrors.salary = "Valid salary is required";
    if (!employee.department?.trim()) newErrors.department = "Department is required";
    if (!employee.role?.trim()) newErrors.role = "Role is required";
    if (!employee.dateOfJoining) newErrors.dateOfJoining = "Date of joining is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare data with proper formatting
      const submissionData = {
        firstName: employee.firstName.trim(),
        lastName: employee.lastName.trim(),
        email: employee.email.trim(),
        salary: Number(employee.salary),
        department: employee.department.trim(),
        role: employee.role.trim(),
        dateOfJoining: employee.dateOfJoining,
        dateOfBirth: employee.dateOfBirth || null,
        status: employee.status
      };

      console.log("Submitting employee data:", submissionData);
      await onSubmit(submissionData);
    } catch (error) {
      console.error("Form submission error:", error);
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row mb-2">
        <div className="col">
          <label className="form-label">First Name *</label>
          <input
            type="text"
            name="firstName"
            value={employee.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
            required
          />
          {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
        </div>
        <div className="col">
          <label className="form-label">Last Name *</label>
          <input
            type="text"
            name="lastName"
            value={employee.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
            required
          />
          {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
        </div>
      </div>

      <div className="row mb-2">
        <div className="col">
          <label className="form-label">Email *</label>
          <input
            type="email"
            name="email"
            value={employee.email}
            onChange={handleChange}
            placeholder="Email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            required
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        <div className="col">
          <label className="form-label">Salary *</label>
          <input
            type="number"
            name="salary"
            value={employee.salary}
            onChange={handleChange}
            placeholder="Salary"
            className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
            min="100"
            step="0.01"
            required
          />
          {errors.salary && <div className="invalid-feedback">{errors.salary}</div>}
        </div>
      </div>

      <div className="row mb-2">
        <div className="col">
          <label className="form-label">Department *</label>
          <input
            type="text"
            name="department"
            value={employee.department}
            onChange={handleChange}
            placeholder="Department"
            className={`form-control ${errors.department ? 'is-invalid' : ''}`}
            required
          />
          {errors.department && <div className="invalid-feedback">{errors.department}</div>}
        </div>
        <div className="col">
          <label className="form-label">Role *</label>
          <input
            type="text"
            name="role"
            value={employee.role}
            onChange={handleChange}
            placeholder="Role"
            className={`form-control ${errors.role ? 'is-invalid' : ''}`}
            required
          />
          {errors.role && <div className="invalid-feedback">{errors.role}</div>}
        </div>
      </div>

      <div className="row mb-2">
        <div className="col">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={employee.dateOfBirth}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col">
          <label className="form-label">Date of Joining *</label>
          <input
            type="date"
            name="dateOfJoining"
            value={employee.dateOfJoining}
            onChange={handleChange}
            className={`form-control ${errors.dateOfJoining ? 'is-invalid' : ''}`}
            required
          />
          {errors.dateOfJoining && <div className="invalid-feedback">{errors.dateOfJoining}</div>}
        </div>
      </div>

      {/* Status Field - Hidden but included in data */}
      <input type="hidden" name="status" value={employee.status} />

      <div className="d-flex gap-2 mt-4">
        <button
          type="submit"
          className="btn btn-success"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Saving...
            </>
          ) : (
            initialData ? 'Update Employee' : 'Add Employee'
          )}
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;