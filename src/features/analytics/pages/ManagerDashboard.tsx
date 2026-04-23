import { useQuery } from "@apollo/client/react";
import { GET_CLINIC_STATS } from "../graphql/analytics.queries";
import { Users, Calendar, DollarSign, AlertCircle } from "lucide-react";

interface ClinicStats {
  totalPatients: number;
  totalAppointments: number;
  totalRevenue: number;
  unpaidInvoicesCount: number;
  topDentistName: string;
}

export const ManagerDashboard = () => {
  const { data, loading, error } = useQuery<{ getClinicStats: ClinicStats }>(
    GET_CLINIC_STATS,
  );

  if (loading) return <div className="p-8">Gathering clinic data...</div>;
  if (error)
    return <div className="p-8 text-red-500">Error: {error.message}</div>;

  const stats = data?.getClinicStats;

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Clinic Analytics</h1>
        <p className="text-gray-500">
          Real-time overview of ADS Dental operations.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={stats?.totalPatients}
          icon={<Users className="text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard
          title="Top Dentist"
          value={stats?.topDentistName || "N/A"}
          icon={<Users className="text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard
          title="Appointments"
          value={stats?.totalAppointments}
          icon={<Calendar className="text-purple-600" />}
          color="bg-purple-50"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="text-green-600" />}
          color="bg-green-50"
        />
        <StatCard
          title="Unpaid Invoices"
          value={stats?.unpaidInvoicesCount}
          icon={<AlertCircle className="text-red-600" />}
          color="bg-red-50"
        />
      </div>

      {/* Placeholder for a chart later */}
      <div className="mt-10 p-12 bg-white border border-gray-200 rounded-2xl text-center text-gray-400">
        Revenue Chart coming in v2.0...
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <div
      className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}
    >
      {icon}
    </div>
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
  </div>
);
