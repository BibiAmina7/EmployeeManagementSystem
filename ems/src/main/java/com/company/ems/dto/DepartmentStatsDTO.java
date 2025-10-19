// backend/src/main/java/com/company/ems/dto/DepartmentStatsDTO.java
package com.company.ems.dto;

public class DepartmentStatsDTO {
    private String departmentName;
    private Long employeeCount;
    private Double percentage;

    public DepartmentStatsDTO() {}

    public DepartmentStatsDTO(String departmentName, Long employeeCount) {
        this.departmentName = departmentName;
        this.employeeCount = employeeCount;
    }

    // Getters and setters
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public Long getEmployeeCount() { return employeeCount; }
    public void setEmployeeCount(Long employeeCount) { this.employeeCount = employeeCount; }

    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }
}