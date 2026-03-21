import React, { useState, useEffect, useRef } from "react";
import ApiService from "../services/apiService";
import "../styles/SafetyFireRequestForm.css";

import IntegrationSection from "./IntegrationSection";
import StaticTestSection from "./StaticTestSection";
import ThermostructuralSection from "./ThermostructuralSection";
import PressureTestSection from "./PressureTestSection";
import GRTSection from "./GRTSection";
import AlignmentInspectionSection from "./AlignmentInspectionSection";
import RadiographySection from "./RadiographySection";
import HydrobasinSection from "./HydrobasinSection";
import TransportationSection from "./TransportationSection";
import OtherSection from "./OtherSection";
import GuidelinesModal from "./GuidelinesModal";
import RequestsTable from "./RequestsTable";
import LoginForm from "./LoginForm";

const EMPLOYEE_SESSION_KEY = "drdl_logged_in_employee";

const BASE_FORM_DATA = {
  personnelNumber: "",
  safetyCoverage: "",
  directorate: "DRDL",
  division: "Engineering",
  incharge: "",
  activityInchargeName: "",
  activityInchargeOrg: "",
  activityInchargePhone: "",
};

export default function SafetyFireRequestForm() {
  const [loggedInEmployee, setLoggedInEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [coverageType, setCoverageType] = useState("");
  const [formData, setFormData] = useState(BASE_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [declared, setDeclared] = useState(false);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const [refreshTable, setRefreshTable] = useState(0);
  const formRef = useRef(null);

  useEffect(() => {
    const savedEmployee = window.sessionStorage.getItem(EMPLOYEE_SESSION_KEY);
    if (!savedEmployee) {
      return;
    }

    try {
      setLoggedInEmployee(JSON.parse(savedEmployee));
    } catch (error) {
      console.error("Failed to restore employee session:", error);
      window.sessionStorage.removeItem(EMPLOYEE_SESSION_KEY);
    }
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await ApiService.getAllEmployees();
        setEmployees(response);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (loggedInEmployee) {
      setFormData((prev) => ({
        ...prev,
        personnelNumber: loggedInEmployee.personnelNo,
        directorate: loggedInEmployee.employeeName,
      }));
    }
  }, [loggedInEmployee]);

  const resetForm = () => {
    formRef.current?.reset();
    setFormData({
      ...BASE_FORM_DATA,
      personnelNumber: loggedInEmployee?.personnelNo || "",
      directorate: loggedInEmployee?.employeeName || "DRDL",
    });
    setCoverageType("");
    setDeclared(false);
  };

  const handleLoginSuccess = (employee) => {
    window.sessionStorage.setItem(EMPLOYEE_SESSION_KEY, JSON.stringify(employee));
    setLoggedInEmployee(employee);
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(EMPLOYEE_SESSION_KEY);
    setLoggedInEmployee(null);
    setFormData(BASE_FORM_DATA);
    setCoverageType("");
    setDeclared(false);
    setMessage("");
  };

  const handleCoverageChange = (e) => {
    const value = e.target.value;
    setCoverageType(value);
    setFormData((prev) => ({ ...prev, safetyCoverage: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buildRequestPayload = () => {
    const serialized = {};

    if (formRef.current) {
      const formValues = new FormData(formRef.current);
      formValues.forEach((value, key) => {
        if (typeof value !== "string") {
          return;
        }

        const trimmed = value.trim();
        if (trimmed) {
          serialized[key] = trimmed;
        }
      });
    }

    if (serialized.transportationFrom || serialized.transportationTo) {
      serialized.transportation = `From: ${serialized.transportationFrom || "N/A"} | To: ${serialized.transportationTo || "N/A"}`;
    }

    if (serialized.transInchargeName || serialized.transInchargePhone) {
      serialized.transIncharge = [serialized.transInchargeName, serialized.transInchargePhone]
        .filter(Boolean)
        .join(" / ");
    }

    if (serialized.vehicleType || serialized.vehicleNumber) {
      serialized.vehicleDetails = [serialized.vehicleType, serialized.vehicleNumber]
        .filter(Boolean)
        .join(" / ");
    }

    if (serialized.tarbReason) {
      serialized.otherDetails = [serialized.otherDetails, `TARB Reason: ${serialized.tarbReason}`]
        .filter(Boolean)
        .join(" | ");
    }

    if (serialized.activityScheduleReason) {
      serialized.otherDetails = [serialized.otherDetails, `Activity Schedule Reason: ${serialized.activityScheduleReason}`]
        .filter(Boolean)
        .join(" | ");
    }

    if (serialized.ambulanceReason) {
      serialized.otherDetails = [serialized.otherDetails, `Ambulance Reason: ${serialized.ambulanceReason}`]
        .filter(Boolean)
        .join(" | ");
    }

    if (serialized.driverAuthReason) {
      serialized.otherDetails = [serialized.otherDetails, `Driver Authorization Reason: ${serialized.driverAuthReason}`]
        .filter(Boolean)
        .join(" | ");
    }

    delete serialized.transportationFrom;
    delete serialized.transportationTo;
    delete serialized.transInchargeName;
    delete serialized.transInchargePhone;
    delete serialized.vehicleType;
    delete serialized.vehicleNumber;
    delete serialized.drdlActivityIncharge;
    delete serialized.incharge;
    delete serialized.declaration;
    delete serialized.tarbReason;
    delete serialized.activityScheduleReason;
    delete serialized.ambulanceReason;
    delete serialized.driverAuthReason;

    return {
      ...formData,
      ...serialized,
      safetyCoverage: coverageType,
    };
  };

  const validateBaseFields = () => {
    if (!formData.personnelNumber || !formData.safetyCoverage) {
      setMessage("Error: Personnel Number and Safety Coverage are required");
      return false;
    }
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateBaseFields()) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await ApiService.createRequest(buildRequestPayload());
      setMessage("Request saved successfully! ID: " + response.uniqueId);
      resetForm();
      setRefreshTable((prev) => prev + 1);
    } catch (error) {
      setMessage(`Error: ${error.message || "Save failed"}`);
    } finally {
      setLoading(false);
    }
  };

  if (!loggedInEmployee) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="safety-form-container">
      <div className="form-header">
        <div className="header-title">
          <h1 className="form-title">SAFETY & FIRE COVERAGE REQUEST FORM</h1>
          <p className="form-subtitle">Defence Research and Development Laboratory</p>
        </div>
        <div className="user-info">
          <p><strong>{loggedInEmployee.employeeName}</strong></p>
          <p className="emp-details">{loggedInEmployee.designation}</p>
          <p className="emp-details">{loggedInEmployee.directorate}</p>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes("Error") ? "error" : "success"}`}>
          {message}
        </div>
      )}

      <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
        <div className="form-section">
          <label className="form-label">Type of Safety Coverage *</label>
          <select
            className="form-select"
            value={coverageType}
            onChange={handleCoverageChange}
            required
          >
            <option value="">Select Type</option>
            <option value="integration">INTEGRATION</option>
            <option value="static">STATIC TEST</option>
            <option value="thermostructural">THERMOSTRUCTURAL</option>
            <option value="pressure">PRESSURE TEST</option>
            <option value="grt">GRT</option>
            <option value="alignment">ALIGNMENT INSPECTION</option>
            <option value="radiography">RADIOGRAPHY</option>
            <option value="hydrobasin">HYDROBASIN</option>
            <option value="transportation">TRANSPORTATION</option>
            <option value="other">ANY OTHER (Specify)</option>
          </select>
        </div>

        {coverageType === "integration" && (
          <IntegrationSection formData={formData} handleInputChange={handleInputChange} employees={employees} />
        )}
        {coverageType === "static" && (
          <StaticTestSection formData={formData} handleInputChange={handleInputChange} />
        )}
        {coverageType === "thermostructural" && (
          <ThermostructuralSection formData={formData} handleInputChange={handleInputChange} />
        )}
        {coverageType === "pressure" && (
          <PressureTestSection formData={formData} handleInputChange={handleInputChange} />
        )}
        {coverageType === "grt" && (
          <GRTSection formData={formData} handleInputChange={handleInputChange} />
        )}
        {coverageType === "alignment" && (
          <AlignmentInspectionSection formData={formData} handleInputChange={handleInputChange} />
        )}
        {coverageType === "radiography" && (
          <RadiographySection formData={formData} handleInputChange={handleInputChange} />
        )}
        {coverageType === "hydrobasin" && (
          <HydrobasinSection formData={formData} handleInputChange={handleInputChange} />
        )}
        {coverageType === "transportation" && (
          <TransportationSection formData={formData} handleInputChange={handleInputChange} />
        )}
        {coverageType === "other" && (
          <OtherSection formData={formData} handleInputChange={handleInputChange} />
        )}

        <div className="declaration-box">
          <input
            type="checkbox"
            id="declaration"
            checked={declared}
            onChange={(e) => setDeclared(e.target.checked)}
            required
          />
          <label htmlFor="declaration" className="form-label">
            I will provide suitable PPEs to all involved in hazardous activities
            and will be held responsible for violation of safety guidelines.
            <span
              className="readmore"
              onClick={() => setShowGuidelinesModal(true)}
              style={{ cursor: "pointer" }}
            >
              READ MORE
            </span>
            <br />
            I will inform safety division telephonically before commencement of activity. <span style={{ color: "red" }}>*</span>
          </label>
        </div>

        {/*
        <details className="approvals-section">
          <summary className="approvals-summary">Approval Workflow</summary>
          <div className="approvals-container">
            <div className="approvals-left">
              <h3>Head, SFEED</h3>
              <p>Recommended / Not Recommended</p>
              <h3>Work Allocated To</h3>
              <h3>GD-T&S</h3>
              <p>Approved / Not Approved</p>
            </div>
            <div className="approvals-right">
              <label>Name & Designation</label>
              <input type="text" className="form-input" disabled placeholder="To be filled by approver" />
              <label>Contact No.</label>
              <input type="text" className="form-input" disabled placeholder="To be filled by approver" />
            </div>
          </div>
        </details>
        */}

        <div className="button-group">
          <button type="button" className="btn save-btn" onClick={handleSave} disabled={loading}>
            SAVE
          </button>
        </div>
      </form>

      <GuidelinesModal isOpen={showGuidelinesModal} onClose={() => setShowGuidelinesModal(false)} />

      <RequestsTable
        personnelNumber={formData.personnelNumber}
        refresh={refreshTable}
        onRequestSelect={() => {}}
      />
    </div>
  );
}
