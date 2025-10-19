package com.company.ems.util;

import com.company.ems.model.Employee;
import org.apache.commons.csv.*;

import java.io.*;
import java.util.List;

public class CsvExporter {

    public static void writeEmployeesToCsv(List<Employee> employees, Writer writer) throws IOException {
        try (CSVPrinter printer = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader(
                "id", "firstName", "lastName", "email", "department", "role", "salary", "dateOfJoining", "status"))) {

            for (Employee e : employees) {
                printer.printRecord(
                        e.getId(),
                        e.getFirstName(),
                        e.getLastName(),
                        e.getEmail(),
                        e.getDepartment(),
                        e.getRole(),
                        e.getSalary(),
                        e.getDateOfJoining(),
                        e.getStatus()
                );
            }
        }
    }
}
