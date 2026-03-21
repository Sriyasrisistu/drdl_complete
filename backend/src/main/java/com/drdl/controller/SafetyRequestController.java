package com.drdl.controller;

import com.drdl.dto.SafetyRequestDTO;
import com.drdl.service.SafetyRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/safety-requests")
@RequiredArgsConstructor
public class SafetyRequestController {
    
    private final SafetyRequestService service;

    @PostMapping
    public ResponseEntity<SafetyRequestDTO> createRequest(@RequestBody SafetyRequestDTO dto) {
        SafetyRequestDTO created = service.createRequest(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SafetyRequestDTO> updateRequest(@PathVariable Long id, 
                                                          @RequestBody SafetyRequestDTO dto) {
        SafetyRequestDTO updated = service.updateRequest(id, dto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SafetyRequestDTO> getRequest(@PathVariable Long id) {
        SafetyRequestDTO dto = service.getRequestById(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<SafetyRequestDTO>> getAllRequests() {
        List<SafetyRequestDTO> requests = service.getAllRequests();
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/approval/sfeed")
    public ResponseEntity<List<SafetyRequestDTO>> getRequestsForSfeedApproval() {
        return ResponseEntity.ok(service.getRequestsForSfeedApproval());
    }

    @GetMapping("/approval/gdts")
    public ResponseEntity<List<SafetyRequestDTO>> getRequestsForGdTsApproval() {
        return ResponseEntity.ok(service.getRequestsForGdTsApproval());
    }

    @GetMapping("/coverage/{coverage}")
    public ResponseEntity<List<SafetyRequestDTO>> getRequestsByCoverage(@PathVariable String coverage) {
        List<SafetyRequestDTO> requests = service.getRequestsByCoverage(coverage);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/personnel/{personnelNumber}")
    public ResponseEntity<List<SafetyRequestDTO>> getRequestsByPersonnelNumber(@PathVariable String personnelNumber) {
        List<SafetyRequestDTO> requests = service.getRequestsByPersonnelNumber(personnelNumber);
        return ResponseEntity.ok(requests);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        service.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/submit")
    public ResponseEntity<SafetyRequestDTO> submitRequest(@PathVariable Long id) {
        return ResponseEntity.ok(service.submitRequest(id));
    }

    @PutMapping("/{id}/approval/sfeed")
    public ResponseEntity<SafetyRequestDTO> approveBySfeed(@PathVariable Long id) {
        return ResponseEntity.ok(service.approveBySfeed(id));
    }

    @PutMapping("/{id}/approval/gdts")
    public ResponseEntity<SafetyRequestDTO> approveByGdTs(@PathVariable Long id) {
        return ResponseEntity.ok(service.approveByGdTs(id));
    }
}
