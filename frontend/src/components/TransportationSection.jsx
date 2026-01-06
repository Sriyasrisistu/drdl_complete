import React, { useState } from "react";

export default function TransportationSection({ formData, handleInputChange }) {
  const [workCentre, setWorkCentre] = useState("");
  const [driverAuth, setDriverAuth] = useState("");

  return (
    <div className="form-section">
      <label className="form-label">Directorate</label>
      <p className="form-static-text">{formData.directorate || "Not Set"}</p>
      <label className="form-label">Division</label>
      <p className="form-static-text">{formData.division || "Not Set"}</p>

      <label className="form-label">Transportation *</label>
      <div className="transportation-group">
        <input type="text" className="form-input" placeholder="From: Place" required />
        <input type="text" className="form-input" placeholder="To: Place" required />
      </div>

      <label className="form-label">Scheduled Time *</label>
      <input type="time" className="form-input" required />

      <label className="form-label">Details of Article *</label>
      <input type="text" className="form-input" placeholder="Enter details" required />

      <label className="form-label">Transportation In-Charge *</label>
      <input type="text" className="form-input" placeholder="Name" required />
      <input type="text" className="form-input" placeholder="Mobile No." required />

      <label className="form-label">Vehicle Details *</label>
      <select
        className="form-select"
        value={workCentre}
        onChange={(e) => setWorkCentre(e.target.value)}
        required
      >
        <option value="">Select Type</option>
        <option value="forklift">FORK LIFT</option>
        <option value="batterytrolley">BATTERY TROLLEY</option>
        <option value="other">ANY OTHER</option>
      </select>
      {workCentre === "other" && (
        <input
          type="text"
          className="form-input placeholder-box"
          placeholder="Specify Vehicle Type"
          required
        />
      )}
      <input
        type="text"
        className="form-input"
        placeholder="Vehicle Number"
        required
      />

      <label className="form-label">Driver Name *</label>
      <input type="text" className="form-input" placeholder="Driver Name" required />

      <label className="form-label">Designation *</label>
      <input type="text" className="form-input" placeholder="Designation" required />

      <label className="form-label">Whether Driver Authorized by DRDL *</label>
      <div className="radio-group">
        <label>
          <input
            type="radio"
            name="driverAuth"
            value="yes"
            onChange={(e) => setDriverAuth(e.target.value)}
            required
          />
          Yes
        </label>
        <label>
          <input
            type="radio"
            name="driverAuth"
            value="no"
            onChange={(e) => setDriverAuth(e.target.value)}
          />
          No
        </label>
      </div>
      {driverAuth === "no" && (
        <textarea
          className="form-input"
          placeholder="Provide reason"
          required
        />
      )}

      <label className="form-label">Any Other Details</label>
      <textarea className="form-input" placeholder="Enter any other details" />
    </div>
  );
}
