import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_DENTIST } from "../graphql/staff.queries";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";

interface CreateDentistResponse {
  createDentist: {
    id: string;
    firstName: string;
    lastName: string;
    specialization: string;
  };
}

interface CreateDentistVariables {
  input: {
    firstName: string;
    lastName: string;
    specialization: string;
    email: string;
    password: string;
  };
}

export const StaffManagementPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    specialization: "",
    email: "",
    password: "",
  });

  const [createDentist, { loading, error, data }] = useMutation<
    CreateDentistResponse,
    CreateDentistVariables
  >(CREATE_DENTIST, {
    onCompleted: (data) => {
      toast.success(`Dr. ${data.createDentist.lastName} has been registered!`);
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        specialization: "",
        email: "",
        password: "",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createDentist({ variables: { input: formData } });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Staff & User Management</h1>

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <UserPlus className="text-brand-500" />
          <h2 className="text-lg font-semibold">Register New Dentist</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              {error.message}
            </div>
          )}
          {data && (
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              Staff member registered successfully!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="First Name"
              required
              className="p-3 border border-gray-200 rounded-lg"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
            <input
              placeholder="Last Name"
              required
              className="p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
            <input
              placeholder="Specialization (e.g. Orthodontics)"
              required
              className="p-3 border border-gray-200 rounded-lg"
              value={formData.specialization}
              onChange={(e) =>
                setFormData({ ...formData, specialization: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="System Email"
              required
              className="p-3 border border-gray-200 rounded-lg"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Temporary Password"
              required
              className="p-3 border border-gray-200 rounded-lg"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-brand-900 text-white font-bold rounded-lg hover:bg-black transition-colors disabled:bg-gray-400"
          >
            {loading ? "Registering..." : "Confirm Staff Registration"}
          </button>
        </form>
      </div>
    </div>
  );
};
