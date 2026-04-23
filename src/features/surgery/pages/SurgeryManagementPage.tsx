import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_SURGERY } from "../graphql/surgery.queries";
import { DoorOpen } from "lucide-react";
import toast from "react-hot-toast";

interface CreateSurgeryResponse {
  createSurgery: {
    id: string;
    name: string;
    locationAddress: string;
    telephoneNumber: string;
  };
}

interface CreateSurgeryVariables {
  input: {
    name: string;
    locationAddress: string;
    telephoneNumber: string;
  };
}

export const SurgeryManagementPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    locationAddress: "",
    telephoneNumber: "",
  });

  const [createSurgery, { loading, error, data }] = useMutation<
    CreateSurgeryResponse,
    CreateSurgeryVariables
  >(CREATE_SURGERY, {
    onCompleted: (data) => {
      toast.success(`Surgery Room "${data.createSurgery.name}" created!`);
      setFormData({ name: "", locationAddress: "", telephoneNumber: "" });
    },
    onError: (error) => toast.error(error.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSurgery({ variables: { input: formData } });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6 text-brand-600">
        <DoorOpen size={28} />
        <h1 className="text-2xl font-bold text-gray-900">Add Surgery Room</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            {error.message}
          </div>
        )}
        {data && (
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            Room created!
          </div>
        )}

        <input
          placeholder="Room Name (e.g. Surgery 1)"
          className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        {/* 4. Updated inputs for address and telephone */}
        <input
          placeholder="Location Address (e.g. 123 Health Way, Floor 1)"
          className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
          value={formData.locationAddress}
          onChange={(e) =>
            setFormData({ ...formData, locationAddress: e.target.value })
          }
          required
        />
        <input
          placeholder="Telephone Number (e.g. 555-0198)"
          type="tel"
          className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
          value={formData.telephoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, telephoneNumber: e.target.value })
          }
          required
        />

        <button
          type="submit"
          className="w-full py-3 bg-brand-900 text-white font-bold rounded-lg hover:bg-black transition-colors"
          disabled={loading}
        >
          {loading ? "Creating..." : "Register Room"}
        </button>
      </form>
    </div>
  );
};
