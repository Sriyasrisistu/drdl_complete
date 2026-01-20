# Implementation Details & Code Reference

## Overview of Changes

This document provides detailed code references and implementation specifics for the three major feature updates.

---

## Feature 1: Directorate Auto-Fill

### Location: [SafetyFireRequestForm.jsx](SafetyFireRequestForm.jsx)

#### Auto-fill Logic (Lines 66-72)
```javascript
// Set personnel number and auto-fill directorate when logged in
useEffect(() => {
  if (loggedInEmployee) {
    setFormData(prev => ({
      ...prev,
      personnelNumber: loggedInEmployee.personnelNo,
      directorate: loggedInEmployee.employeeName // Auto-fill with logged-in user's name
    }));
  }
}, [loggedInEmployee]);
```

#### Form Field Display (Lines 600-611)
```jsx
{/* DIRECTORATE - AUTO-FILLED AND READ-ONLY */}
<div className="form-section">
  <label className="form-label">Directorate (Person Name) *</label>
  <input
    type="text"
    name="directorate"
    value={formData.directorate}
    className="form-input"
    readOnly
    title="Auto-filled with logged-in user name. Cannot be manually edited."
    disabled
  />
  <small style={{ color: '#6B7280', fontStyle: 'italic' }}>Auto-filled with your name</small>
</div>
```

### Location: [EditRequestPage.jsx](EditRequestPage.jsx)

#### Read-only Directorate Field (Lines 236-245)
```jsx
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
```

### How It Works

1. **Login:** User logs in with personnel number and password
2. **API Call:** `ApiService.login()` fetches employee details
3. **Store:** Employee data is stored in `loggedInEmployee` state
4. **Auto-fill:** useEffect triggers when `loggedInEmployee` changes
5. **Display:** Form data's `directorate` field is set to `loggedInEmployee.employeeName`
6. **Read-only:** Input field has `readOnly` and `disabled` attributes

### Database Column Mapping

- **Source:** `Employee.employeeName` (from login response)
- **Destination:** `SafetyRequest.directorate` (stored in request)
- **Field Type:** String
- **Max Length:** Inherited from employee name

---

## Feature 2: Print Form Functionality

### Location: [SafetyFireRequestForm.jsx](SafetyFireRequestForm.jsx)

#### Print Function (Lines 393-479)
```javascript
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
```

#### Print Button in Form (Lines 719-721)
```jsx
<button type="button" className="btn print-btn" onClick={handlePrintForm} disabled={loading}>
  🖨️ PRINT FORM
</button>
```

### Location: [EditRequestPage.jsx](EditRequestPage.jsx)

#### Print Function (Lines 95-181)
Similar implementation with request ID included:
```javascript
const handlePrintForm = () => {
  if (!formData) return;
  // ... generates print content with request ID and date of request
};
```

#### Print Button in Edit Form (Lines 337-340)
```jsx
<button type="button" className="btn print-btn" onClick={handlePrintForm} disabled={loading}>
  🖨️ PRINT FORM
</button>
```

### CSS Styling

#### Location: [SafetyFireRequestForm.css](SafetyFireRequestForm.css)

Lines 319-334:
```css
/* Print Button */
.print-btn {
  background-color: #3B82F6;
  color: white;
  border: none;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
}

.print-btn:hover {
  background-color: #2563EB;
  transform: translateY(-1px);
  box-shadow: 0 6px 10px rgba(59, 130, 246, 0.3);
}

.print-btn:active {
  background-color: #1D4ED8;
  transform: translateY(0);
}
```

### Print Technical Specifications

**Page Format:**
- Size: A4 Landscape (210mm × 297mm rotated)
- Orientation: Landscape
- Margins: 10mm on all sides
- Font: Arial, sans-serif

**Content Structure:**
- Header with title and organization
- Request information grid (2 columns)
- Metadata footer with timestamp and preparer
- Disclaimer text

**Browser Support:**
- Works with all modern browsers (Chrome, Firefox, Safari, Edge)
- Uses standard window.print() API
- Compatible with physical printers and PDF writers

---

## Feature 3: Edit Request Behavior

### Form Layout Consistency

#### Files Involved:
1. **SafetyFireRequestForm.jsx** - Create form (source)
2. **EditRequestPage.jsx** - Edit form (target)
3. **SafetyFireRequestForm.css** - Shared styling

#### Key Alignment Points:

**1. Import Structure:**
```javascript
// Both files import same form sections
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
```

**2. Coverage Type Mapping:**
Both forms use identical coverage type options:
```javascript
const coverageTypeMap = {
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
};
```

**3. Form Sections Rendering:**
```jsx
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
// ... etc for all coverage types
```

**4. Validation Rules:**
Both forms require:
- Personnel Number
- Safety Coverage Type selection

**5. Button Layout:**
```jsx
<div className="button-group">
  <button type="button" className="btn print-btn" onClick={handlePrintForm} disabled={loading}>
    🖨️ PRINT FORM
  </button>
  <button type="button" className="btn save-btn" onClick={handleCancel} disabled={loading}>
    CANCEL/SAVE
  </button>
  <button type="submit" className="btn send-btn" disabled={loading}>
    SEND/UPDATE
  </button>
</div>
```

### Navigation Flow

