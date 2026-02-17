package com.drdl.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SafetyRequestDTO {
    private Long requestId;
    private String uniqueId;
    private String personnelNumber;
    private LocalDate dateOfRequest;
    private String safetyCoverage;
    private String directorate;
    private String division;
    private String integrationFacility;
    private String articleDetails;
    private String workDescription;
    private String activityInchargeName;
    private String activityInchargeOrg;
    private String activityInchargePhone;
    private String designation;
    private LocalDate activityFromDate;
    private LocalDate activityToDate;
    private String activitySchedule;
    private String ambulanceRequired;
    private String otherDetails;
    private String testBed;
    private String tarbClearance;
    private String referenceNo;
    private String testControllerName;
    private String testControllerDesignation;
    private LocalDate dateOfTest;
    private String testScheduleTime;
    private String workCentre;
    private String transportation;
    private String transScheduleTime;
    private String transIncharge;
    private String vehicleDetails;
    private String driverName;
    private String driverDesignation;
    private String driverAuth;
    private String headSfeedStatus;
    private String workAllocatedTo;
    private String gdTsStatus;
}
