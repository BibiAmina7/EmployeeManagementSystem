// frontend/src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from '../api/axiosConfig';
import './Dashboard.css';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/dashboard/stats');
      setStats(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentChartData = () => {
    if (!stats?.departmentStats) return null;

    return {
      labels: stats.departmentStats.map(dept => dept.departmentName),
      datasets: [
        {
          data: stats.departmentStats.map(dept => dept.employeeCount),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="alert alert-danger" role="alert">
          {error}
          <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchDashboardStats}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header mb-4">
        <h1>Employee Dashboard</h1>
        <p className="text-muted">Overview of your workforce analytics</p>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card summary-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-muted">Total Employees</h6>
                  <h2 className="mb-0">{stats?.totalEmployees || 0}</h2>
                </div>
                <div className="summary-icon bg-primary">
                  <i className="fas fa-users text-white"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card summary-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-muted">New Hires This Month</h6>
                  <h2 className="mb-0">{stats?.newHiresThisMonth || 0}</h2>
                </div>
                <div className="summary-icon bg-success">
                  <i className="fas fa-user-plus text-white"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card summary-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-muted">Departments</h6>
                  <h2 className="mb-0">{stats?.departmentStats?.length || 0}</h2>
                </div>
                <div className="summary-icon bg-info">
                  <i className="fas fa-building text-white"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card summary-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-muted">Recent Activity</h6>
                  <h2 className="mb-0">{stats?.recentHires?.length || 0}</h2>
                </div>
                <div className="summary-icon bg-warning">
                  <i className="fas fa-chart-line text-white"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Department Chart */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">Employees by Department</h5>
            </div>
            <div className="card-body">
              {stats?.departmentStats?.length > 0 ? (
                <div className="chart-container">
                  <Pie data={getDepartmentChartData()} options={chartOptions} />
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="fas fa-chart-pie fa-3x mb-3"></i>
                  <p>No department data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Hires */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">Recent Hires</h5>
            </div>
            <div className="card-body">
              {stats?.recentHires?.length > 0 ? (
                <div className="recent-hires-list">
                  {stats.recentHires.map((employee, index) => (
                    <div key={employee.id} className="recent-hire-item d-flex justify-content-between align-items-center py-2 border-bottom">
                      <div>
                        <strong>{employee.firstName} {employee.lastName}</strong>
                        <div className="text-muted small">{employee.department}</div>
                      </div>
                      <span className="badge bg-light text-dark">{employee.formattedHireDate}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="fas fa-user-clock fa-3x mb-3"></i>
                  <p>No recent hires</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Upcoming Birthdays */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-birthday-cake me-2"></i>
                Upcoming Birthdays
              </h5>
            </div>
            <div className="card-body">
              {stats?.upcomingBirthdays?.length > 0 ? (
                <div className="upcoming-events-list">
                  {stats.upcomingBirthdays.map((event, index) => (
                    <div key={index} className="event-item d-flex justify-content-between align-items-center py-2 border-bottom">
                      <div>
                        <strong>{event.employeeName}</strong>
                        <div className="text-muted small">{event.date}</div>
                      </div>
                      <span className={`badge ${event.daysUntil === 0 ? 'bg-danger' : 'bg-warning'}`}>
                        {event.daysUntil === 0 ? 'Today!' : `${event.daysUntil} days`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="fas fa-birthday-cake fa-2x mb-3"></i>
                  <p>No upcoming birthdays</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Anniversaries */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-award me-2"></i>
                Upcoming Anniversaries
              </h5>
            </div>
            <div className="card-body">
              {stats?.upcomingAnniversaries?.length > 0 ? (
                <div className="upcoming-events-list">
                  {stats.upcomingAnniversaries.map((event, index) => (
                    <div key={index} className="event-item d-flex justify-content-between align-items-center py-2 border-bottom">
                      <div>
                        <strong>{event.employeeName}</strong>
                        <div className="text-muted small">{event.date}</div>
                      </div>
                      <span className={`badge ${event.daysUntil === 0 ? 'bg-danger' : 'bg-info'}`}>
                        {event.daysUntil === 0 ? 'Today!' : `${event.daysUntil} days`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="fas fa-award fa-2x mb-3"></i>
                  <p>No upcoming anniversaries</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;