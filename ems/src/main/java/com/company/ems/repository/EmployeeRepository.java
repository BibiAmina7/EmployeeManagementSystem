package com.company.ems.repository;

import com.company.ems.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Page<Employee> findByDepartmentContainingIgnoreCase(String department, Pageable pageable);

    Page<Employee> findByStatus(Employee.Status status, Pageable pageable);

    // combined search by first or last name
    Page<Employee> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String first, String last, Pageable pageable);
}
