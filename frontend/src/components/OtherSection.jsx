import React from "react";

export default function OtherSection({ formData, handleInputChange }) {
  return (
    <div className="form-section">
      <label className="form-label">Directorate</label>
      <p className="form-static-text">{formData.directorate || "Not Set"}</p>
      <label className="form-label">Division</label>
      <p className="form-static-text">{formData.division || "Not Set"}</p>

      <label className="form-label">Specify Type of Safety Coverage *</label>
      <textarea
        className="form-input"
        placeholder="Please specify the nature of activity requiring safety fire coverage"
        rows="6"
        required
      />
    </div>
  );
}
