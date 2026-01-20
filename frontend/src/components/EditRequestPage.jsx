import React, { useState, useEffect } from "react";
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

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!formData.personnelNumber || !formData.safetyCoverage) {
      setMessage("✗ Error: Personnel Number and Safety Coverage are required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await ApiService.updateRequest(requestId, formData);
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

  // Print current form
  const handlePrintForm = () => {
    if (!formData) return;
    
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
              <strong style="color: #064E3B;">Request ID:</strong>
              <p style="margin: 5px 0; color: #333;">${formData.uniqueId || 'N/A'}</p>
            </div>
            <div>
              <strong style="color: #064E3B;">Personnel Number:</strong>
              <p style="margin: 5px 0; color: #333;">${formData.personnelNumber || 'N/A'}</p>
            </div>
            <div>
              <strong style="color: #064E3B;">Safety Coverage:</strong>
              <p style="margin: 5px 0; color: #333;">${coverageLabel}</p>
            </div>
            <div>
              <strong style="color: #064E3B;">Date of Request:</strong>
              <p style="margin: 5px 0; color: #333;">${formData.dateOfRequest ? new Date(formData.dateOfRequest).toLocaleDateString() : 'N/A'}</p>
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
            <strong>Request ID:</strong> ${formData.uniqueId || 'N/A'}
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
          <title>Safety & Fire Request Form - ${formData.uniqueId}</title>
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

      <form onSubmit={handleUpdate}>
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
