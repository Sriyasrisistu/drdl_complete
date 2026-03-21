package com.drdl.repository;

import com.drdl.model.SafetyRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface SafetyRequestRepository extends JpaRepository<SafetyRequest, Long> {
    List<SafetyRequest> findBySafetyCoverage(String safetyCoverage);
    List<SafetyRequest> findByPersonnelNumber(String personnelNumber);
    List<SafetyRequest> findByDateOfRequestBetween(LocalDate startDate, LocalDate endDate);
    List<SafetyRequest> findAllByOrderByDateOfRequestDescRequestIdDesc();
    List<SafetyRequest> findByGdTsStatusOrderByDateOfRequestDescRequestIdDesc(String status);
    
    @Query("SELECT s FROM SafetyRequest s WHERE s.headSfeedStatus = :status")
    List<SafetyRequest> findByApprovalStatus(@Param("status") String status);
}
