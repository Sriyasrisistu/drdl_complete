import React, { useEffect, useState } from "react";
import ApiService from "../services/apiService";
import "../styles/ApprovalDashboard.css";

const ROLE_LABELS = {
  SFEED: "SFEED Supervisor",
  GDTS: "GD-T&S Supervisor",
};

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
  ["headSfeedStatus", "SFEED Status"],
  ["gdTsStatus", "GD-T&S Status"],
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

const getRequestStatus = (request) => {
  const isSfeedApproved = request.headSfeedStatus === "APPROVED";
  const isGdTsApproved = request.gdTsStatus === "APPROVED";

  if (isSfeedApproved && isGdTsApproved) {
    return "Approved";
  }

  if (isSfeedApproved && !isGdTsApproved) {
    return "Pending by GD-T&S";
  }

  if (!isSfeedApproved && isGdTsApproved) {
    return "Pending by SFEED";
  }

  return "Saved - Pending Approval";
};

export default function ApprovalDashboard({ approver, roleCode, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError("");
      try {
        const response = roleCode === "SFEED"
          ? await ApiService.getRequestsForSfeedApproval()
          : await ApiService.getRequestsForGdTsApproval();

        setRequests(response);
        setSelectedRequest((current) => {
          if (!current) {
            return response[0] || null;
          }

          return response.find((item) => item.requestId === current.requestId) || response[0] || null;
        });
      } catch (err) {
        setError("Failed to load requests");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [roleCode]);

  const handleApprove = async (request) => {
    setApprovingId(request.requestId);
    try {
      const updatedRequest = roleCode === "SFEED"
        ? await ApiService.approveBySfeed(request.requestId)
        : await ApiService.approveByGdTs(request.requestId);

      if (roleCode === "SFEED") {
        setRequests((prev) =>
          prev.map((item) => (item.requestId === request.requestId ? updatedRequest : item))
        );
        setSelectedRequest(updatedRequest);
      } else {
        setRequests((prev) =>
          prev.map((item) => (item.requestId === request.requestId ? updatedRequest : item))
        );
        setSelectedRequest(updatedRequest);
      }
    } catch (err) {
      alert("Failed to approve request");
      console.error(err);
    } finally {
      setApprovingId(null);
    }
  };

  const canApprove = (request) => (
    roleCode === "SFEED"
      ? request.headSfeedStatus !== "APPROVED"
      : request.gdTsStatus !== "APPROVED"
  );

  return (
    <div className="approval-dashboard">
      <div className="approval-header">
        <div>
          <h1>{ROLE_LABELS[roleCode]} Dashboard</h1>
          <p>{approver.approverName} • {approver.designation}</p>
        </div>
        <button type="button" className="approval-logout-btn" onClick={onLogout}>Logout</button>
      </div>

      {loading && <div className="approval-state">Loading requests...</div>}
      {error && <div className="approval-state error">{error}</div>}

      {!loading && !error && (
        <div className="approval-layout">
          <div className="approval-table-card">
            <h2>Requests</h2>
            {requests.length === 0 ? (
              <div className="approval-state">No requests available for this queue.</div>
            ) : (
              <div className="approval-table-wrapper">
                <table className="approval-table">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Date</th>
                      <th>Coverage</th>
                      <th>Requester</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr
                        key={request.requestId}
                        className={selectedRequest?.requestId === request.requestId ? "selected" : ""}
                        onClick={() => setSelectedRequest(request)}
                      >
                        <td>{request.uniqueId}</td>
                        <td>{request.dateOfRequest ? new Date(request.dateOfRequest).toLocaleDateString() : "N/A"}</td>
                        <td>{request.safetyCoverage}</td>
                        <td>{request.directorate || request.personnelNumber}</td>
                        <td>{getRequestStatus(request)}</td>
                        <td onClick={(e) => e.stopPropagation()}>
                          {canApprove(request) ? (
                            <button
                              type="button"
                              className="approval-action-btn"
                              onClick={() => handleApprove(request)}
                              disabled={approvingId === request.requestId}
                            >
                              {approvingId === request.requestId ? "Approving..." : "Approve"}
                            </button>
                          ) : (
                            <span className="approval-done-text">No action</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="approval-detail-card">
            <h2>Request Details</h2>
            {!selectedRequest ? (
              <div className="approval-state">Select a request to view full details.</div>
            ) : (
              <div className="detail-grid">
                {DETAIL_FIELDS
                  .filter(([key]) => selectedRequest[key] !== null && selectedRequest[key] !== undefined && selectedRequest[key] !== "")
                  .map(([key, label]) => (
                    <div className="detail-item" key={key}>
                      <div className="detail-label">{label}</div>
                      <div className="detail-value">{formatValue(key, selectedRequest[key])}</div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
