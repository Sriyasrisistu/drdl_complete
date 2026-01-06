import React, { useState } from "react";
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

export default function SafetyFireRequestForm() {
  const [coverageType, setCoverageType] = useState("");
  const [formData, setFormData] = useState({
    personnelNumber: "",
    safetyCoverage: "",
    directorate: "DRDL",
    division: "Engineering",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [declared, setDeclared] = useState(false);

  const handleCoverageChange = (e) => {
    const value = e.target.value;
    setCoverageType(value);
    setFormData({ ...formData, safetyCoverage: value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!declared) {
      setMessage("✗ Error: You must accept the safety declaration");
      return;
    }

    if (!formData.personnelNumber || !formData.safetyCoverage) {
      setMessage("✗ Error: Personnel Number and Safety Coverage are required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await ApiService.createRequest(formData);
      setMessage("✓ Request submitted successfully! ID: " + response.requestId);
      console.log("Response:", response);

      // Reset form
      setFormData({
        personnelNumber: "",
        safetyCoverage: "",
        directorate: "DRDL",
        division: "Engineering",
      });
      setCoverageType("");
      setDeclared(false);
    } catch (error) {
      setMessage(`✗ Error: ${error.message || "Submission failed"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="safety-form-container">
      <h1 className="form-title">SAFETY FIRE REQUEST FORM</h1>

      {message && (
        <div className={`message ${message.includes("Error") ? "error" : "success"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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

        {/* PERSONNEL NUMBER */}
        <div className="form-section">
          <label className="form-label">Personnel Number *</label>
          <input
            type="text"
            name="personnelNumber"
            className="form-input"
            placeholder="Enter Personnel Number"
            value={formData.personnelNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Render section based on coverage type */}
        {coverageType === "integration" && (
          <IntegrationSection formData={formData} handleInputChange={handleInputChange} />
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
            <span className="readmore"> READ MORE</span>
            <br />
            I will inform safety division telephonically before commencement of activity.{" "}
            <span style={{ color: "red" }}>*</span>
          </label>
        </div>

        {/* APPROVALS */}
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

        {/* BUTTONS */}
        <div className="button-group">
          <button type="button" className="btn save-btn" disabled={loading}>
            SAVE
          </button>
          <button type="submit" className="btn send-btn" disabled={loading}>
            {loading ? "SUBMITTING..." : "SEND TO HEAD, SFEED"}
          </button>
        </div>
      </form>
    </div>
  );
}
