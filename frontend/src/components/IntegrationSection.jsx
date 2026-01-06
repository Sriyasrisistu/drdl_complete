import React, { useState } from "react";

export default function IntegrationSection({ formData, handleInputChange }) {
  const [integrationFacility, setIntegrationFacility] = useState("");
  const [activityIncharge, setActivityIncharge] = useState("");
  const [activitySchedule, setActivitySchedule] = useState("");
  const [ambulance, setAmbulance] = useState("");

  return (
    <div className="form-section">
      <label className="form-label">Directorate</label>
      <p className="form-static-text">{formData.directorate || "Not Set"}</p>
      <label className="form-label">Division</label>
      <p className="form-static-text">{formData.division || "Not Set"}</p>

      <label className="form-label">Integration Facility *</label>
      <select
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
          type="text"
          placeholder="Specify Facility"
          className="form-input placeholder-box"
          required
        />
      )}

      <label className="form-label">Details of Article *</label>
      <textarea
        className="form-input"
        placeholder="Enter details"
        required
      />

      <label className="form-label">Description of Work *</label>
      <textarea
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
            onChange={(e) => setActivityIncharge(e.target.value)}
          />
          DRDL
        </label>
        <label>
          <input
            type="radio"
            name="incharge"
            value="Other"
            onChange={(e) => setActivityIncharge(e.target.value)}
          />
          Other
        </label>
      </div>
      {activityIncharge === "Other" && (
        <div className="other-incharge-form">
          <label className="form-label">Name *</label>
          <input type="text" className="form-input" placeholder="Enter Name" />
          <label className="form-label">Designation *</label>
          <input type="text" className="form-input" placeholder="Enter Designation" />
          <label className="form-label">Organisation *</label>
          <input type="text" className="form-input" placeholder="Enter Organisation" />
          <label className="form-label">Phone No. *</label>
          <input type="text" className="form-input" placeholder="Enter Phone Number" />
        </div>
      )}

      <label className="form-label">Date of Activity *</label>
      <div className="date-group">
        <input type="date" className="form-input" required />
        <input type="date" className="form-input" required />
      </div>

      <label className="form-label">Activity Schedule *</label>
      <div className="radio-group">
        <label>
          <input
            type="radio"
            name="schedule"
            value="available"
            onChange={(e) => setActivitySchedule(e.target.value)}
          />
          Available Enclose
        </label>
        <label>
          <input
            type="radio"
            name="schedule"
            value="notavailable"
            onChange={(e) => setActivitySchedule(e.target.value)}
          />
          Not Available Reason
        </label>
      </div>
      {activitySchedule === "available" && (
        <input type="file" accept=".pdf" className="form-input" required />
      )}
      {activitySchedule === "notavailable" && (
        <textarea
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
            name="ambulance"
            value="required"
            onChange={(e) => setAmbulance(e.target.value)}
          />
          Required (Requisition Tab)
        </label>
        <label>
          <input
            type="radio"
            name="ambulance"
            value="notrequired"
            onChange={(e) => setAmbulance(e.target.value)}
          />
          Not Required Reason
        </label>
      </div>
      {ambulance === "notrequired" && (
        <textarea
          className="form-input"
          placeholder="Enter reason"
          required
        ></textarea>
      )}

      <label className="form-label">Any Other Details</label>
      <textarea className="form-input" placeholder="Enter details" />
    </div>
  );
}
