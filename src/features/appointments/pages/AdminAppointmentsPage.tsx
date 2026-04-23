import { useQuery } from "@apollo/client/react";
import { GET_ALL_CLINIC_APPOINTMENTS } from "../graphql/appointment.queries";
import { CreateInvoiceForm } from "../../billing/components/CreateInvoiceForm";
import { Calendar, Search, User, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

interface AdminAppointment {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  patient: { firstName: string; lastName: string };
  dentist: { firstName: string; lastName: string };
  invoice: { id: string } | null;
}

interface AppointmentsResponse {
  getAllAppointments: AdminAppointment[];
}

export const AdminAppointmentsPage = () => {
  const { data, loading, error } = useQuery<AppointmentsResponse>(
    GET_ALL_CLINIC_APPOINTMENTS,
  );
  const [searchTerm, setSearchTerm] = useState("");

  if (loading) return <div className="p-8">Loading clinic schedule...</div>;
  if (error)
    return <div className="p-8 text-red-500">Error: {error.message}</div>;

  const filteredAppointments = data?.getAllAppointments.filter((apt) =>
    `${apt.patient?.firstName} ${apt.patient?.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Appointments & Billing Hub
        </h1>
        <p className="text-gray-500">
          Manage all clinic visits and generate patient invoices.
        </p>
      </header>

      {/* The Billing Form at the top */}
      <CreateInvoiceForm />

      {/* The Appointment List Search Bar */}
      <div className="flex justify-between items-center mb-6 mt-12">
        <h2 className="text-xl font-bold text-gray-900">
          Master Appointment Record
        </h2>
        <div className="relative w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by patient name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* The Appointment Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-semibold text-gray-600">Appt ID</th>
              <th className="p-4 font-semibold text-gray-600">Patient</th>
              <th className="p-4 font-semibold text-gray-600">Date & Time</th>
              <th className="p-4 font-semibold text-gray-600">Dentist</th>
              <th className="p-4 font-semibold text-gray-600">
                Billing Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredAppointments?.map((apt) => (
              <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  {/* Highlight the ID so the Admin can easily copy/type it */}
                  <span className="bg-gray-100 text-gray-800 font-mono font-bold px-2 py-1 rounded">
                    {apt.id}
                  </span>
                </td>
                <td className="p-4 font-semibold text-gray-900">
                  {apt.patient?.firstName} {apt.patient?.lastName}
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                      <Calendar size={14} className="text-brand-500" />
                      {new Date(apt.appointmentDate).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-gray-500 ml-5">
                      {apt.appointmentTime}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="flex items-center gap-1.5 text-gray-700">
                    <User size={14} className="text-blue-500" />
                    Dr. {apt.dentist?.firstName} {apt.dentist?.lastName}
                  </span>
                </td>
                <td className="p-4">
                  {/* Logic to show if they need to be billed! */}
                  {apt.invoice ? (
                    <span className="flex items-center gap-1 text-green-600 font-semibold text-sm bg-green-50 px-3 py-1 rounded-full w-fit">
                      <CheckCircle size={14} /> Billed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-orange-600 font-semibold text-sm bg-orange-50 px-3 py-1 rounded-full w-fit">
                      <AlertCircle size={14} /> Needs Billing
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAppointments?.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No appointments found.
          </div>
        )}
      </div>
    </div>
  );
};
