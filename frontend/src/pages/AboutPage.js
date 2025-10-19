// frontend/src/pages/AboutPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow-sm">
            <div className="card-body p-5">
              <h1 className="text-center mb-4">About Employee Management System</h1>

              <div className="mb-5">
                <h3>Our Mission</h3>
                <p className="lead">
                  To provide organizations with a comprehensive, intuitive, and powerful employee management
                  solution that simplifies HR processes and enhances workforce productivity.
                </p>
              </div>

              <div className="mb-5">
                <h3>What We Offer</h3>
                <p>
                  Our Employee Management System is designed to handle all aspects of employee data management,
                  from onboarding to retirement. We provide tools for HR professionals to manage employee records,
                  track performance, generate reports, and make data-driven decisions.
                </p>
              </div>

              <div className="mb-5">
                <h3>Key Benefits</h3>
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Centralized employee database</li>
                      <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Real-time analytics and reporting</li>
                      <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Secure data management</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Automated workflows</li>
                      <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Mobile accessibility</li>
                      <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Scalable architecture</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link to="/dashboard" className="btn btn-primary me-3">
                  Explore Dashboard
                </Link>
                <Link to="/employees" className="btn btn-outline-primary">
                  Manage Employees
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;