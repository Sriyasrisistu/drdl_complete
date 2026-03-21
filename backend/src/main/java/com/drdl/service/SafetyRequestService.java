package com.drdl.service;

import com.drdl.dto.SafetyRequestDTO;
import com.drdl.model.SafetyRequest;
import com.drdl.repository.SafetyRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SafetyRequestService {
    
    private final SafetyRequestRepository repository;

    public SafetyRequestDTO createRequest(SafetyRequestDTO dto) {
        SafetyRequest request = mapDtoToEntity(dto);
        request.setDateOfRequest(LocalDate.now());
        request.setHeadSfeedStatus("SAVED");
        request.setGdTsStatus("SAVED");
        
        // Generate unique ID
        String uniqueId = generateUniqueId(dto.getPersonnelNumber());
        request.setUniqueId(uniqueId);
        
        SafetyRequest saved = repository.save(request);
        return mapEntityToDto(saved);
    }

    private String generateUniqueId(String personnelNumber) {
        LocalDate today = LocalDate.now();
        String datePrefix = today.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        // Get all requests created today
        List<SafetyRequest> todayRequests = repository.findByDateOfRequestBetween(today, today);

        // Use the highest existing numeric suffix for today so IDs remain unique
        // even when requests are deleted or created by multiple users.
        int nextSequence = todayRequests.stream()
            .map(SafetyRequest::getUniqueId)
            .filter(uniqueId -> uniqueId != null && uniqueId.startsWith(datePrefix) && uniqueId.length() > datePrefix.length())
            .map(uniqueId -> uniqueId.substring(datePrefix.length()))
            .mapToInt(suffix -> {
                try {
                    return Integer.parseInt(suffix);
                } catch (NumberFormatException ex) {
                    return 0;
                }
            })
            .max()
            .orElse(0) + 1;

        String suffix = String.format("%02d", nextSequence);
        return datePrefix + suffix;
    }

    public SafetyRequestDTO updateRequest(Long id, SafetyRequestDTO dto) {
        SafetyRequest request = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Request not found"));
        
        updateEntity(request, dto);
        SafetyRequest updated = repository.save(request);
        return mapEntityToDto(updated);
    }

    public SafetyRequestDTO getRequestById(Long id) {
        SafetyRequest request = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Request not found"));
        return mapEntityToDto(request);
    }

    public List<SafetyRequestDTO> getAllRequests() {
        return repository.findAllByOrderByDateOfRequestDescRequestIdDesc().stream()
            .map(this::mapEntityToDto)
            .collect(Collectors.toList());
    }

    public List<SafetyRequestDTO> getRequestsByCoverage(String coverage) {
        return repository.findBySafetyCoverage(coverage).stream()
            .map(this::mapEntityToDto)
            .collect(Collectors.toList());
    }

    public List<SafetyRequestDTO> getRequestsByPersonnelNumber(String personnelNumber) {
        return repository.findByPersonnelNumber(personnelNumber).stream()
            .sorted((r1, r2) -> r2.getDateOfRequest().compareTo(r1.getDateOfRequest()))
            .map(this::mapEntityToDto)
            .collect(Collectors.toList());
    }

    public void deleteRequest(Long id) {
        repository.deleteById(id);
    }

    public SafetyRequestDTO submitRequest(Long id) {
        SafetyRequest request = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setHeadSfeedStatus("SAVED");
        request.setGdTsStatus("SAVED");

        SafetyRequest updated = repository.save(request);
        return mapEntityToDto(updated);
    }

    public SafetyRequestDTO approveBySfeed(Long id) {
        SafetyRequest request = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setHeadSfeedStatus("APPROVED");

        SafetyRequest updated = repository.save(request);
        return mapEntityToDto(updated);
    }

    public SafetyRequestDTO approveByGdTs(Long id) {
        SafetyRequest request = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setGdTsStatus("APPROVED");

        SafetyRequest updated = repository.save(request);
        return mapEntityToDto(updated);
    }

    public List<SafetyRequestDTO> getRequestsForSfeedApproval() {
        return repository.findAllByOrderByDateOfRequestDescRequestIdDesc().stream()
            .map(this::mapEntityToDto)
            .collect(Collectors.toList());
    }

    public List<SafetyRequestDTO> getRequestsForGdTsApproval() {
        return repository.findAllByOrderByDateOfRequestDescRequestIdDesc().stream()
            .map(this::mapEntityToDto)
            .collect(Collectors.toList());
    }

    private SafetyRequest mapDtoToEntity(SafetyRequestDTO dto) {
        SafetyRequest entity = new SafetyRequest();
        entity.setRequestId(dto.getRequestId());
        entity.setUniqueId(dto.getUniqueId());
        entity.setPersonnelNumber(dto.getPersonnelNumber());
        entity.setSafetyCoverage(dto.getSafetyCoverage());
        entity.setDirectorate(dto.getDirectorate());
        entity.setDivision(dto.getDivision());
        entity.setIntegrationFacility(dto.getIntegrationFacility());
        entity.setArticleDetails(dto.getArticleDetails());
        entity.setWorkDescription(dto.getWorkDescription());
        entity.setActivityInchargeName(dto.getActivityInchargeName());
        entity.setActivityInchargeOrg(dto.getActivityInchargeOrg());
        entity.setActivityInchargePhone(dto.getActivityInchargePhone());
        entity.setDesignation(dto.getDesignation());
        entity.setActivityFromDate(dto.getActivityFromDate());
        entity.setActivityToDate(dto.getActivityToDate());
        entity.setActivitySchedule(dto.getActivitySchedule());
        entity.setAmbulanceRequired(dto.getAmbulanceRequired());
        entity.setOtherDetails(dto.getOtherDetails());
        entity.setTestBed(dto.getTestBed());
        entity.setTarbClearance(dto.getTarbClearance());
        entity.setReferenceNo(dto.getReferenceNo());
        entity.setTestControllerName(dto.getTestControllerName());
        entity.setTestControllerDesignation(dto.getTestControllerDesignation());
        entity.setDateOfTest(dto.getDateOfTest());
        entity.setTestScheduleTime(dto.getTestScheduleTime());
        entity.setWorkCentre(dto.getWorkCentre());
        entity.setTransportation(dto.getTransportation());
        entity.setTransScheduleTime(dto.getTransScheduleTime());
        entity.setTransIncharge(dto.getTransIncharge());
        entity.setVehicleDetails(dto.getVehicleDetails());
        entity.setDriverName(dto.getDriverName());
        entity.setDriverDesignation(dto.getDriverDesignation());
        entity.setDriverAuth(dto.getDriverAuth());
        entity.setHeadSfeedStatus(dto.getHeadSfeedStatus());
        entity.setWorkAllocatedTo(dto.getWorkAllocatedTo());
        entity.setGdTsStatus(dto.getGdTsStatus());
        return entity;
    }

    private SafetyRequestDTO mapEntityToDto(SafetyRequest entity) {
        SafetyRequestDTO dto = new SafetyRequestDTO();
        dto.setRequestId(entity.getRequestId());
        dto.setUniqueId(entity.getUniqueId());
        dto.setPersonnelNumber(entity.getPersonnelNumber());
        dto.setDateOfRequest(entity.getDateOfRequest());
        dto.setSafetyCoverage(entity.getSafetyCoverage());
        dto.setDirectorate(entity.getDirectorate());
        dto.setDivision(entity.getDivision());
        dto.setIntegrationFacility(entity.getIntegrationFacility());
        dto.setArticleDetails(entity.getArticleDetails());
        dto.setWorkDescription(entity.getWorkDescription());
        dto.setActivityInchargeName(entity.getActivityInchargeName());
        dto.setActivityInchargeOrg(entity.getActivityInchargeOrg());
        dto.setActivityInchargePhone(entity.getActivityInchargePhone());
        dto.setDesignation(entity.getDesignation());
        dto.setActivityFromDate(entity.getActivityFromDate());
        dto.setActivityToDate(entity.getActivityToDate());
        dto.setActivitySchedule(entity.getActivitySchedule());
        dto.setAmbulanceRequired(entity.getAmbulanceRequired());
        dto.setOtherDetails(entity.getOtherDetails());
        dto.setTestBed(entity.getTestBed());
        dto.setTarbClearance(entity.getTarbClearance());
        dto.setReferenceNo(entity.getReferenceNo());
        dto.setTestControllerName(entity.getTestControllerName());
        dto.setTestControllerDesignation(entity.getTestControllerDesignation());
        dto.setDateOfTest(entity.getDateOfTest());
        dto.setTestScheduleTime(entity.getTestScheduleTime());
        dto.setWorkCentre(entity.getWorkCentre());
        dto.setTransportation(entity.getTransportation());
        dto.setTransScheduleTime(entity.getTransScheduleTime());
        dto.setTransIncharge(entity.getTransIncharge());
        dto.setVehicleDetails(entity.getVehicleDetails());
        dto.setDriverName(entity.getDriverName());
        dto.setDriverDesignation(entity.getDriverDesignation());
        dto.setDriverAuth(entity.getDriverAuth());
        dto.setHeadSfeedStatus(entity.getHeadSfeedStatus());
        dto.setWorkAllocatedTo(entity.getWorkAllocatedTo());
        dto.setGdTsStatus(entity.getGdTsStatus());
        return dto;
    }

    private void updateEntity(SafetyRequest entity, SafetyRequestDTO dto) {
        if (dto.getPersonnelNumber() != null) entity.setPersonnelNumber(dto.getPersonnelNumber());
        if (dto.getSafetyCoverage() != null) entity.setSafetyCoverage(dto.getSafetyCoverage());
        if (dto.getDirectorate() != null) entity.setDirectorate(dto.getDirectorate());
        if (dto.getDivision() != null) entity.setDivision(dto.getDivision());
        if (dto.getIntegrationFacility() != null) entity.setIntegrationFacility(dto.getIntegrationFacility());
        if (dto.getArticleDetails() != null) entity.setArticleDetails(dto.getArticleDetails());
        if (dto.getWorkDescription() != null) entity.setWorkDescription(dto.getWorkDescription());
        if (dto.getActivityInchargeName() != null) entity.setActivityInchargeName(dto.getActivityInchargeName());
        if (dto.getActivityInchargeOrg() != null) entity.setActivityInchargeOrg(dto.getActivityInchargeOrg());
        if (dto.getActivityInchargePhone() != null) entity.setActivityInchargePhone(dto.getActivityInchargePhone());
        if (dto.getDesignation() != null) entity.setDesignation(dto.getDesignation());
        if (dto.getActivityFromDate() != null) entity.setActivityFromDate(dto.getActivityFromDate());
        if (dto.getActivityToDate() != null) entity.setActivityToDate(dto.getActivityToDate());
        if (dto.getActivitySchedule() != null) entity.setActivitySchedule(dto.getActivitySchedule());
        if (dto.getAmbulanceRequired() != null) entity.setAmbulanceRequired(dto.getAmbulanceRequired());
        if (dto.getOtherDetails() != null) entity.setOtherDetails(dto.getOtherDetails());
        if (dto.getTestBed() != null) entity.setTestBed(dto.getTestBed());
        if (dto.getTarbClearance() != null) entity.setTarbClearance(dto.getTarbClearance());
        if (dto.getReferenceNo() != null) entity.setReferenceNo(dto.getReferenceNo());
        if (dto.getTestControllerName() != null) entity.setTestControllerName(dto.getTestControllerName());
        if (dto.getTestControllerDesignation() != null) entity.setTestControllerDesignation(dto.getTestControllerDesignation());
        if (dto.getDateOfTest() != null) entity.setDateOfTest(dto.getDateOfTest());
        if (dto.getTestScheduleTime() != null) entity.setTestScheduleTime(dto.getTestScheduleTime());
        if (dto.getWorkCentre() != null) entity.setWorkCentre(dto.getWorkCentre());
        if (dto.getTransportation() != null) entity.setTransportation(dto.getTransportation());
        if (dto.getTransScheduleTime() != null) entity.setTransScheduleTime(dto.getTransScheduleTime());
        if (dto.getTransIncharge() != null) entity.setTransIncharge(dto.getTransIncharge());
        if (dto.getVehicleDetails() != null) entity.setVehicleDetails(dto.getVehicleDetails());
        if (dto.getDriverName() != null) entity.setDriverName(dto.getDriverName());
        if (dto.getDriverDesignation() != null) entity.setDriverDesignation(dto.getDriverDesignation());
        if (dto.getDriverAuth() != null) entity.setDriverAuth(dto.getDriverAuth());
        if (dto.getHeadSfeedStatus() != null) entity.setHeadSfeedStatus(dto.getHeadSfeedStatus());
        if (dto.getWorkAllocatedTo() != null) entity.setWorkAllocatedTo(dto.getWorkAllocatedTo());
        if (dto.getGdTsStatus() != null) entity.setGdTsStatus(dto.getGdTsStatus());
    }
}
