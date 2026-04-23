import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { InvoicesPage } from "./features/billing/pages/InvoicesPage";
import { BookAppointmentPage } from "./features/appointments/pages/BookAppointmentPage";
import { XRayUploadPage } from "./features/dentists/pages/XRayUploadPage";
import { PatientListPage } from "./features/dentists/pages/PatientListPage";
import { ManagerDashboard } from "./features/analytics/pages/ManagerDashboard";
import { StaffManagementPage } from "./features/dentists/pages/StaffManagementPage";
import { SignupPage } from "./features/auth/pages/SignupPage";
import { MyRecordsPage } from "./features/patients/pages/MyRecordsPage";
import { SurgeryManagementPage } from "./features/surgery/pages/SurgeryManagementPage";
import { Toaster } from "react-hot-toast";
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./features/auth/pages/ProfilePage";
import { DashboardRouter } from "./routes/DashboardRouter";
import { AdminPatientListPage } from "./features/analytics/pages/AdminPatientListPage";
import { AdminBillingPage } from "./features/billing/pages/AdminBillingPage";
import { AdminAppointmentsPage } from "./features/appointments/pages/AdminAppointmentsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/*  Public Landing Page */}
        <Route path="/" element={<HomePage />} />

        {/*  Public Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/*  Authenticated Wrapper */}
        <Route element={<ProtectedRoute />}>
          {/*  Layout Wrapper (Sidebar & Header) */}
          <Route element={<DashboardLayout />}>
            {/*  SHARED Authenticated ROUTES   */}
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/*  PATIENT ONLY ROUTES  */}
            <Route element={<ProtectedRoute allowedRoles={["PATIENT"]} />}>
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route
                path="/book-appointment"
                element={<BookAppointmentPage />}
              />
              <Route path="/my-records" element={<MyRecordsPage />} />
            </Route>

            {/* OFFICE MANAGER ONLY ROUTES */}
            <Route
              element={<ProtectedRoute allowedRoles={["OFFICE_MANAGER"]} />}
            >
              <Route path="/admin/stats" element={<ManagerDashboard />} />
              <Route path="/admin/staff" element={<StaffManagementPage />} />
              <Route
                path="/admin/surgeries"
                element={<SurgeryManagementPage />}
              />
              <Route
                path="/admin/appointments"
                element={<AdminAppointmentsPage />}
              />

              <Route
                path="/admin/patients"
                element={<AdminPatientListPage />}
              />
              <Route path="/admin/billing" element={<AdminBillingPage />} />
            </Route>

            {/*  DENTIST ONLY ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={["DENTIST"]} />}>
              <Route path="/patients" element={<PatientListPage />} />
              <Route
                path="/upload-xray/:patientId"
                element={<XRayUploadPage />}
              />
            </Route>
          </Route>
        </Route>

        {/* Fallbacks */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/unauthorized"
          element={<div className="p-10 text-center">Access Denied</div>}
        />
        <Route
          path="*"
          element={
            <div className="p-10 text-center text-2xl">404: Not Found</div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
