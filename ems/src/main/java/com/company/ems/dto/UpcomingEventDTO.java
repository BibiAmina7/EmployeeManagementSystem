// backend/src/main/java/com/company/ems/dto/UpcomingEventDTO.java
package com.company.ems.dto;

public class UpcomingEventDTO {
    private String employeeName;
    private String eventType; // "anniversary"
    private String date;
    private int daysUntil;
    private String department;

    public UpcomingEventDTO() {}

    public UpcomingEventDTO(String employeeName, String eventType, String date, int daysUntil, String department) {
        this.employeeName = employeeName;
        this.eventType = eventType;
        this.date = date;
        this.daysUntil = daysUntil;
        this.department = department;
    }

    // Getters and setters
    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public int getDaysUntil() { return daysUntil; }
    public void setDaysUntil(int daysUntil) { this.daysUntil = daysUntil; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}