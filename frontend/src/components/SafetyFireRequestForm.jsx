import React, { useState, useEffect } from "react";
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

const BASE_FORM_DATA = {
  personnelNumber: "",
  safetyCoverage: "",
  directorate: "DRDL",
  division: "Engineering",
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
    setFormData({
      ...BASE_FORM_DATA,
      personnelNumber: loggedInEmployee?.personnelNo || "",
      directorate: loggedInEmployee?.employeeName || "DRDL",
    });
    setCoverageType("");
    setDeclared(false);
  };

  const handleLoginSuccess = (employee) => {
    setLoggedInEmployee(employee);
  };

  const handleLogout = () => {
    setLoggedInEmployee(null);
    setFormData(BASE_FORM_DATA);
    setCoverageType("");
    setDeclared(false);
    setMessage("");
  };

  const handleCoverageChange = (e) => {
    const value = e.target.value;
    setCoverageType(value);
    setFormData({ ...formData, safetyCoverage: value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePrintForm = () => {
    const printWindow = window.open("", "", "height=800,width=1000");

    const coverageLabel = {
      integration: "INTEGRATION",
      static: "STATIC TEST",
      thermostructural: "THERMOSTRUCTURAL",
      pressure: "PRESSURE TEST",
      grt: "GRT",
      alignment: "ALIGNMENT INSPECTION",
      radiography: "RADIOGRAPHY",
      hydrobasin: "HYDROBASIN",
      transportation: "TRANSPORTATION",
      other: "ANY OTHER",
    }[coverageType] || "N/A";

    const labels = {
      personnelNumber: "Personnel Number",
      safetyCoverage: "Safety Coverage",
      directorate: "Directorate",
      division: "Division",
      integrationFacility: "Integration Facility",
      articleDetails: "Article Details",
      workDescription: "Work Description",
      activityInchargeName: "Activity Incharge Name",
      activityInchargeOrg: "Activity Incharge Organization",
      activityInchargePhone: "Activity Incharge Phone",
      designation: "Designation",
      activityFromDate: "Activity From Date",
      activityToDate: "Activity To Date",
      activitySchedule: "Activity Schedule",
      ambulanceRequired: "Ambulance Required",
      otherDetails: "Other Details",
      testBed: "Test Bed",
      tarbClearance: "TARB Clearance",
      referenceNo: "Reference Number",
      testControllerName: "Test Controller Name",
      testControllerDesignation: "Test Controller Designation",
      dateOfTest: "Date of Test",
      testScheduleTime: "Test Schedule Time",
      workCentre: "Work Centre",
      transportation: "Transportation",
      transScheduleTime: "Transport Schedule Time",
      transIncharge: "Transport Incharge",
      vehicleDetails: "Vehicle Details",
      driverName: "Driver Name",
      driverDesignation: "Driver Designation",
      driverAuth: "Driver Authorized",
    };

    const printableRows = Object.entries(formData)
      .filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== "")
      .map(([key, value]) => {
        const label = labels[key] || key;
        const displayValue = key === "safetyCoverage" ? coverageLabel : value;
        return `<tr><td style="border:1px solid #d1d5db; padding:8px; width:35%;"><strong>${label}</strong></td><td style="border:1px solid #d1d5db; padding:8px;">${displayValue}</td></tr>`;
      })
      .join("");

    const content = `
      <div style="padding: 20px; font-family: Arial, sans-serif; color: #333;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #064E3B; padding-bottom: 15px;">
          <h1 style="margin: 0 0 5px 0; color: #064E3B;">SAFETY & FIRE COVERAGE REQUEST FORM</h1>
          <p style="margin: 5px 0; color: #6B7280; font-size: 14px;">Defence Research and Development Laboratory</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #064E3B; border-bottom: 1px solid #10B981; padding-bottom: 8px;">FILLED REQUEST DETAILS</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              ${printableRows || '<tr><td colspan="2" style="border:1px solid #d1d5db; padding:8px;">No data entered.</td></tr>'}
            </tbody>
          </table>
        </div>

        <div style="margin-bottom: 20px;">
          <p style="font-size: 12px; color: #6B7280; border-top: 1px solid #ddd; padding-top: 15px;">
            <strong>Generated on:</strong> ${new Date().toLocaleString()}<br/>
            <strong>Prepared by:</strong> ${loggedInEmployee.employeeName}<br/>
            <strong>Designation:</strong> ${loggedInEmployee.designation}
          </p>
        </div>
      </div>
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>Safety & Fire Request Form Preview</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 10mm;
            }
            body {
              margin: 0;
              padding: 10mm;
              font-family: Arial, sans-serif;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
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
      const response = await ApiService.createRequest(formData);
      setMessage("Request saved successfully! ID: " + response.uniqueId);
      resetForm();
      setRefreshTable((prev) => prev + 1);
    } catch (error) {
      setMessage(`Error: ${error.message || "Save failed"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!declared) {
      setMessage("Error: You must accept the safety declaration");
      return;
    }

    if (!validateBaseFields()) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await ApiService.createRequest(formData);
      setMessage("Request submitted successfully! ID: " + response.uniqueId);
      resetForm();
      setRefreshTable((prev) => prev + 1);
    } catch (error) {
      setMessage(`Error: ${error.message || "Submission failed"}`);
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

      <form onSubmit={handleSubmit}>
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

        <div className="button-group">
          <button type="button" className="btn print-btn" onClick={handlePrintForm} disabled={loading}>
            PRINT FORM
          </button>
          <button type="button" className="btn save-btn" onClick={handleSave} disabled={loading}>
            SAVE
          </button>
          <button type="submit" className="btn send-btn" disabled={loading}>
            {loading ? "SUBMITTING..." : "SEND TO HEAD, SFEED"}
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
