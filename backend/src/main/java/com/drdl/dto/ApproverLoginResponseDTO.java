package com.drdl.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApproverLoginResponseDTO {
    private boolean success;
    private String message;
    private ApproverDTO approver;
}
