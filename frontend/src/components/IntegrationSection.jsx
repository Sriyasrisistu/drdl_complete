import React, { useState, useMemo, useEffect } from "react";

export default function IntegrationSection({ formData, handleInputChange, employees = [] }) {
  const [integrationFacility, setIntegrationFacility] = useState("");
  const [activityIncharge, setActivityIncharge] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [activitySchedule, setActivitySchedule] = useState("");
  const [ambulance, setAmbulance] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const todayDate = useMemo(() => getTodayDate(), []);

  useEffect(() => {
    setIntegrationFacility(formData.integrationFacility || "");
    setActivitySchedule(formData.activitySchedule || "");
    setAmbulance(formData.ambulanceRequired || "");
    setFromDate(formData.activityFromDate || "");
    setToDate(formData.activityToDate || "");

    if (formData.incharge === "DRDL") {
      setActivityIncharge("DRDL");
      return;
    }

    if (formData.incharge === "Other") {
      setActivityIncharge("Other");
      setSelectedAddress("");
      return;
    }

    const matchingEmployee = employees.find(
      (emp) =>
        emp.employeeName === formData.activityInchargeName ||
        (
          String(emp.phone || "") === String(formData.activityInchargePhone || "") &&
          emp.designation === formData.designation
        )
    );

    if (matchingEmployee) {
      setActivityIncharge("DRDL");
      setSelectedAddress(String(matchingEmployee.empId));
      return;
    }

    if (
      formData.activityInchargeName ||
      formData.activityInchargeOrg ||
      formData.activityInchargePhone ||
      formData.designation
    ) {
      setActivityIncharge("Other");
      return;
    }

    setActivityIncharge("");
    setSelectedAddress("");
  }, [formData, employees]);

  const handleInchargeTypeChange = (value) => {
    setActivityIncharge(value);
    setSelectedAddress("");
    if (handleInputChange) {
      handleInputChange({ target: { name: "incharge", value } });
      handleInputChange({ target: { name: "activityInchargeName", value: "" } });
      handleInputChange({ target: { name: "activityInchargeOrg", value: "" } });
      handleInputChange({ target: { name: "activityInchargePhone", value: "" } });
      handleInputChange({ target: { name: "designation", value: "" } });
    }
  };

  const handleOtherPhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    if (handleInputChange) {
      handleInputChange({ target: { name: "activityInchargePhone", value: digitsOnly } });
    }
  };

  const handleFromDateChange = (e) => {
    const date = e.target.value;
    setFromDate(date);
    // Reset toDate if it's before the new fromDate
    if (toDate && date > toDate) {
      setToDate("");
    }
  };

  const handleToDateChange = (e) => {
    const date = e.target.value;
    if (!fromDate) {
      alert("Please select From Date first");
      return;
    }
    if (date < fromDate) {
      alert("To Date cannot be before From Date");
      return;
    }
    setToDate(date);
  };

  return (
    <div className="form-section">
      <label className="form-label">Directorate</label>
      <p className="form-static-text">{formData.directorate || "Not Set"}</p>
      <label className="form-label">Division</label>
      <p className="form-static-text">{formData.division || "Not Set"}</p>

      <label className="form-label">Integration Facility *</label>
      <select
        name="integrationFacility"
        className="form-select"
        value={integrationFacility}
        onChange={(e) => setIntegrationFacility(e.target.value)}
        required
      >
        <option value="">Select Facility</option>
        <option value="NGRAM">NGRAM</option>
        <option value="QRSAM">QRSAM</option>
        <option value="ASTRA">ASTRA HANGER-II</option>
        <option value="other">ANY OTHER (Specify)</option>
      </select>
      {integrationFacility === "other" && (
        <input
          name="integrationFacility"
          type="text"
          placeholder="Specify Facility"
          className="form-input placeholder-box"
          required
        />
      )}

      <label className="form-label">Details of Article *</label>
      <textarea
        name="articleDetails"
        className="form-input"
        placeholder="Enter details"
        required
      />

      <label className="form-label">Description of Work *</label>
      <textarea
        name="workDescription"
        className="form-input"
        placeholder="Enter description"
        required
      />

      <label className="form-label">Activity In-Charge *</label>
      <div className="radio-group">
        <label>
          <input
            type="radio"
            name="incharge"
            value="DRDL"
            checked={activityIncharge === "DRDL"}
            onChange={(e) => handleInchargeTypeChange(e.target.value)}
            required
          />
          DRDL
        </label>
        <label>
          <input
            type="radio"
            name="incharge"
            value="Other"
            checked={activityIncharge === "Other"}
            onChange={(e) => handleInchargeTypeChange(e.target.value)}
            required
          />
          Other
        </label>
      </div>
      {activityIncharge === "Other" && (
        <div className="other-incharge-form">
          <label className="form-label">Name *</label>
          <input type="text" name="activityInchargeName" className="form-input" placeholder="Enter Name" required />
          <label className="form-label">Designation *</label>
          <input type="text" name="designation" className="form-input" placeholder="Enter Designation" required />
          <label className="form-label">Organisation *</label>
          <input type="text" name="activityInchargeOrg" className="form-input" placeholder="Enter Organisation" required />
          <label className="form-label">Phone No. *</label>
          <input
            type="tel"
            name="activityInchargePhone"
            className="form-input"
            placeholder="Enter 10-digit Phone Number"
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            value={formData.activityInchargePhone || ""}
            onChange={handleOtherPhoneChange}
            required
          />
        </div>
      )}
      {/* Show employee dropdown when DRDL is selected as Activity In-Charge */}
      {activityIncharge === "DRDL" && (
        <div className="form-section" style={{ marginTop: 12 }}>
          <select
            name="drdlActivityIncharge"
            className="form-select"
            value={selectedAddress}
            onChange={(e) => {
              const empId = e.target.value;
              setSelectedAddress(empId);
              const emp = employees.find((x) => String(x.empId) === String(empId));
              if (emp && handleInputChange) {
                handleInputChange({ target: { name: 'activityInchargeName', value: emp.employeeName } });
                handleInputChange({ target: { name: 'activityInchargeOrg', value: emp.directorate } });
                handleInputChange({ target: { name: 'activityInchargePhone', value: emp.phone } });
                handleInputChange({ target: { name: 'designation', value: emp.designation } });
              }
            }}
            required={activityIncharge === "DRDL"}
          >
            <option value="">-- Select Activity Incharge --</option>
            {employees.map((emp) => (
              <option key={emp.empId} value={emp.empId}>
                {emp.employeeName} ({emp.personnelNo}) - {emp.designation}
              </option>
            ))}
          </select>
        </div>
      )}

      <label className="form-label">Date of Activity *</label>
      <div className="date-group">
        <input 
          type="date" 
          name="activityFromDate"
          className="form-input" 
          min={todayDate}
          value={fromDate}
          onChange={handleFromDateChange}
          required 
        />
        <input 
          type="date" 
          name="activityToDate"
          className="form-input" 
          min={fromDate || todayDate}
          value={toDate}
          onChange={handleToDateChange}
          required 
        />
      </div>

      <label className="form-label">Activity Schedule *</label>
      <div className="radio-group">
        <label>
          <input
            type="radio"
            name="activitySchedule"
            value="YES"
            onChange={(e) => setActivitySchedule(e.target.value)}
          />
          Available
        </label>
        <label>
          <input
            type="radio"
            name="activitySchedule"
            value="NO"
            onChange={(e) => setActivitySchedule(e.target.value)}
          />
          Not Available
        </label>
      </div>
      {activitySchedule === "YES" && (
        <input type="file" accept=".pdf" className="form-input" required />
      )}
      {activitySchedule === "NO" && (
        <textarea
          name="activityScheduleReason"
          className="form-input"
          placeholder="Enter reason"
          required
        ></textarea>
      )}

      <label className="form-label">Ambulance *</label>
      <div className="radio-group">
        <label>
          <input
            type="radio"
            name="ambulanceRequired"
            value="YES"
            onChange={(e) => setAmbulance(e.target.value)}
          />
          Required (Requisition Tab)
        </label>
        <label>
          <input
            type="radio"
            name="ambulanceRequired"
            value="NO"
            onChange={(e) => setAmbulance(e.target.value)}
          />
          Not Required
        </label>
      </div>
      {ambulance === "NO" && (
        <textarea
          name="ambulanceReason"
          className="form-input"
          placeholder="Enter reason"
          required
        ></textarea>
      )}

      <label className="form-label">Any Other Details</label>
      <textarea name="otherDetails" className="form-input" placeholder="Enter details" />
    </div>
  );
}
