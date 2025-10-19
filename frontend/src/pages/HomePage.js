// frontend/src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const features = [
    {
      icon: '👥',
      title: 'Employee Management',
      description: 'Complete CRUD operations for employee records with advanced search and filtering capabilities.',
      features: ['Add/Edit/Delete Employees', 'Advanced Search & Filter', 'Bulk Operations', 'Employee Profiles']
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Real-time insights and visual analytics about your workforce and organizational structure.',
      features: ['Department Analytics', 'Hiring Trends', 'Performance Metrics', 'Custom Reports']
    },
    {
      icon: '🔐',
      title: 'Secure Access',
      description: 'Role-based authentication and authorization to protect sensitive employee data.',
      features: ['JWT Authentication', 'Role-based Access', 'Secure APIs', 'Data Encryption']
    },
    {
      icon: '📈',
      title: 'Reporting',
      description: 'Generate comprehensive reports and export data for further analysis.',
      features: ['Custom Reports', 'Data Export', 'Visual Charts', 'Scheduled Reports']
    },
    {
      icon: '🔄',
      title: 'Automated Workflows',
      description: 'Streamline HR processes with automated workflows and notifications.',
      features: ['Approval Workflows', 'Email Notifications', 'Reminder System', 'Status Tracking']
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      description: 'Access your employee management system from any device, anywhere.',
      features: ['Mobile Friendly', 'Cross-browser Support', 'Offline Capabilities', 'Progressive Web App']
    }
  ];

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <h1 className="hero-title">
                Modern Employee Management System
              </h1>
              <p className="hero-subtitle">
                Streamline your HR processes, manage employee data efficiently, and gain valuable insights with our comprehensive employee management solution.
              </p>
              <div className="hero-buttons">
                <Link to="/dashboard" className="btn btn-primary btn-lg me-3">
                  <i className="fas fa-chart-line me-2"></i>
                  View Dashboard
                </Link>
                <Link to="/employees" className="btn btn-outline-primary btn-lg">
                  <i className="fas fa-users me-2"></i>
                  Manage Employees
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="hero-image">
                <i className="fas fa-users-cog"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-subtitle">Everything you need to manage your workforce effectively</p>
          </div>
          <div className="row">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-4 col-md-6 mb-4">
                <div className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h4 className="feature-title">{feature.title}</h4>
                  <p className="feature-description">{feature.description}</p>
                  <ul className="feature-list">
                    {feature.features.map((item, idx) => (
                      <li key={idx}>
                        <i className="fas fa-check text-success me-2"></i>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 bg-primary text-white">
        <div className="container text-center">
          <h2 className="cta-title">Ready to Transform Your HR Management?</h2>
          <p className="cta-subtitle mb-4">
            Join thousands of companies that trust our employee management system
          </p>
          <div className="cta-buttons">
            <Link to="/dashboard" className="btn btn-light btn-lg me-3">
              Get Started
            </Link>
            <Link to="/employees" className="btn btn-outline-light btn-lg">
              Explore Features
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;