// backend/src/main/java/com/company/ems/dto/DashboardStatsDTO.java
package com.company.ems.dto;

import java.util.List;

public class DashboardStatsDTO {
    private Long totalEmployees;
    private Long newHiresThisMonth;
    private List<DepartmentStatsDTO> departmentStats;
    private List<EmployeeDTO> recentHires;
    private List<UpcomingEventDTO> upcomingAnniversaries;
    private List<UpcomingEventDTO> upcomingBirthdays; // ADD THIS FIELD

    // Constructors
    public DashboardStatsDTO() {}

    public DashboardStatsDTO(Long totalEmployees, Long newHiresThisMonth) {
        this.totalEmployees = totalEmployees;
        this.newHiresThisMonth = newHiresThisMonth;
    }

    // Getters and setters
    public Long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(Long totalEmployees) { this.totalEmployees = totalEmployees; }

    public Long getNewHiresThisMonth() { return newHiresThisMonth; }
    public void setNewHiresThisMonth(Long newHiresThisMonth) { this.newHiresThisMonth = newHiresThisMonth; }

    public List<DepartmentStatsDTO> getDepartmentStats() { return departmentStats; }
    public void setDepartmentStats(List<DepartmentStatsDTO> departmentStats) { this.departmentStats = departmentStats; }

    public List<EmployeeDTO> getRecentHires() { return recentHires; }
    public void setRecentHires(List<EmployeeDTO> recentHires) { this.recentHires = recentHires; }

    public List<UpcomingEventDTO> getUpcomingAnniversaries() { return upcomingAnniversaries; }
    public void setUpcomingAnniversaries(List<UpcomingEventDTO> upcomingAnniversaries) { this.upcomingAnniversaries = upcomingAnniversaries; }

    // ADD BIRTHDAY GETTERS/SETTERS
    public List<UpcomingEventDTO> getUpcomingBirthdays() { return upcomingBirthdays; }
    public void setUpcomingBirthdays(List<UpcomingEventDTO> upcomingBirthdays) { this.upcomingBirthdays = upcomingBirthdays; }
}