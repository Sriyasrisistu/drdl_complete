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

export default function SafetyFireRequestForm() {
  const [loggedInEmployee, setLoggedInEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [coverageType, setCoverageType] = useState("");
  const [formData, setFormData] = useState({
    personnelNumber: "",
    safetyCoverage: "",
    directorate: "DRDL",
    division: "Engineering",
    activityInchargeName: "",
    activityInchargeOrg: "",
    activityInchargePhone: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [declared, setDeclared] = useState(false);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const [refreshTable, setRefreshTable] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedTestTypes, setSelectedTestTypes] = useState({
    integration: false,
    staticTest: false,
    thermostructural: false,
    pressureTest: false,
    grt: false,
    alignment: false,
    radiography: false,
    hydrobasin: false,
    transportation: false,
    other: false
  });

  // Fetch employees for Activity Incharge dropdown
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

  // Set personnel number and auto-fill directorate when logged in
  useEffect(() => {
    if (loggedInEmployee) {
      setFormData(prev => ({
        ...prev,
        personnelNumber: loggedInEmployee.personnelNo,
        directorate: loggedInEmployee.employeeName // Auto-fill with logged-in user's name as directorate
      }));
    }
  }, [loggedInEmployee]);

  const handleLoginSuccess = (employee) => {
    setLoggedInEmployee(employee);
  };

  const handleLogout = () => {
    setLoggedInEmployee(null);
    setFormData({
      personnelNumber: "",
      safetyCoverage: "",
      directorate: "DRDL",
      division: "Engineering",
      activityInchargeName: "",
      activityInchargeOrg: "",
      activityInchargePhone: "",
    });
    setCoverageType("");
    setDeclared(false);
    setSelectedRequest(null);
  };

  const toggleTestType = (testType) => {
    setSelectedTestTypes(prev => ({
      ...prev,
      [testType]: !prev[testType]
    }));
  };

  const getSelectedCount = () => {
    return Object.values(selectedTestTypes).filter(v => v).length;
  };

  const generatePrintContent = () => {
    let pages = [];

    // Determine which test types have data
    const availableTestTypes = {
      integration: !!selectedRequest.integrationFacility,
      staticTest: !!selectedRequest.testBed,
      transportation: !!selectedRequest.transportation,
      other: !!selectedRequest.otherDetails
    };

    // REQUEST INFORMATION PAGE (always included)
    const requestInfoPage = `
      <div class="page">
        <div class="header">
          <h1>REQUEST INFORMATION</h1>
        </div>
        <div class="section">
          <div class="field-row">
            <div class="field">
              <div class="field-label">Unique Request ID</div>
              <div class="field-value">${selectedRequest.uniqueId}</div>
            </div>
            <div class="field">
              <div class="field-label">Personnel Number</div>
              <div class="field-value">${selectedRequest.personnelNumber}</div>
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <div class="field-label">Date of Request</div>
              <div class="field-value">${selectedRequest.dateOfRequest ? new Date(selectedRequest.dateOfRequest).toLocaleDateString() : "N/A"}</div>
            </div>
            <div class="field">
              <div class="field-label">Safety Coverage</div>
              <div class="field-value">${selectedRequest.safetyCoverage}</div>
            </div>
          </div>
        </div>
      </div>
    `;
    pages.push(requestInfoPage);

    // INTEGRATION PAGE (if selected)
    if (selectedTestTypes.integration && availableTestTypes.integration) {
      const integrationPage = `
        <div class="page">
          <div class="header">
            <h1>INTEGRATION FACILITY</h1>
          </div>
          <div class="section">
            <div class="field-row">
              <div class="field full">
                <div class="field-label">Integration Facility</div>
                <div class="field-value">${selectedRequest.integrationFacility || "N/A"}</div>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Activity From Date</div>
                <div class="field-value">${selectedRequest.activityFromDate ? new Date(selectedRequest.activityFromDate).toLocaleDateString() : "N/A"}</div>
              </div>
              <div class="field">
                <div class="field-label">Activity To Date</div>
                <div class="field-value">${selectedRequest.activityToDate ? new Date(selectedRequest.activityToDate).toLocaleDateString() : "N/A"}</div>
              </div>
            </div>
          </div>
        </div>
      `;
      pages.push(integrationPage);
    }

    // TRANSPORTATION PAGE (if selected)
    if (selectedTestTypes.transportation && availableTestTypes.transportation) {
      const transportationPage = `
        <div class="page">
          <div class="header">
            <h1>TRANSPORTATION DETAILS</h1>
          </div>
          <div class="section">
            <div class="field-row">
              <div class="field">
                <div class="field-label">Transportation</div>
                <div class="field-value">${selectedRequest.transportation || "N/A"}</div>
              </div>
              <div class="field">
                <div class="field-label">Schedule Time</div>
                <div class="field-value">${selectedRequest.transScheduleTime || "N/A"}</div>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Transportation Incharge</div>
                <div class="field-value">${selectedRequest.transIncharge || "N/A"}</div>
              </div>
              <div class="field">
                <div class="field-label">Vehicle Details</div>
                <div class="field-value">${selectedRequest.vehicleDetails || "N/A"}</div>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Driver Name</div>
                <div class="field-value">${selectedRequest.driverName || "N/A"}</div>
              </div>
              <div class="field">
                <div class="field-label">Driver Authorization</div>
                <div class="field-value">${selectedRequest.driverAuth || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>
      `;
      pages.push(transportationPage);
    }

    // OTHER DETAILS PAGE (if selected)
    if (selectedTestTypes.other && availableTestTypes.other) {
      const otherPage = `
        <div class="page">
          <div class="header">
            <h1>OTHER DETAILS</h1>
          </div>
          <div class="section">
            <div class="field-row full">
              <div class="field">
                <div class="field-label">Other Details</div>
                <div class="field-value">${selectedRequest.otherDetails || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>
      `;
      pages.push(otherPage);
    }

    return pages.join('');
  };

  const handleSelectivePrint = () => {
    if (getSelectedCount() === 0) {
      alert("Please select at least one test type to print");
      return;
    }

    const printWindow = window.open('', '', 'height=800,width=900');
    const content = generatePrintContent();

    printWindow.document.write(`
      <html>
        <head>
          <title>Safety Fire Request - ${selectedRequest.uniqueId}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, sans-serif;
              color: #333;
              line-height: 1.3;
            }
            @page { 
              size: A4 landscape; 
              margin: 12mm;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #064E3B;
              padding-bottom: 10px;
              margin-bottom: 12px;
            }
            .header h1 {
              margin: 0 0 3px 0;
              color: #064E3B;
              font-size: 16px;
              letter-spacing: 0.6px;
            }
            .header p {
              margin: 2px 0;
              font-size: 11px;
              color: #6B7280;
            }
            .page {
              page-break-after: always;
              margin-bottom: 20px;
            }
            .page:last-child {
              page-break-after: avoid;
            }
            .section {
              margin-bottom: 10px;
              page-break-inside: avoid;
            }
            .section-title {
              background-color: #D1F7D6;
              color: #064E3B;
              padding: 5px 8px;
              margin-bottom: 6px;
              font-weight: bold;
              font-size: 11px;
              border-left: 4px solid #10B981;
            }
            .field-row {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
              margin-bottom: 8px;
            }
            .field-row.full {
              grid-template-columns: 1fr;
            }
            .field {
              border: 1px solid #D1F7D6;
              padding: 5px 6px;
              background-color: #F0FDF4;
              font-size: 10px;
            }
            .field-label {
              font-weight: bold;
              color: #064E3B;
              margin-bottom: 2px;
              font-size: 9px;
            }
            .field-value {
              color: #333;
              word-break: break-word;
              font-size: 10px;
            }
            .footer {
              margin-top: 15px;
              border-top: 1px solid #ddd;
              padding-top: 8px;
              font-size: 9px;
              text-align: center;
              color: #6B7280;
            }
            @media print {
              body {
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          ${content}
          <div class="footer">
            <p>Generated: ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);

    // Reset selections after printing
    setSelectedTestTypes({
      integration: false,
      staticTest: false,
      thermostructural: false,
      pressureTest: false,
      grt: false,
      alignment: false,
      radiography: false,
      hydrobasin: false,
      transportation: false,
      other: false
    });
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

  // Print current form
  const handlePrintForm = () => {
    const printWindow = window.open('', '', 'height=800,width=1000');
    
    const coverageLabel = {
      integration: 'INTEGRATION',
      static: 'STATIC TEST',
      thermostructural: 'THERMOSTRUCTURAL',
      pressure: 'PRESSURE TEST',
      grt: 'GRT',
      alignment: 'ALIGNMENT INSPECTION',
      radiography: 'RADIOGRAPHY',
      hydrobasin: 'HYDROBASIN',
      transportation: 'TRANSPORTATION',
      other: 'ANY OTHER'
    }[coverageType] || 'N/A';

    const content = `
      <div style="padding: 20px; font-family: Arial, sans-serif; color: #333;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #064E3B; padding-bottom: 15px;">
          <h1 style="margin: 0 0 5px 0; color: #064E3B;">SAFETY & FIRE COVERAGE REQUEST FORM</h1>
          <p style="margin: 5px 0; color: #6B7280; font-size: 14px;">Defence Research and Development Laboratory</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #064E3B; border-bottom: 1px solid #10B981; padding-bottom: 8px;">REQUEST INFORMATION</h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
            <div>
              <strong style="color: #064E3B;">Personnel Number:</strong>
              <p style="margin: 5px 0; color: #333;">${formData.personnelNumber || 'N/A'}</p>
            </div>
            <div>
              <strong style="color: #064E3B;">Safety Coverage:</strong>
              <p style="margin: 5px 0; color: #333;">${coverageLabel}</p>
            </div>
            <div>
              <strong style="color: #064E3B;">Directorate (Person Name):</strong>
              <p style="margin: 5px 0; color: #333;">${formData.directorate || 'N/A'}</p>
            </div>
            <div>
              <strong style="color: #064E3B;">Division:</strong>
              <p style="margin: 5px 0; color: #333;">${formData.division || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <p style="font-size: 12px; color: #6B7280; border-top: 1px solid #ddd; padding-top: 15px;">
            <strong>Generated on:</strong> ${new Date().toLocaleString()}<br/>
            <strong>Prepared by:</strong> ${loggedInEmployee.employeeName}<br/>
            <strong>Designation:</strong> ${loggedInEmployee.designation}
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px; font-size: 12px; color: #6B7280;">
          <p>This is a system-generated document. Please ensure all details are accurate before submission.</p>
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
            @media print {
              body {
                margin: 0;
                padding: 10mm;
              }
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

  // Activity Incharge selection now handled inside IntegrationSection when relevant

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!formData.personnelNumber || !formData.safetyCoverage) {
      setMessage("✗ Error: Personnel Number and Safety Coverage are required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await ApiService.createRequest(formData);
      setMessage("✓ Request saved successfully! ID: " + response.uniqueId);
      console.log("Saved Response:", response);
      
      // Reset form
      setFormData({
        personnelNumber: loggedInEmployee.personnelNo,
        safetyCoverage: "",
        directorate: "DRDL",
        division: "Engineering",
        activityInchargeName: "",
        activityInchargeOrg: "",
        activityInchargePhone: "",
      });
      setCoverageType("");
      setDeclared(false);
      setSelectedRequest(null);
      
      // Refresh the table
      setRefreshTable(refreshTable + 1);
    } catch (error) {
      setMessage(`✗ Error: ${error.message || "Save failed"}`);
    } finally {
      setLoading(false);
    }
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
        personnelNumber: loggedInEmployee.personnelNo,
        safetyCoverage: "",
        directorate: "DRDL",
        division: "Engineering",
        activityInchargeName: "",
        activityInchargeOrg: "",
        activityInchargePhone: "",
      });
      setCoverageType("");
      setDeclared(false);
      setSelectedRequest(null);
    } catch (error) {
      setMessage(`✗ Error: ${error.message || "Submission failed"}`);
    } finally {
      setLoading(false);
    }
  };

  // If not logged in, show login form
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
          <p><strong>👤 {loggedInEmployee.employeeName}</strong></p>
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

        {/* Activity Incharge select removed from top of form as requested. */}

        {/* Activity Incharge details are intentionally hidden from the form UI.
            Values are still stored internally when an employee is selected. */}

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
          <button type="button" className="btn print-btn" onClick={handlePrintForm} disabled={loading}>
            🖨️ PRINT FORM
          </button>
          <button type="button" className="btn save-btn" onClick={handleSave} disabled={loading}>
            SAVE
          </button>
          <button type="submit" className="btn send-btn" disabled={loading}>
            {loading ? "SUBMITTING..." : "SEND TO HEAD, SFEED"}
          </button>
        </div>
      </form>

      <GuidelinesModal 
        isOpen={showGuidelinesModal} 
        onClose={() => setShowGuidelinesModal(false)} 
      />

      {selectedRequest && (
        <div className="print-section">
          <div className="print-header">
            <h2>📄 Print Request Details</h2>
            <p className="print-subtitle">Request ID: {selectedRequest.uniqueId}</p>
          </div>
          <div className="print-options">
            <div className="test-types-grid">
              {Object.entries({
                integration: 'Integration',
                staticTest: 'Static Test',
                transportation: 'Transportation',
                other: 'Other Details'
              }).map(([testType, label]) => {
                const availableTestTypes = {
                  integration: !!selectedRequest.integrationFacility,
                  staticTest: !!selectedRequest.testBed,
                  transportation: !!selectedRequest.transportation,
                  other: !!selectedRequest.otherDetails
                };

                if (!availableTestTypes[testType]) return null;

                return (
                  <label key={testType} className="test-type-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedTestTypes[testType]}
                      onChange={() => toggleTestType(testType)}
                    />
                    <span className="checkbox-label">{label}</span>
                  </label>
                );
              })}
            </div>
            <p className="print-info">Selected: {getSelectedCount()} test type(s) • Each will start on a new landscape page</p>
            <button 
              className="btn-print-selective" 
              onClick={handleSelectivePrint}
              disabled={getSelectedCount() === 0}
            >
              🖨️ Print Selected
            </button>
          </div>
        </div>
      )}

      <RequestsTable 
        personnelNumber={formData.personnelNumber}
        refresh={refreshTable}
        onRequestSelect={setSelectedRequest}
      />
    </div>
  );
}
