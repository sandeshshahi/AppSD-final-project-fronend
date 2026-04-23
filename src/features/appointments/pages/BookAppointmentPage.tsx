import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import {
  GET_BOOKING_DATA,
  BOOK_APPOINTMENT,
} from "../graphql/appointment.queries";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";
import { GET_MY_APPOINTMENTS } from "../graphql/my-appointments.queries";

interface BookingData {
  getDentists: { id: string; firstName: string; lastName: string }[];
  getSurgeries: { id: string; name: string }[];
}

export const BookAppointmentPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dentistId: "",
    surgeryId: "",
    date: "",
    time: "",
  });

  const { data, loading: dataLoading } = useQuery<BookingData>(
    GET_BOOKING_DATA,
    {
      fetchPolicy: "network-only",
    },
  );

  const [bookAppointment, { loading: bookingLoading, error }] = useMutation(
    BOOK_APPOINTMENT,
    {
      refetchQueries: [
        {
          query: GET_MY_APPOINTMENTS,
          variables: { patientId: user?.id },
        },
      ],
      awaitRefetchQueries: true,

      onCompleted: () => {
        toast.success(
          "Appointment booked! A confirmation email has been sent to you.",
          { duration: 5000, icon: "📧" },
        );
        navigate("/dashboard");
      },
      onError: (error) => {
        toast.error(`Booking failed: ${error.message}`);
      },
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await bookAppointment({
      variables: {
        input: {
          patientId: user?.id,
          dentistId: formData.dentistId,
          surgeryId: formData.surgeryId,
          appointmentDate: formData.date,
          appointmentTime: formData.time,
        },
      },
    });
  };

  if (dataLoading)
    return <div className="p-8">Preparing booking system...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Schedule New Appointment
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-md text-sm">
            {error.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dentist Selection */}
          <div>
            <label
              htmlFor="dentist-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Dentist
            </label>
            <select
              id="dentist-select"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              value={formData.dentistId}
              onChange={(e) =>
                setFormData({ ...formData, dentistId: e.target.value })
              }
            >
              <option value="">Choose a Dentist...</option>
              {data?.getDentists.map((d: any) => (
                <option key={d.id} value={d.id}>
                  Dr. {d.firstName} {d.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Surgery Room Selection */}
          <div>
            <label
              htmlFor="surgery-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Surgery Room
            </label>
            <select
              id="surgery-select"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              value={formData.surgeryId}
              onChange={(e) =>
                setFormData({ ...formData, surgeryId: e.target.value })
              }
            >
              <option value="">Choose a Room...</option>
              {data?.getSurgeries.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label
              htmlFor="appointment-date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Date
            </label>
            <input
              id="appointment-date"
              type="date"
              required
              min={new Date().toISOString().split("T")[0]} // No past dates
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>

          {/* Time Picker */}
          <div>
            <label
              htmlFor="appointment-time"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Time (HH:MM)
            </label>
            <input
              id="appointment-time"
              type="time"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={bookingLoading}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-400"
        >
          {bookingLoading ? "Reserving..." : "Confirm Appointment"}
        </button>
      </form>
    </div>
  );
};
