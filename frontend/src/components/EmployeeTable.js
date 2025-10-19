import React, { useState, useMemo } from "react";

const EmployeeTable = ({ employees, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  // Filter employees based on search term
  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;

    return employees.filter(emp =>
      emp.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  // Sort employees
  const sortedEmployees = useMemo(() => {
    return [...filteredEmployees].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      // Handle string comparison
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredEmployees, sortField, sortDirection]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = sortedEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span>↕️</span>;
    return sortDirection === 'asc' ? <span>↑</span> : <span>↓</span>;
  };

  return (
    <div>
      {/* Search Box */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">🔍</span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, email, department, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setSearchTerm("")}
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <div className="col-md-6 text-muted d-flex align-items-center">
          Showing {sortedEmployees.length} of {employees.length} employees
        </div>
      </div>

      {/* Employees Table */}
      {currentEmployees.length === 0 ? (
        <div className="alert alert-info text-center">
          {employees.length === 0 ? 'No employees found.' : 'No employees match your search.'}
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-hover table-striped">
              <thead className="table-light">
                <tr>
                  <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
                    ID <SortIcon field="id" />
                  </th>
                  <th onClick={() => handleSort("firstName")} style={{ cursor: "pointer" }}>
                    Name <SortIcon field="firstName" />
                  </th>
                  <th onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
                    Email <SortIcon field="email" />
                  </th>
                  <th onClick={() => handleSort("department")} style={{ cursor: "pointer" }}>
                    Department <SortIcon field="department" />
                  </th>
                  <th onClick={() => handleSort("role")} style={{ cursor: "pointer" }}>
                    Role <SortIcon field="role" />
                  </th>
                  <th onClick={() => handleSort("salary")} style={{ cursor: "pointer" }}>
                    Salary <SortIcon field="salary" />
                  </th>
                  <th onClick={() => handleSort("dateOfJoining")} style={{ cursor: "pointer" }}>
                    Join Date <SortIcon field="dateOfJoining" />
                  </th>
                  <th onClick={() => handleSort("dateOfBirth")} style={{ cursor: "pointer" }}>
                    Birth Date <SortIcon field="dateOfBirth" />
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees.map(emp => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td>
                      <strong>{emp.firstName} {emp.lastName}</strong>
                    </td>
                    <td>{emp.email}</td>
                    <td>
                      <span className="badge bg-primary">{emp.department}</span>
                    </td>
                    <td>{emp.role}</td>
                    <td>
                      ${emp.salary?.toLocaleString()}
                    </td>
                    <td>
                      {emp.dateOfJoining ? new Date(emp.dateOfJoining).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      {emp.dateOfBirth ? new Date(emp.dateOfBirth).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-warning"
                          onClick={() => onEdit(emp)}
                          title="Edit employee"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => onDelete(emp.id)}
                          title="Delete employee"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Employee pagination">
              <ul className="pagination justify-content-center mt-4">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  // Show only relevant pages (current page, first, last, and neighbors)
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    );
                  } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return <li key={pageNum} className="page-item disabled"><span className="page-link">...</span></li>;
                  }
                  return null;
                })}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default EmployeeTable;