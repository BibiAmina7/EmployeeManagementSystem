package com.company.ems.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
@Table(name = "employee") // matches existing table
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "first_name")
    private String firstName;

    @NotBlank
    @Column(name = "last_name")
    private String lastName;

    @Email
    @NotBlank
    @Column(unique = true)
    private String email;

    @Min(100)
    private double salary;

    @PastOrPresent
    @Column(name = "date_of_joining")
    private LocalDate dateOfJoining;

    // ADD THIS FIELD - date of birth
    @Column(name = "date_of_birth") // This matches the column name we added in SQL
    private LocalDate dateOfBirth;

    @NotBlank
    private String department;

    @NotBlank
    private String role;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    public enum Status { ACTIVE, INACTIVE }

    // Constructors - UPDATE CONSTRUCTORS TO INCLUDE dateOfBirth
    public Employee() {}

    // Updated constructor with dateOfBirth
    public Employee(String firstName, String lastName, String email, double salary,
                    LocalDate dateOfJoining, LocalDate dateOfBirth, String department,
                    String role, Status status) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.salary = salary;
        this.dateOfJoining = dateOfJoining;
        this.dateOfBirth = dateOfBirth; // ADD THIS LINE
        this.department = department;
        this.role = role;
        this.status = status;
    }

    // Original constructor (keep for backward compatibility)
    public Employee(String firstName, String lastName, String email, double salary,
                    LocalDate dateOfJoining, String department, String role, Status status) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.salary = salary;
        this.dateOfJoining = dateOfJoining;
        this.department = department;
        this.role = role;
        this.status = status;
    }

    // Getters & Setters - ADD GETTERS AND SETTERS FOR dateOfBirth
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public double getSalary() { return salary; }
    public void setSalary(double salary) { this.salary = salary; }
    public LocalDate getDateOfJoining() { return dateOfJoining; }
    public void setDateOfJoining(LocalDate dateOfJoining) { this.dateOfJoining = dateOfJoining; }

    // ADD THESE TWO METHODS
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}