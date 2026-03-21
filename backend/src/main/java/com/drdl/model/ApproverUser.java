package com.drdl.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "APPROVER_USERS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApproverUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "APPROVER_ID")
    private Long approverId;

    @Column(name = "LOGIN_ID", length = 50, nullable = false, unique = true)
    private String loginId;

    @Column(name = "PASSWORD", length = 255, nullable = false)
    private String password;

    @Column(name = "APPROVER_NAME", length = 100, nullable = false)
    private String approverName;

    @Column(name = "DESIGNATION", length = 100)
    private String designation;

    @Column(name = "ROLE_CODE", length = 20, nullable = false)
    private String roleCode;

    @Column(name = "STATUS", length = 20, nullable = false)
    private String status;
}
