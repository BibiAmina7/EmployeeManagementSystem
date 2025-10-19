package com.company.ems.service;

import com.company.ems.dto.EmployeeDTO;
import com.company.ems.model.Employee;
import com.company.ems.repository.EmployeeRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository repository;

    public EmployeeService(EmployeeRepository repository) {
        this.repository = repository;
    }

    // List with pagination
    public Page<Employee> listAll(int page, int size, String sortBy) {
        Pageable p = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        return repository.findAll(p);
    }

    // Search by first or last name
    public Page<Employee> search(String keyword, int page, int size, String sortBy) {
        Pageable p = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        return repository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(keyword, keyword, p);
    }

    // Get by ID
    public Employee getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Employee ID: " + id));
    }

    // Create employee from Entity
    public Employee create(Employee employee) {
        return repository.save(employee);
    }

    // CREATE FROM DTO
    public Employee createFromDTO(EmployeeDTO employeeDTO) {
        Employee employee = new Employee();
        employee.setFirstName(employeeDTO.getFirstName());
        employee.setLastName(employeeDTO.getLastName());
        employee.setEmail(employeeDTO.getEmail());
        employee.setSalary(employeeDTO.getSalary() != null ? employeeDTO.getSalary() : 0.0);
        employee.setDepartment(employeeDTO.getDepartment());
        employee.setRole(employeeDTO.getRole());
        employee.setDateOfJoining(employeeDTO.getDateOfJoining());
        employee.setDateOfBirth(employeeDTO.getDateOfBirth());
        employee.setStatus(employeeDTO.getStatus() != null ?
                Employee.Status.valueOf(employeeDTO.getStatus()) : Employee.Status.ACTIVE);

        System.out.println("=== CREATING EMPLOYEE FROM DTO ===");
        System.out.println("Date of Birth: " + employee.getDateOfBirth());
        System.out.println("Date of Joining: " + employee.getDateOfJoining());
        System.out.println("Status: " + employee.getStatus());

        return repository.save(employee);
    }

    // Update employee from Entity
    public Employee update(Long id, Employee updated) {
        Employee e = getById(id);
        e.setFirstName(updated.getFirstName());
        e.setLastName(updated.getLastName());
        e.setEmail(updated.getEmail());
        e.setDepartment(updated.getDepartment());
        e.setRole(updated.getRole());
        e.setSalary(updated.getSalary());
        e.setDateOfJoining(updated.getDateOfJoining());
        e.setDateOfBirth(updated.getDateOfBirth());
        e.setStatus(updated.getStatus());

        System.out.println("=== UPDATING EMPLOYEE FROM ENTITY ===");
        System.out.println("Date of Birth: " + e.getDateOfBirth());
        System.out.println("Date of Joining: " + e.getDateOfJoining());
        System.out.println("Status: " + e.getStatus());

        return repository.save(e);
    }

    // UPDATE FROM DTO
    public Employee updateFromDTO(Long id, EmployeeDTO employeeDTO) {
        Employee e = getById(id);
        e.setFirstName(employeeDTO.getFirstName());
        e.setLastName(employeeDTO.getLastName());
        e.setEmail(employeeDTO.getEmail());
        e.setSalary(employeeDTO.getSalary() != null ? employeeDTO.getSalary() : e.getSalary());
        e.setDepartment(employeeDTO.getDepartment());
        e.setRole(employeeDTO.getRole());
        e.setDateOfJoining(employeeDTO.getDateOfJoining());
        e.setDateOfBirth(employeeDTO.getDateOfBirth());

        if (employeeDTO.getStatus() != null) {
            e.setStatus(Employee.Status.valueOf(employeeDTO.getStatus()));
        }

        System.out.println("=== UPDATING EMPLOYEE FROM DTO ===");
        System.out.println("Date of Birth: " + e.getDateOfBirth());
        System.out.println("Date of Joining: " + e.getDateOfJoining());
        System.out.println("Status: " + e.getStatus());

        return repository.save(e);
    }

    // Delete employee
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // List all employees without pagination
    public List<Employee> listAllNoPage() {
        return repository.findAll();
    }
}