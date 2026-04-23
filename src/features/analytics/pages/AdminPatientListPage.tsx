import { useQuery } from "@apollo/client/react";
import { GET_ALL_CLINIC_PATIENTS } from "../graphql/admin.queries";
import { Search, Calendar, User } from "lucide-react";
import { useState } from "react";

interface AdminPatient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  appointments: {
    id: string;
    appointmentDate: string;
    appointmentTime: string;
    dentist: {
      firstName: string;
      lastName: string;
    };
  }[];
}

export const AdminPatientListPage = () => {
  const { data, loading, error } = useQuery<{ getAllPatients: AdminPatient[] }>(
    GET_ALL_CLINIC_PATIENTS,
  );
  const [searchTerm, setSearchTerm] = useState("");

  if (loading) return <div className="p-8">Loading master directory...</div>;
  if (error)
    return <div className="p-8 text-red-500">Error: {error.message}</div>;

  const filteredPatients = data?.getAllPatients.filter((p) =>
    `${p.firstName} ${p.lastName} ${p.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Master Patient Directory
          </h1>
          <p className="text-gray-500">
            View all clinic patients and their upcoming visits.
          </p>
        </div>
        <div className="relative w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search name or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-semibold text-gray-600">Patient</th>
              <th className="p-4 font-semibold text-gray-600">Contact</th>
              <th className="p-4 font-semibold text-gray-600">
                Next Appointment
              </th>
              <th className="p-4 font-semibold text-gray-600">
                Assigned Dentist
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPatients?.map((patient) => {
              // Find the earliest upcoming appointment
              const nextApt = patient.appointments
                ?.slice()
                .sort(
                  (a, b) =>
                    new Date(a.appointmentDate).getTime() -
                    new Date(b.appointmentDate).getTime(),
                )[0];

              return (
                <tr
                  key={patient.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-semibold text-gray-900">
                      {patient.firstName} {patient.lastName}
                    </div>
                  </td>
                  <td className="p-4 text-gray-500">{patient.email}</td>
                  <td className="p-4">
                    {nextApt ? (
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1.5 text-gray-900 font-medium">
                          <Calendar size={14} className="text-brand-500" />
                          {nextApt.appointmentDate}
                        </span>
                        <span className="text-sm text-gray-500 ml-5">
                          at {nextApt.appointmentTime}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">
                        No upcoming visits
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {nextApt ? (
                      <span className="flex items-center gap-1.5 text-gray-700">
                        <User size={14} className="text-blue-500" />
                        Dr. {nextApt.dentist.firstName}{" "}
                        {nextApt.dentist.lastName}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredPatients?.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No patients found.
          </div>
        )}
      </div>
    </div>
  );
};
