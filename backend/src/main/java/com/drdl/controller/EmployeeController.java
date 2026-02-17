package com.drdl.controller;

import com.drdl.dto.EmployeeDTO;
import com.drdl.dto.LoginRequestDTO;
import com.drdl.dto.LoginResponseDTO;
import com.drdl.model.Employee;
import com.drdl.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {
    
    @Autowired
    private EmployeeService employeeService;

    /**
     * Login endpoint
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        LoginResponseDTO response = employeeService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all active employees (for Activity Incharge dropdown)
     */
    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getAllActiveEmployees() {
        List<EmployeeDTO> employees = employeeService.getAllActiveEmployees();
        return ResponseEntity.ok(employees);
    }

    /**
     * Get employee by personnel number
     */
    @GetMapping("/{personnelNo}")
    public ResponseEntity<EmployeeDTO> getEmployeeByPersonnelNo(@PathVariable String personnelNo) {
        Optional<EmployeeDTO> employee = employeeService.getEmployeeByPersonnelNo(personnelNo);
        return employee.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Create new employee
     */
    @PostMapping
    public ResponseEntity<EmployeeDTO> createEmployee(@RequestBody Employee employee) {
        EmployeeDTO created = employeeService.createEmployee(employee);
        return ResponseEntity.ok(created);
    }

    /**
     * Update employee
     */
    @PutMapping("/{empId}")
    public ResponseEntity<EmployeeDTO> updateEmployee(@PathVariable Long empId, @RequestBody Employee employeeDetails) {
        EmployeeDTO updated = employeeService.updateEmployee(empId, employeeDetails);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Delete employee
     */
    @DeleteMapping("/{empId}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Long empId) {
        if (employeeService.deleteEmployee(empId)) {
            return ResponseEntity.ok("Employee deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
}
