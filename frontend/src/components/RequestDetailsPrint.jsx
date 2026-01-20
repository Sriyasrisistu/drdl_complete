import React, { useState } from 'react';
import './RequestDetailsPrint.css';

const RequestDetailsPrint = ({ request, onClose }) => {
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

  if (!request) {
    return (
      <div className="no-request-message">
        <p>Select a request from the table to view details and print</p>
      </div>
    );
  }

  // Determine which test types have data
  const availableTestTypes = {
    integration: !!request.integrationFacility,
    staticTest: !!request.testBed,
    thermostructural: false,
    pressureTest: false,
    grt: false,
    alignment: false,
    radiography: false,
    hydrobasin: false,
    transportation: !!request.transportation,
    other: !!request.otherDetails
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
    const baseContent = `
      <div class="header">
        <h1>SAFETY &amp; FIRE COVERAGE REQUEST FORM</h1>
        <p>Defence Research and Development Laboratory</p>
      </div>
    `;

    let pages = [];

    // Add request information section (always included)
    const requestInfoPage = `
      <div class="page">
        <div class="header">
          <h1>REQUEST INFORMATION</h1>
        </div>
        <div class="section">
          <div class="section-title">REQUEST DETAILS</div>
          <div class="field-row">
            <div class="field">
              <div class="field-label">Unique Request ID</div>
              <div class="field-value">${request.uniqueId}</div>
            </div>
            <div class="field">
              <div class="field-label">Personnel Number</div>
              <div class="field-value">${request.personnelNumber}</div>
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <div class="field-label">Date of Request</div>
              <div class="field-value">${request.dateOfRequest ? new Date(request.dateOfRequest).toLocaleDateString() : "N/A"}</div>
            </div>
            <div class="field">
              <div class="field-label">Safety Coverage</div>
              <div class="field-value">${request.safetyCoverage}</div>
            </div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">ORGANIZATIONAL DETAILS</div>
          <div class="field-row">
            <div class="field">
              <div class="field-label">Directorate</div>
              <div class="field-value">${request.directorate}</div>
            </div>
            <div class="field">
              <div class="field-label">Division</div>
              <div class="field-value">${request.division}</div>
            </div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">ARTICLE/PROJECT DETAILS</div>
          <div class="field-row full">
            <div class="field">
              <div class="field-label">Article Details</div>
              <div class="field-value">${request.articleDetails || "N/A"}</div>
            </div>
          </div>
          <div class="field-row full">
            <div class="field">
              <div class="field-label">Work Description</div>
              <div class="field-value">${request.workDescription || "N/A"}</div>
            </div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">ACTIVITY INCHARGE DETAILS</div>
          <div class="field-row">
            <div class="field">
              <div class="field-label">Name</div>
              <div class="field-value">${request.activityInchargeName || "N/A"}</div>
            </div>
            <div class="field">
              <div class="field-label">Organization</div>
              <div class="field-value">${request.activityInchargeOrg || "N/A"}</div>
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <div class="field-label">Designation</div>
              <div class="field-value">${request.designation || "N/A"}</div>
            </div>
            <div class="field">
              <div class="field-label">Phone</div>
              <div class="field-value">${request.activityInchargePhone || "N/A"}</div>
            </div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">ACTIVITY SCHEDULE</div>
          <div class="field-row">
            <div class="field">
              <div class="field-label">From Date</div>
              <div class="field-value">${request.activityFromDate ? new Date(request.activityFromDate).toLocaleDateString() : "N/A"}</div>
            </div>
            <div class="field">
              <div class="field-label">To Date</div>
              <div class="field-value">${request.activityToDate ? new Date(request.activityToDate).toLocaleDateString() : "N/A"}</div>
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <div class="field-label">Ambulance Required</div>
              <div class="field-value">${request.ambulanceRequired || "N/A"}</div>
            </div>
            <div class="field">
              <div class="field-label">Work Centre</div>
              <div class="field-value">${request.workCentre || "N/A"}</div>
            </div>
          </div>
        </div>
      </div>
    `;
    pages.push(requestInfoPage);

    // Integration Test Page
    if (selectedTestTypes.integration && availableTestTypes.integration) {
      pages.push(`
        <div class="page">
          <div class="section">
            <div class="section-title">INTEGRATION TEST</div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Integration Facility</div>
                <div class="field-value">${request.integrationFacility || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>
      `);
    }

    // Static Test Page
    if (selectedTestTypes.staticTest && availableTestTypes.staticTest) {
      pages.push(`
        <div class="page">
          <div class="section">
            <div class="section-title">STATIC TEST</div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Test Bed</div>
                <div class="field-value">${request.testBed || "N/A"}</div>
              </div>
              <div class="field">
                <div class="field-label">Date of Test</div>
                <div class="field-value">${request.dateOfTest ? new Date(request.dateOfTest).toLocaleDateString() : "N/A"}</div>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Test Schedule Time</div>
                <div class="field-value">${request.testScheduleTime || "N/A"}</div>
              </div>
              <div class="field">
                <div class="field-label">TARB Clearance</div>
                <div class="field-value">${request.tarbClearance || "N/A"}</div>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Test Controller Name</div>
                <div class="field-value">${request.testControllerName || "N/A"}</div>
              </div>
              <div class="field">
                <div class="field-label">Test Controller Designation</div>
                <div class="field-value">${request.testControllerDesignation || "N/A"}</div>
              </div>
            </div>
            <div class="field-row full">
              <div class="field">
                <div class="field-label">Reference No</div>
                <div class="field-value">${request.referenceNo || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>
      `);
    }

    // Transportation Page
    if (selectedTestTypes.transportation && availableTestTypes.transportation) {
      pages.push(`
        <div class="page">
          <div class="section">
            <div class="section-title">TRANSPORTATION DETAILS</div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Transportation</div>
                <div class="field-value">${request.transportation || "N/A"}</div>
              </div>
              <div class="field">
                <div class="field-label">Transportation Schedule Time</div>
                <div class="field-value">${request.transScheduleTime || "N/A"}</div>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Trans Incharge</div>
                <div class="field-value">${request.transIncharge || "N/A"}</div>
              </div>
              <div class="field">
                <div class="field-label">Vehicle Details</div>
                <div class="field-value">${request.vehicleDetails || "N/A"}</div>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <div class="field-label">Driver Name</div>
                <div class="field-value">${request.driverName || "N/A"}</div>
              </div>
              <div class="field">
                <div class="field-label">Driver Designation</div>
                <div class="field-value">${request.driverDesignation || "N/A"}</div>
              </div>
            </div>
            <div class="field-row full">
              <div class="field">
                <div class="field-label">Driver Authorization</div>
                <div class="field-value">${request.driverAuth || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>
      `);
    }

    // Other Details Page
    if (selectedTestTypes.other && availableTestTypes.other) {
      pages.push(`
        <div class="page">
          <div class="section">
            <div class="section-title">OTHER DETAILS</div>
            <div class="field-row full">
              <div class="field">
                <div class="field-label">Other Details</div>
                <div class="field-value">${request.otherDetails || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>
      `);
    }

    // Approval Page (always included)
    pages.push(`
      <div class="page">
        <div class="section">
          <div class="section-title">APPROVAL STATUS</div>
          <div class="field-row">
            <div class="field">
              <div class="field-label">Head SFEED Status</div>
              <div class="field-value">${request.headSfeedStatus || "N/A"}</div>
            </div>
            <div class="field">
              <div class="field-label">Work Allocated To</div>
              <div class="field-value">${request.workAllocatedTo || "N/A"}</div>
            </div>
          </div>
          <div class="field-row full">
            <div class="field">
              <div class="field-label">GD TS Status</div>
              <div class="field-value">${request.gdTsStatus || "N/A"}</div>
            </div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">HEAD, SFEED APPROVAL</div>
          <div class="field-row">
            <div class="field">
              <div class="field-label">Recommendation</div>
              <div class="field-value">Recommended / Not Recommended</div>
            </div>
            <div class="field">
              <div class="field-label">Work Allocation</div>
              <div class="field-value">GD-T&S</div>
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <div class="field-label">Approval Status</div>
              <div class="field-value">Approved / Not Approved</div>
            </div>
            <div class="field">
              <div class="field-label">Name & Designation</div>
              <div class="field-value">To be filled by approver</div>
            </div>
          </div>
          <div class="field-row full">
            <div class="field">
              <div class="field-label">Contact No.</div>
              <div class="field-value">To be filled by approver</div>
            </div>
          </div>
        </div>
      </div>
    `);

    return baseContent + pages.join('');
  };

  const handleSelectiveprint = () => {
    if (getSelectedCount() === 0) {
      alert('Please select at least one test type to print');
      return;
    }

    const printWindow = window.open('', '', 'height=900,width=1200');
    const content = generatePrintContent();
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Safety Fire Request - ${request.uniqueId}</title>
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
            .page {
              page-break-after: always;
              padding: 20px;
              min-height: 100vh;
            }
            .page:last-child {
              page-break-after: avoid;
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
            @media print {
              body {
                margin: 0;
              }
              .page {
                page-break-after: always;
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          ${content}
          <div style="text-align:center; font-size:9px; color:#6B7280; margin-top:20px;">
            Generated: ${new Date().toLocaleString()}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="request-details-container">
      <div className="details-header">
        <h2>Request Details & Print Options</h2>
        <div className="header-buttons">
          <button onClick={handleSelectiveprint} className="btn-print-selective">
            🖨️ Print Selected Tests
          </button>
          <button onClick={onClose} className="btn-close">
            ✕
          </button>
        </div>
      </div>

      <div className="print-options">
        <h3>Select Test Types to Print:</h3>
        <div className="test-types-grid">
          {Object.entries(availableTestTypes).map(([testType, available]) => (
            available && (
              <label key={testType} className="test-type-checkbox">
                <input
                  type="checkbox"
                  checked={selectedTestTypes[testType]}
                  onChange={() => toggleTestType(testType)}
                />
                <span className="checkbox-label">
                  {testType === 'integration' && 'Integration Test'}
                  {testType === 'staticTest' && 'Static Test'}
                  {testType === 'thermostructural' && 'Thermostructural'}
                  {testType === 'pressureTest' && 'Pressure Test'}
                  {testType === 'grt' && 'GRT'}
                  {testType === 'alignment' && 'Alignment Inspection'}
                  {testType === 'radiography' && 'Radiography'}
                  {testType === 'hydrobasin' && 'Hydrobasin'}
                  {testType === 'transportation' && 'Transportation'}
                  {testType === 'other' && 'Other Details'}
                </span>
              </label>
            )
          ))}
        </div>
        <p className="print-info">Selected: {getSelectedCount()} test type(s) • Each will start on a new landscape page</p>
      </div>

      <div id="print-content" style={{ display: 'none' }}>
        {/* Hidden content for reference */}
      </div>
    </div>
  );
};

export default RequestDetailsPrint;