```
Login Screen
    ↓
SafetyFireRequestForm (Create)
    ├→ Fill Form
    ├→ SAVE (stores in DB)
    ├→ SEND TO HEAD (submits)
    └→ PRINT FORM
         ↓
    View Saved Requests (Table)
         ↓
    Click EDIT on Row
         ↓
    EditRequestPage
        ├→ Edit Form (pre-filled with data)
        ├→ PRINT FORM (prints current state)
        ├→ UPDATE REQUEST (saves changes)
        └→ CANCEL (returns home)
```

---

## API Integration Points

### Authentication
```javascript
// Get employee details on login
const response = await ApiService.login(personnelNo, password);
// Returns: { success: true, employee: { empId, employeeName, personnelNo, ... } }
```

### Request Operations
```javascript
// Create new request
const response = await ApiService.createRequest(formData);
// Returns: { requestId, uniqueId, ... }

// Update existing request
await ApiService.updateRequest(requestId, formData);

// Get single request
const request = await ApiService.getRequest(requestId);

// Get requests by personnel
const requests = await ApiService.getRequestsByPersonnelNumber(personnelNumber);
```

### Form Data Structure
```javascript
const formData = {
  // Basic Info
  personnelNumber: "001234",
  safetyCoverage: "integration",
  directorate: "Rajeev Kumar",        // Auto-filled from login
  division: "Engineering",
  
  // Activity Incharge (if applicable)
  activityInchargeName: "...",
  activityInchargeOrg: "...",
  activityInchargePhone: "...",
  
  // Coverage-specific fields
  // (varies based on safety coverage type)
  integrationFacility: "...",
  testBed: "...",
  transportation: "...",
  // ... other fields
};
```

---

## State Management

### SafetyFireRequestForm State
```javascript
const [loggedInEmployee, setLoggedInEmployee] = useState(null);
const [employees, setEmployees] = useState([]);
const [coverageType, setCoverageType] = useState("");
const [formData, setFormData] = useState({...});
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");
const [declared, setDeclared] = useState(false);
const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
const [refreshTable, setRefreshTable] = useState(0);
const [selectedRequest, setSelectedRequest] = useState(null);
const [selectedTestTypes, setSelectedTestTypes] = useState({...});
```

### EditRequestPage State
```javascript
const [employees, setEmployees] = useState([]);
const [formData, setFormData] = useState(null);
const [coverageType, setCoverageType] = useState("");
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");
const [declared, setDeclared] = useState(false);
const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
```

---

## CSS Classes Used

### Form Styling
- `.safety-form-container` - Main container
- `.form-header` - Header section
- `.form-title` - Form title
- `.form-section` - Section container
- `.form-label` - Label styling
- `.form-input` - Input field styling
- `.form-select` - Select dropdown styling

### Button Styling
- `.button-group` - Button container
- `.btn` - Base button styling
- `.btn.print-btn` - Print button (blue)
- `.btn.save-btn` - Save button (green outline)
- `.btn.send-btn` - Send button (green filled)

### Other Components
- `.declaration-box` - Declaration checkbox
- `.approvals-container` - Approvals section
- `.message` - Status messages
- `.message.success` - Success message
- `.message.error` - Error message

---

## Browser Compatibility

### Required Features
- ES6+ JavaScript
- React 18.2+
- CSS Grid and Flexbox
- Window.open() for print window
- Fetch API for HTTP requests

### Tested Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Print Support
- All modern browsers
- PDF viewers (Chrome PDF Viewer, Firefox PDF.js)
- Print to File (Save as PDF)
- Physical printers via CUPS/Windows Print

---

## Performance Considerations

### Optimization Techniques Used
1. **Memoization:** State updates only when dependencies change
2. **Conditional Rendering:** Only render visible form sections
3. **Event Delegation:** Single click handler for multiple items
4. **Lazy Loading:** Employees fetched on component mount
5. **Debouncing:** Input changes batched in state updates

### File Sizes
- SafetyFireRequestForm.jsx: ~791 lines
- EditRequestPage.jsx: ~353 lines
- SafetyFireRequestForm.css: ~475 lines

---

## Testing Recommendations

### Unit Tests
- Test auto-fill logic in useEffect
- Test form validation rules
- Test print window generation
- Test coverage type selection

### Integration Tests
- Test login → form load → auto-fill flow
- Test form submission and API calls
- Test edit flow and data persistence
- Test print functionality end-to-end

### E2E Tests
- Login flow with credentials
- Create request with all coverage types
- Edit existing request
- Print from create and edit forms
- Navigation between pages

---

## Future Enhancement Opportunities

1. **Field-level Validation**
   - Real-time validation feedback
   - Custom error messages per field
   - Async validation for unique values

2. **Auto-save Functionality**
   - Save form state to browser localStorage
   - Recover unsaved changes on page refresh
   - Visual indicator of unsaved changes

3. **Advanced Print Options**
   - Multiple format templates
   - Print preview with zoom
   - Batch printing multiple requests
   - PDF generation on server

4. **Accessibility Improvements**
   - ARIA labels for form fields
   - Keyboard navigation support
   - Screen reader optimization
   - Color contrast adjustments

5. **Mobile Responsiveness**
   - Touch-friendly button sizing
   - Responsive form layout
   - Mobile print optimization
   - Swipe navigation

---

**Document Version:** 1.0
**Last Updated:** January 20, 2026
**Status:** Complete ✅
