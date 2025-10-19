package com.company.ems.controller;

import com.company.ems.dto.EmployeeDTO;
import com.company.ems.model.Employee;
import com.company.ems.service.EmployeeService;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:4000")
public class EmployeeController {

    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    // List with pagination and optional search
    @GetMapping
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(required = false) String keyword) {

        Page<Employee> result = (keyword == null || keyword.isBlank())
                ? service.listAll(page, size, sortBy)
                : service.search(keyword, page, size, sortBy);

        Map<String, Object> resp = new HashMap<>();
        resp.put("employees", result.getContent());
        resp.put("currentPage", result.getNumber());
        resp.put("totalItems", result.getTotalElements());
        resp.put("totalPages", result.getTotalPages());

        return ResponseEntity.ok(resp);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> allEmployees = service.listAllNoPage();
        System.out.println("=== GET ALL EMPLOYEES (NO PAGINATION) ===");
        System.out.println("Returning " + allEmployees.size() + " employees");
        return ResponseEntity.ok(allEmployees);
    }

    // Get single employee by ID
    @GetMapping("/{id}")
    public ResponseEntity<Employee> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    // FIXED: CREATE employee - Handle plain Map/Object from frontend
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Object employeeData) {
        try {
            System.out.println("=== CREATE EMPLOYEE ===");
            System.out.println("Received data type: " + (employeeData != null ? employeeData.getClass().getSimpleName() : "null"));
            System.out.println("Received data: " + employeeData);

            Employee created;

            if (employeeData instanceof Map) {
                // Convert Map to EmployeeDTO
                Map<String, Object> employeeMap = (Map<String, Object>) employeeData;
                EmployeeDTO employeeDTO = convertMapToEmployeeDTO(employeeMap);
                System.out.println("Converted from Map to DTO");
                System.out.println("Date of Birth: " + employeeDTO.getDateOfBirth());
                System.out.println("Date of Joining: " + employeeDTO.getDateOfJoining());
                created = service.createFromDTO(employeeDTO);
            } else if (employeeData instanceof EmployeeDTO) {
                EmployeeDTO employeeDTO = (EmployeeDTO) employeeData;
                System.out.println("Date of Birth from DTO: " + employeeDTO.getDateOfBirth());
                System.out.println("Date of Joining from DTO: " + employeeDTO.getDateOfJoining());
                created = service.createFromDTO(employeeDTO);
            } else if (employeeData instanceof Employee) {
                Employee employee = (Employee) employeeData;
                System.out.println("Date of Birth from Entity: " + employee.getDateOfBirth());
                System.out.println("Date of Joining from Entity: " + employee.getDateOfJoining());
                created = service.create(employee);
            } else {
                System.out.println("Unknown data type: " + employeeData.getClass());
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid employee data format");
                errorResponse.put("receivedType", employeeData.getClass().getSimpleName());
                return ResponseEntity.badRequest().body(errorResponse);
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            System.out.println("=== ERROR CREATING EMPLOYEE ===");
            e.printStackTrace();

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Create failed");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // FIXED: UPDATE employee - Handle plain Map/Object from frontend
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Object employeeData) {
        try {
            System.out.println("=== UPDATE EMPLOYEE ID: " + id + " ===");
            System.out.println("Received data type: " + (employeeData != null ? employeeData.getClass().getSimpleName() : "null"));
            System.out.println("Received data: " + employeeData);

            Employee updated;

            if (employeeData instanceof Map) {
                // Convert Map to EmployeeDTO
                Map<String, Object> employeeMap = (Map<String, Object>) employeeData;
                EmployeeDTO employeeDTO = convertMapToEmployeeDTO(employeeMap);
                System.out.println("Converted from Map to DTO");
                System.out.println("Date of Birth: " + employeeDTO.getDateOfBirth());
                System.out.println("Date of Joining: " + employeeDTO.getDateOfJoining());
                updated = service.updateFromDTO(id, employeeDTO);
            } else if (employeeData instanceof EmployeeDTO) {
                EmployeeDTO employeeDTO = (EmployeeDTO) employeeData;
                System.out.println("Date of Birth from DTO: " + employeeDTO.getDateOfBirth());
                System.out.println("Date of Joining from DTO: " + employeeDTO.getDateOfJoining());
                updated = service.updateFromDTO(id, employeeDTO);
            } else if (employeeData instanceof Employee) {
                Employee employee = (Employee) employeeData;
                System.out.println("Date of Birth from Entity: " + employee.getDateOfBirth());
                System.out.println("Date of Joining from Entity: " + employee.getDateOfJoining());
                updated = service.update(id, employee);
            } else {
                System.out.println("Unknown data type: " + employeeData.getClass());
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid employee data format");
                errorResponse.put("receivedType", employeeData.getClass().getSimpleName());
                return ResponseEntity.badRequest().body(errorResponse);
            }

            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            System.out.println("=== ERROR UPDATING EMPLOYEE ===");
            e.printStackTrace();

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Update failed");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // Delete employee
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Dashboard statistics
    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        List<Employee> all = service.listAllNoPage();
        Map<String, Long> perDept = all.stream()
                .collect(Collectors.groupingBy(Employee::getDepartment, Collectors.counting()));
        double avgSalary = all.stream().mapToDouble(Employee::getSalary).average().orElse(0);

        Map<String, Object> out = new HashMap<>();
        out.put("perDepartment", perDept);
        out.put("averageSalary", avgSalary);
        out.put("totalEmployees", all.size());
        return out;
    }

    // Helper method to convert Map to EmployeeDTO
    private EmployeeDTO convertMapToEmployeeDTO(Map<String, Object> map) {
        EmployeeDTO dto = new EmployeeDTO();

        System.out.println("Converting map to DTO: " + map);

        // Handle each field safely
        try {
            if (map.containsKey("id") && map.get("id") != null) {
                dto.setId(Long.valueOf(map.get("id").toString()));
            }
            if (map.containsKey("firstName")) {
                dto.setFirstName((String) map.get("firstName"));
            }
            if (map.containsKey("lastName")) {
                dto.setLastName((String) map.get("lastName"));
            }
            if (map.containsKey("email")) {
                dto.setEmail((String) map.get("email"));
            }
            if (map.containsKey("department")) {
                dto.setDepartment((String) map.get("department"));
            }
            if (map.containsKey("role")) {
                dto.setRole((String) map.get("role"));
            }
            if (map.containsKey("status")) {
                dto.setStatus((String) map.get("status"));
            }

            // Handle salary
            if (map.containsKey("salary") && map.get("salary") != null) {
                Object salaryObj = map.get("salary");
                if (salaryObj instanceof Number) {
                    dto.setSalary(((Number) salaryObj).doubleValue());
                } else if (salaryObj instanceof String) {
                    try {
                        dto.setSalary(Double.parseDouble((String) salaryObj));
                    } catch (NumberFormatException e) {
                        System.out.println("Error parsing salary: " + salaryObj);
                        dto.setSalary(0.0);
                    }
                }
            }

            // Handle dates
            if (map.containsKey("dateOfJoining") && map.get("dateOfJoining") != null) {
                try {
                    String dateStr = map.get("dateOfJoining").toString();
                    if (!dateStr.isEmpty()) {
                        dto.setDateOfJoining(java.time.LocalDate.parse(dateStr));
                    }
                } catch (Exception e) {
                    System.out.println("Error parsing dateOfJoining: " + map.get("dateOfJoining"));
                }
            }

            if (map.containsKey("dateOfBirth") && map.get("dateOfBirth") != null) {
                try {
                    String dateStr = map.get("dateOfBirth").toString();
                    if (!dateStr.isEmpty()) {
                        dto.setDateOfBirth(java.time.LocalDate.parse(dateStr));
                    }
                } catch (Exception e) {
                    System.out.println("Error parsing dateOfBirth: " + map.get("dateOfBirth"));
                    dto.setDateOfBirth(null);
                }
            }

        } catch (Exception e) {
            System.out.println("Error converting map to DTO: " + e.getMessage());
            e.printStackTrace();
        }

        System.out.println("Final DTO: " + dto);
        return dto;
    }
}