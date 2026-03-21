package com.drdl.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApproverDTO {
    private Long approverId;
    private String loginId;
    private String approverName;
    private String designation;
    private String roleCode;
    private String status;
}
