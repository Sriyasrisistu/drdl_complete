import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export default function EditRequestPage() {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState(null);
  const [coverageType, setCoverageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [declared, setDeclared] = useState(false);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const formRef = useRef(null);

  // Fetch employees and request data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesResponse, requestResponse] = await Promise.all([
          ApiService.getAllEmployees(),
          ApiService.getRequest(requestId)
        ]);
        setEmployees(employeesResponse);
        setFormData(requestResponse);
        setCoverageType(requestResponse.safetyCoverage);
        setDeclared(true); // Mark as declared since it's already submitted
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setMessage("✗ Error: Failed to load request data");
      }
    };
    fetchData();
  }, [requestId]);

  useEffect(() => {
    if (!formData || !formRef.current) {
      return;
    }

    const form = formRef.current;

    const setFieldValue = (name, value) => {
      if (value === null || value === undefined || value === "") {
        return;
      }

      const elements = form.querySelectorAll(`[name="${name}"]`);
      elements.forEach((element) => {
        if (element.type === "radio" || element.type === "checkbox") {
          element.checked = String(element.value) === String(value);
        } else if (element.type !== "file") {
          element.value = value;
        }

        element.dispatchEvent(new Event("input", { bubbles: true }));
        element.dispatchEvent(new Event("change", { bubbles: true }));
      });
    };

    Object.entries(formData).forEach(([key, value]) => {
      setFieldValue(key, value);
    });

    if (formData.transportation) {
      const match = formData.transportation.match(/From:\s*(.*?)\s*\|\s*To:\s*(.*)/);
      if (match) {
        setFieldValue("transportationFrom", match[1]);
        setFieldValue("transportationTo", match[2]);
      }
    }

    if (formData.transIncharge) {
      const [name, phone] = formData.transIncharge.split(" / ");
      setFieldValue("transInchargeName", name);
      setFieldValue("transInchargePhone", phone);
    }

    if (formData.vehicleDetails) {
      const [vehicleType, vehicleNumber] = formData.vehicleDetails.split(" / ");
      setFieldValue("vehicleType", vehicleType);
      setFieldValue("vehicleNumber", vehicleNumber);
    }

    if (formData.activityInchargeName) {
      const matchingEmployee = employees.find(
        (emp) =>
          emp.employeeName === formData.activityInchargeName ||
          (
            String(emp.phone || "") === String(formData.activityInchargePhone || "") &&
            emp.designation === formData.designation
          )
      );

      setFieldValue("incharge", matchingEmployee ? "DRDL" : "Other");
    }
  }, [formData, coverageType, employees]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCoverageChange = (e) => {
    const value = e.target.value;
    setCoverageType(value);
    setFormData(prev => ({
      ...prev,
      safetyCoverage: value
    }));
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

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!formData.personnelNumber || !formData.safetyCoverage) {
      setMessage("✗ Error: Personnel Number and Safety Coverage are required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await ApiService.updateRequest(requestId, buildRequestPayload());
      setMessage("✓ Request updated successfully!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setMessage(`✗ Error: ${error.message || "Update failed"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (!formData) {
    return <div className="safety-form-container loading">Loading request...</div>;
  }

  return (
    <div className="safety-form-container">
      <div className="form-header">
        <div className="header-title">
          <h1 className="form-title">EDIT SAFETY & FIRE COVERAGE REQUEST</h1>
          <p className="form-subtitle">Defence Research and Development Laboratory</p>
        </div>
        <button onClick={handleCancel} className="btn-back-to-home">← Back to Home</button>
      </div>

      {message && (
        <div className={`message ${message.includes("Error") ? "error" : "success"}`}>
          {message}
        </div>
      )}

      <form ref={formRef} onSubmit={handleUpdate}>
        {/* DIRECTORATE - READ-ONLY */}
        <div className="form-section">
          <label className="form-label">Directorate (Person Name) *</label>
          <input
            type="text"
            name="directorate"
            value={formData.directorate}
            className="form-input"
            readOnly
            title="This field is read-only. It displays the person name associated with the request."
            disabled
          />
          <small style={{ color: '#6B7280', fontStyle: 'italic' }}>Read-only field</small>
        </div>

        {/* TYPE OF SAFETY COVERAGE */}
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

        {/* Render section based on coverage type */}
        {coverageType === "integration" && (
          <IntegrationSection
            formData={formData}
            handleInputChange={handleInputChange}
            employees={employees}
          />
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

        {/* DECLARATION */}
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
            I will inform safety division telephonically before commencement of activity.{" "}
            <span style={{ color: "red" }}>*</span>
          </label>
        </div>

        {/* APPROVALS
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

        {/* BUTTONS */}
        <div className="button-group">
          <button type="button" className="btn save-btn" onClick={handleCancel} disabled={loading}>
            CANCEL
          </button>
          <button type="submit" className="btn send-btn" disabled={loading}>
            {loading ? "UPDATING..." : "UPDATE REQUEST"}
          </button>
        </div>
      </form>

      <GuidelinesModal 
        isOpen={showGuidelinesModal} 
        onClose={() => setShowGuidelinesModal(false)} 
      />
    </div>
  );
}
