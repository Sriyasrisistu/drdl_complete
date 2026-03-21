package com.drdl.repository;

import com.drdl.model.ApproverUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApproverUserRepository extends JpaRepository<ApproverUser, Long> {
    Optional<ApproverUser> findByLoginId(String loginId);
}
