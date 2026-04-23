import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PatientDashboard } from "../features/patients/pages/PatientDashboard";

export const DashboardRouter = () => {
  const { user } = useAuth();

  // 1. If Manager, send them to Stats
  if (user?.role === "OFFICE_MANAGER") {
    return <Navigate to="/admin/stats" replace />;
  }

  // 2. If Dentist, send them to Patient List
  if (user?.role === "DENTIST") {
    return <Navigate to="/patients" replace />;
  }

  // 3. Otherwise, they are a Patient, so show the Patient Dashboard
  return <PatientDashboard />;
};
