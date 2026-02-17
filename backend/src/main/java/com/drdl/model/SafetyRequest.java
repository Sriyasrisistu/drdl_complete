package com.drdl.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "SAFETY_REQUEST")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SafetyRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "REQUEST_ID")
    private Long requestId;

    @Column(name = "UNIQUE_ID", length = 12, unique = true)
    private String uniqueId;

    @Column(name = "PERS_NO", length = 6, nullable = false)
    private String personnelNumber;

    @Column(name = "DATE_OF_REQUEST")
    private LocalDate dateOfRequest;

    @Column(name = "SAFETY_COVERAGE", length = 50, nullable = false)
    private String safetyCoverage;

    @Column(name = "DIRECTORATE", length = 100)
    private String directorate;

    @Column(name = "DIVISION", length = 100)
    private String division;

    @Column(name = "INTEGRATION_FAC", length = 100)
    private String integrationFacility;

    @Column(name = "ARTICLE_DETAILS", length = 500)
    private String articleDetails;

    @Column(name = "WORK_DESCRIPTION", length = 500)
    private String workDescription;

    @Column(name = "ACT_INCHARGE_NAME", length = 100)
    private String activityInchargeName;

    @Column(name = "ACT_INCHARGE_ORG", length = 100)
    private String activityInchargeOrg;

    @Column(name = "ACT_INCHARGE_PHONE", length = 15)
    private String activityInchargePhone;

    @Column(name = "DESIGNATION", length = 100)
    private String designation;

    @Column(name = "ACTIVITY_FROM_DATE")
    private LocalDate activityFromDate;

    @Column(name = "ACTIVITY_TO_DATE")
    private LocalDate activityToDate;

    @Column(name = "ACTIVITY_SCHEDULE", length = 3)
    private String activitySchedule;

    @Lob
    @Column(name = "ACTIVITY_PDF")
    private byte[] activityPdf;

    @Column(name = "AMBULANCE_REQUIRED", length = 3)
    private String ambulanceRequired;

    @Column(name = "OTHER_DETAILS", length = 500)
    private String otherDetails;

    @Column(name = "TEST_BED", length = 100)
    private String testBed;

    @Column(name = "TARB_CLEARANCE", length = 100)
    private String tarbClearance;

    @Column(name = "REFERENCE_NO", length = 100)
    private String referenceNo;

    @Column(name = "TEST_CTRL_NAME", length = 100)
    private String testControllerName;

    @Column(name = "TEST_CTRL_DESIG", length = 100)
    private String testControllerDesignation;

    @Column(name = "DATE_OF_TEST")
    private LocalDate dateOfTest;

    @Column(name = "TEST_SCHEDULE_TIME")
    private String testScheduleTime;

    @Column(name = "WORK_CENTRE", length = 100)
    private String workCentre;

    @Column(name = "TRANSPORTATION", length = 100)
    private String transportation;

    @Column(name = "TRANS_SCHEDULE_TIME")
    private String transScheduleTime;

    @Column(name = "TRANS_INCHARGE", length = 100)
    private String transIncharge;

    @Column(name = "VEHICLE_DETAILS", length = 100)
    private String vehicleDetails;

    @Column(name = "DRIVER_NAME", length = 100)
    private String driverName;

    @Column(name = "DRIVER_DESIG", length = 100)
    private String driverDesignation;

    @Column(name = "DRIVER_AUTH", length = 3)
    private String driverAuth;

    @Column(name = "HEAD_SFEED_STATUS", length = 20)
    private String headSfeedStatus;

    @Column(name = "WORK_ALLOCATED_TO", length = 100)
    private String workAllocatedTo;

    @Column(name = "GD_TS_STATUS", length = 20)
    private String gdTsStatus;
}
