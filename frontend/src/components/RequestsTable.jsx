import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/apiService";
import "../styles/RequestsTable.css";

export default function RequestsTable({ personnelNumber, refresh, onRequestSelect }) {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await ApiService.getRequestsByPersonnelNumber(personnelNumber);
        setRequests(response);
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
        setRequests(requests.filter(r => r.requestId !== id));
        if (selectedRequest?.requestId === id) {
          setSelectedRequest(null);
          onRequestSelect(null);
        }
        alert("Request deleted successfully");
      } catch (err) {
        alert("Failed to delete request");
        console.error(err);
      }
    }
  };

  const handleEdit = (request) => {
    navigate(`/edit/${request.requestId}`);
  };

  const handleRowClick = (request) => {
    setSelectedRequest(request);
    onRequestSelect(request);
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
                    : (request.dateOfTest 
                      ? new Date(request.dateOfTest).toLocaleDateString()
                      : "N/A"
                    )
                  }
                </td>
                <td>
                  {request.activityToDate 
                    ? new Date(request.activityToDate).toLocaleDateString()
                    : "N/A"
                  }
                </td>
                <td>{request.activityInchargeName || "N/A"}</td>
                <td>
                  <span className={`ambulance ${request.ambulanceRequired?.toLowerCase() || "no"}`}>
                    {request.ambulanceRequired || "N/A"}
                  </span>
                </td>
                <td>
                  <span className={`status ${request.headSfeedStatus || "pending"}`}>
                    {request.headSfeedStatus || "Pending"}
                  </span>
                </td>
                <td className="actions" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(request)}
                    title="Edit Request"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(request.requestId)}
                    title="Delete Request"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
