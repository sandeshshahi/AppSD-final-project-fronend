import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  UserCircle,
  FileText,
  Calendar,
  TrendingUp,
  LogOut,
  UserPlus,
  DoorOpen,
  Users,
  ClipboardClock,
} from "lucide-react";
import toast from "react-hot-toast";

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out. See you next time!");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-900 text-white flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-brand-800">
          ADS Dental
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {/* <SidebarLink
            to="/dashboard"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
          /> */}

          {/* Patient Links */}
          {user?.role === "PATIENT" && (
            <>
              <SidebarLink
                to="/dashboard"
                icon={<LayoutDashboard size={20} />}
                label="Dashboard"
              />
              <SidebarLink
                to="/book-appointment"
                icon={<Calendar size={20} />}
                label="Book Appointment"
              />
              <SidebarLink
                to="/my-records"
                icon={<FileText size={20} />}
                label="Medical Records"
              />
              <SidebarLink
                to="/invoices"
                icon={<FileText size={20} />}
                label="Invoices"
              />
            </>
          )}

          {/* Dentist Links */}
          {user?.role === "DENTIST" && (
            <>
              <SidebarLink
                to="/patients"
                icon={<UserCircle size={20} />}
                label="Patient Directory"
              />
            </>
          )}

          {/* Manager Links */}
          {user?.role === "OFFICE_MANAGER" && (
            <>
              <SidebarLink
                to="/admin/stats"
                icon={<TrendingUp size={20} />}
                label="Clinic Stats"
              />
              <SidebarLink
                to="/admin/staff"
                icon={<UserPlus size={20} />}
                label="Manage Staff"
              />
              <SidebarLink
                to="/admin/surgeries"
                icon={<DoorOpen size={20} />}
                label="Surgery Rooms"
              />
              <SidebarLink
                to="/admin/patients"
                icon={<Users size={20} />}
                label="Patient Directory"
              />
              <SidebarLink
                to="/admin/billing"
                icon={<FileText size={20} />}
                label="Billing"
              />
              <SidebarLink
                to="/admin/appointments"
                icon={<ClipboardClock size={20} />}
                label="Appointments"
              />
            </>
          )}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-brand-800 space-y-2">
          <div className="text-xs text-brand-300 px-2 uppercase tracking-wider">
            Logged in as
          </div>
          <div className="px-2 font-medium">
            {user?.firstName} ({user?.role})
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-2 py-2 text-red-300 hover:bg-brand-800 rounded transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

// Helper Component for Sidebar Links
const SidebarLink = ({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-3 text-brand-100 hover:bg-brand-800 rounded-lg transition-all"
  >
    {icon}
    <span>{label}</span>
  </Link>
);
