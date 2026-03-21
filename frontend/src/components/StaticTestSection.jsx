import React, { useState, useMemo, useEffect } from "react";

export default function StaticTestSection({ formData, handleInputChange }) {
  const [testBed, setTestBed] = useState("");
  const [tarbStatus, setTarbStatus] = useState("");
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
    setTestBed(formData.testBed || "");
    setTarbStatus(formData.tarbClearance || "");
    setActivitySchedule(formData.activitySchedule || "");
    setAmbulance(formData.ambulanceRequired || "");
    setFromDate(formData.dateOfTest || "");
    setToDate(formData.activityToDate || "");
  }, [formData]);

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

      <label className="form-label">Test Bed *</label>
      <select
        name="testBed"
        className="form-select"
        value={testBed}
        onChange={(e) => setTestBed(e.target.value)}
        required
      >
        <option value="">Select Test Bed</option>
        <option value="HTF">HTF</option>
        <option value="VTF">VTF</option>
        <option value="MFT">MFT</option>
        <option value="SCRAMJET">SCRAMJET</option>
        <option value="SFDR">SFDR</option>
        <option value="100T">100T</option>
        <option value="2T">2T</option>
        <option value="6COMP">6-COMPONENT</option>
        <option value="other">ANY OTHER (Specify)</option>
      </select>
      {testBed === "other" && (
        <input
          name="testBed"
          type="text"
          placeholder="Specify Test Bed"
          className="form-input placeholder-box"
          required
        />
      )}

      <label className="form-label">Details of Article Under Test *</label>
      <input type="text" name="articleDetails" className="form-input" placeholder="Enter details" required />

      <label className="form-label">Description of Work *</label>
      <textarea name="workDescription" className="form-input" placeholder="Enter description" required />

      <label className="form-label">TARB Clearance *</label>
      <select
        name="tarbClearance"
        className="form-select"
        value={tarbStatus}
        onChange={(e) => setTarbStatus(e.target.value)}
        required
      >
        <option value="">Select</option>
        <option value="obtained">Obtained</option>
        <option value="notobtained">Not Obtained</option>
        <option value="notapplicable">Not Applicable</option>
      </select>
      {tarbStatus === "obtained" && (
        <>
          <label className="form-label">TARB Reference No. *</label>
          <input type="text" name="referenceNo" className="form-input" required />
        </>
      )}
      {tarbStatus === "notobtained" && (
        <>
          <label className="form-label">Reason *</label>
          <textarea name="tarbReason" className="form-input" placeholder="Enter reason" required></textarea>
        </>
      )}

      <label className="form-label">Test Controller Name *</label>
      <input type="text" name="testControllerName" className="form-input" required />

      <label className="form-label">Test Controller Designation *</label>
      <input type="text" name="testControllerDesignation" className="form-input" required />

      <label className="form-label">Date of Test *</label>
      <div className="date-group">
        <input 
          type="date" 
          name="dateOfTest"
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

      <label className="form-label">Scheduled Time of Test *</label>
      <input type="time" name="testScheduleTime" className="form-input" required />

      <label className="form-label">Activity Schedule *</label>
      <div className="radio-group">
        <label>
          <input
            type="radio"
            name="activitySchedule"
            value="YES"
            onChange={(e) => setActivitySchedule(e.target.value)}
            required
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
        <textarea name="activityScheduleReason" className="form-input" placeholder="Enter reason" required></textarea>
      )}

      <label className="form-label">Ambulance *</label>
      <div className="radio-group">
        <label>
          <input
            type="radio"
            name="ambulanceRequired"
            value="YES"
            onChange={(e) => setAmbulance(e.target.value)}
            required
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
        <textarea name="ambulanceReason" className="form-input" placeholder="Enter reason" required></textarea>
      )}

      <label className="form-label">Any Other Details</label>
      <textarea name="otherDetails" className="form-input" placeholder="Enter details" />
    </div>
  );
}
