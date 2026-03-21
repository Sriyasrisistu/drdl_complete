package com.drdl.service;

import com.drdl.dto.ApproverDTO;
import com.drdl.dto.ApproverLoginRequestDTO;
import com.drdl.dto.ApproverLoginResponseDTO;
import com.drdl.model.ApproverUser;
import com.drdl.repository.ApproverUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ApproverAuthService {

    private final ApproverUserRepository approverUserRepository;

    public ApproverLoginResponseDTO login(ApproverLoginRequestDTO request) {
        Optional<ApproverUser> approver = approverUserRepository.findByLoginId(request.getLoginId());

        if (approver.isEmpty()) {
            return new ApproverLoginResponseDTO(false, "Approver not found", null);
        }

        ApproverUser user = approver.get();
        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            return new ApproverLoginResponseDTO(false, "Approver account is inactive", null);
        }

        if (!user.getPassword().equals(request.getPassword())) {
            return new ApproverLoginResponseDTO(false, "Invalid credentials", null);
        }

        return new ApproverLoginResponseDTO(true, "Login successful", mapToDto(user));
    }

    private ApproverDTO mapToDto(ApproverUser user) {
        return new ApproverDTO(
            user.getApproverId(),
            user.getLoginId(),
            user.getApproverName(),
            user.getDesignation(),
            user.getRoleCode(),
            user.getStatus()
        );
    }
}
