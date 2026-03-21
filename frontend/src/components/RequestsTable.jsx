import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/apiService";
import "../styles/RequestsTable.css";

const DETAIL_FIELDS = [
  ["uniqueId", "Request ID"],
  ["personnelNumber", "Personnel Number"],
  ["dateOfRequest", "Date of Request"],
  ["safetyCoverage", "Safety Coverage"],
  ["directorate", "Directorate"],
  ["division", "Division"],
  ["integrationFacility", "Integration Facility"],
  ["articleDetails", "Article Details"],
  ["workDescription", "Work Description"],
  ["activityInchargeName", "Activity Incharge Name"],
  ["activityInchargeOrg", "Activity Incharge Organization"],
  ["activityInchargePhone", "Activity Incharge Phone"],
  ["designation", "Designation"],
  ["activityFromDate", "Activity From Date"],
  ["activityToDate", "Activity To Date"],
  ["activitySchedule", "Activity Schedule"],
  ["ambulanceRequired", "Ambulance Required"],
  ["testBed", "Test Bed"],
  ["tarbClearance", "TARB Clearance"],
  ["referenceNo", "Reference Number"],
  ["testControllerName", "Test Controller Name"],
  ["testControllerDesignation", "Test Controller Designation"],
  ["dateOfTest", "Date of Test / Inspection"],
  ["testScheduleTime", "Scheduled Time"],
  ["workCentre", "Work Centre"],
  ["transportation", "Transportation"],
  ["transScheduleTime", "Transport Schedule Time"],
  ["transIncharge", "Transport Incharge"],
  ["vehicleDetails", "Vehicle Details"],
  ["driverName", "Driver Name"],
  ["driverDesignation", "Driver Designation"],
  ["driverAuth", "Driver Authorized"],
  ["otherDetails", "Other Details"],
];

const formatValue = (key, value) => {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  if (key.toLowerCase().includes("date")) {
    return new Date(value).toLocaleDateString();
  }

  return value;
};

export default function RequestsTable({ personnelNumber, refresh, onRequestSelect }) {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const onRequestSelectRef = useRef(onRequestSelect);

  useEffect(() => {
    onRequestSelectRef.current = onRequestSelect;
  }, [onRequestSelect]);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await ApiService.getRequestsByPersonnelNumber(personnelNumber);
        setRequests(response);
        setSelectedRequest((current) => {
          if (!response.length) {
            onRequestSelectRef.current?.(null);
            return null;
          }

          const nextSelected = current
            ? response.find((item) => item.requestId === current.requestId) || response[0]
            : response[0];

          onRequestSelectRef.current?.(nextSelected);
          return nextSelected;
        });
      } catch (err) {
        setError("Failed to fetch requests");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (personnelNumber) {
      fetchRequests();
    }
  }, [personnelNumber, refresh]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        await ApiService.deleteRequest(id);
        setRequests(requests.filter((r) => r.requestId !== id));
        if (selectedRequest?.requestId === id) {
          setSelectedRequest(null);
          onRequestSelectRef.current?.(null);
        }
        alert("Request deleted successfully");
      } catch (err) {
        alert("Failed to delete request");
        console.error(err);
      }
    }
  };

  const handleUpdate = (request) => {
    navigate(`/edit/${request.requestId}`);
  };

  const handleRowClick = (request) => {
    setSelectedRequest(request);
    onRequestSelectRef.current?.(request);
  };

  const getStatusDisplay = (request) => {
    const isSfeedApproved = request.headSfeedStatus === "APPROVED";
    const isGdTsApproved = request.gdTsStatus === "APPROVED";

    if (isSfeedApproved && isGdTsApproved) {
      return { text: "Approved", className: "approved" };
    }

    if (isSfeedApproved && !isGdTsApproved) {
      return { text: "Pending by GD-T&S", className: "pending" };
    }

    if (!isSfeedApproved && isGdTsApproved) {
      return { text: "Pending by SFEED", className: "pending" };
    }

    return { text: "Saved - Pending Approval", className: "pending" };
  };

  if (!personnelNumber) {
    return <div className="requests-table-container empty-message">Enter Personnel Number to view requests</div>;
  }

  if (loading) {
    return <div className="requests-table-container loading">Loading requests...</div>;
  }

  if (error) {
    return <div className="requests-table-container error">{error}</div>;
  }

  if (requests.length === 0) {
    return <div className="requests-table-container empty-message">No requests found</div>;
  }

  return (
    <div className="requests-table-container">
      <h2>My Safety Requests</h2>
      <div className="table-wrapper">
        <table className="requests-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Request ID</th>
              <th>Date</th>
              <th>Coverage Type</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Activity Incharge</th>
              <th>Ambulance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr
                key={request.requestId}
                className={selectedRequest?.requestId === request.requestId ? "selected" : ""}
                onClick={() => handleRowClick(request)}
              >
                <td>{index + 1}</td>
                <td className="unique-id">{request.uniqueId}</td>
                <td>{request.dateOfRequest ? new Date(request.dateOfRequest).toLocaleDateString() : "N/A"}</td>
                <td>{request.safetyCoverage}</td>
                <td>
                  {request.activityFromDate
                    ? new Date(request.activityFromDate).toLocaleDateString()
                    : request.dateOfTest
                      ? new Date(request.dateOfTest).toLocaleDateString()
                      : "N/A"}
                </td>
                <td>
                  {request.activityToDate
                    ? new Date(request.activityToDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{request.activityInchargeName || "N/A"}</td>
                <td>
                  <span className={`ambulance ${request.ambulanceRequired?.toLowerCase() || "no"}`}>
                    {request.ambulanceRequired || "N/A"}
                  </span>
                </td>
                <td>
                  <span className={`status ${getStatusDisplay(request).className}`}>
                    {getStatusDisplay(request).text}
                  </span>
                </td>
                <td className="actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="btn-edit"
                    onClick={() => handleUpdate(request)}
                    title="Update Request"
                  >
                    Update
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(request.requestId)}
                    title="Delete Request"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedRequest && (
        <div className="request-details-panel">
          <h3>Saved Request Details</h3>
          <div className="request-details-grid">
            {DETAIL_FIELDS
              .filter(([key]) => selectedRequest[key] !== null && selectedRequest[key] !== undefined && selectedRequest[key] !== "")
              .map(([key, label]) => (
                <div className="request-detail-item" key={key}>
                  <div className="request-detail-label">{label}</div>
                  <div className="request-detail-value">{formatValue(key, selectedRequest[key])}</div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
