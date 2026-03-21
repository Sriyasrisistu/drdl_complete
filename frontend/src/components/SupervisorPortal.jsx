import React, { useState } from "react";
import SupervisorLoginForm from "./SupervisorLoginForm";
import ApprovalDashboard from "./ApprovalDashboard";

export default function SupervisorPortal({ roleCode }) {
  const [approver, setApprover] = useState(null);

  if (!approver) {
    return <SupervisorLoginForm roleCode={roleCode} onLoginSuccess={setApprover} />;
  }

  return <ApprovalDashboard approver={approver} roleCode={roleCode} onLogout={() => setApprover(null)} />;
}
