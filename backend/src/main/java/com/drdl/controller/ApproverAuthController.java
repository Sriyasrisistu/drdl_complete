package com.drdl.controller;

import com.drdl.dto.ApproverLoginRequestDTO;
import com.drdl.dto.ApproverLoginResponseDTO;
import com.drdl.service.ApproverAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/approvers")
@RequiredArgsConstructor
public class ApproverAuthController {

    private final ApproverAuthService approverAuthService;

    @PostMapping("/login")
    public ResponseEntity<ApproverLoginResponseDTO> login(@RequestBody ApproverLoginRequestDTO request) {
        return ResponseEntity.ok(approverAuthService.login(request));
    }
}
