// backend/src/main/java/com/company/ems/service/DashboardService.java
package com.company.ems.service;

import com.company.ems.dto.*;
import com.company.ems.model.Employee;
import com.company.ems.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public DashboardStatsDTO getDashboardStats() {
        List<Employee> allEmployees = employeeRepository.findAll();
        List<Employee> activeEmployees = allEmployees.stream()
                .filter(emp -> emp.getStatus() == Employee.Status.ACTIVE)
                .collect(Collectors.toList());

        DashboardStatsDTO dashboardStats = new DashboardStatsDTO();

        // Total active employees count
        dashboardStats.setTotalEmployees((long) activeEmployees.size());

        // New hires this month (using dateOfJoining)
        Long newHiresThisMonth = activeEmployees.stream()
                .filter(emp -> emp.getDateOfJoining() != null)
                .filter(emp -> emp.getDateOfJoining().getMonth() == LocalDate.now().getMonth() &&
                        emp.getDateOfJoining().getYear() == LocalDate.now().getYear())
                .count();
        dashboardStats.setNewHiresThisMonth(newHiresThisMonth);

        // Department statistics
        dashboardStats.setDepartmentStats(getDepartmentStats(activeEmployees));

        // Recent hires (last 5)
        dashboardStats.setRecentHires(getRecentHires(activeEmployees));

        // Upcoming anniversaries (next 30 days)
        dashboardStats.setUpcomingAnniversaries(getUpcomingAnniversaries(activeEmployees));

        // Upcoming birthdays (next 30 days) - ADD THIS CALL
        dashboardStats.setUpcomingBirthdays(getUpcomingBirthdays(activeEmployees));

        return dashboardStats;
    }

    private List<DepartmentStatsDTO> getDepartmentStats(List<Employee> employees) {
        Map<String, Long> departmentCounts = employees.stream()
                .filter(emp -> emp.getDepartment() != null && !emp.getDepartment().isEmpty())
                .collect(Collectors.groupingBy(
                        Employee::getDepartment,
                        Collectors.counting()
                ));

        Long total = departmentCounts.values().stream().mapToLong(Long::longValue).sum();

        return departmentCounts.entrySet().stream()
                .map(entry -> {
                    DepartmentStatsDTO stats = new DepartmentStatsDTO(entry.getKey(), entry.getValue());
                    stats.setPercentage(total > 0 ? Math.round((entry.getValue() * 100.0 / total) * 100.0) / 100.0 : 0.0);
                    return stats;
                })
                .sorted((a, b) -> Long.compare(b.getEmployeeCount(), a.getEmployeeCount()))
                .collect(Collectors.toList());
    }

    private List<EmployeeDTO> getRecentHires(List<Employee> employees) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");

        return employees.stream()
                .filter(emp -> emp.getDateOfJoining() != null)
                .sorted((a, b) -> b.getDateOfJoining().compareTo(a.getDateOfJoining()))
                .limit(5)
                .map(emp -> {
                    EmployeeDTO dto = new EmployeeDTO();
                    dto.setId(emp.getId());
                    dto.setFirstName(emp.getFirstName());
                    dto.setLastName(emp.getLastName());
                    dto.setEmail(emp.getEmail());
                    dto.setDepartment(emp.getDepartment());
                    dto.setRole(emp.getRole());
                    dto.setFormattedHireDate(emp.getDateOfJoining().format(formatter));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private List<UpcomingEventDTO> getUpcomingAnniversaries(List<Employee> employees) {
        return getUpcomingEvents(employees, "anniversary");
    }

    // ADD THIS METHOD FOR BIRTHDAYS
    private List<UpcomingEventDTO> getUpcomingBirthdays(List<Employee> employees) {
        return getUpcomingEvents(employees, "birthday");
    }

    private List<UpcomingEventDTO> getUpcomingEvents(List<Employee> employees, String eventType) {
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");

        return employees.stream()
                .map(emp -> {
                    LocalDate eventDate = eventType.equals("birthday") ? emp.getDateOfBirth() : emp.getDateOfJoining();
                    if (eventDate == null) return null;

                    LocalDate nextEvent = getNextEventDate(eventDate, today);
                    int daysUntil = Period.between(today, nextEvent).getDays();

                    if (daysUntil >= 0 && daysUntil <= 30) {
                        return new UpcomingEventDTO(
                                emp.getFirstName() + " " + emp.getLastName(),
                                eventType,
                                nextEvent.format(formatter),
                                daysUntil,
                                emp.getDepartment()
                        );
                    }
                    return null;
                })
                .filter(Objects::nonNull)
                .sorted(Comparator.comparingInt(UpcomingEventDTO::getDaysUntil))
                .limit(5)
                .collect(Collectors.toList());
    }

    private LocalDate getNextEventDate(LocalDate originalDate, LocalDate fromDate) {
        LocalDate nextEvent = originalDate.withYear(fromDate.getYear());
        if (nextEvent.isBefore(fromDate) || nextEvent.isEqual(fromDate)) {
            nextEvent = originalDate.withYear(fromDate.getYear() + 1);
        }
        return nextEvent;
    }
}