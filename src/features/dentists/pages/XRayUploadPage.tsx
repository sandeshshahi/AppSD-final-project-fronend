import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { UPLOAD_XRAY } from "../graphql/dentist.queries";
import { Upload, ImageIcon, X } from "lucide-react";

export const XRayUploadPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const [uploadXRay, { loading, error }] = useMutation(UPLOAD_XRAY, {
    onCompleted: () => navigate("/patients"),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string); // This is our Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview) return;

    await uploadXRay({
      variables: {
        patientId: parseInt(patientId!),
        base64Image: preview,
        description,
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold mb-6">Upload Medical Image (X-Ray)</h1>

      <form onSubmit={handleUpload} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">
            {error.message}
          </div>
        )}

        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center relative">
          {preview ? (
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="max-h-64 rounded-lg shadow-sm"
              />
              <button
                type="button"
                onClick={() => setPreview(null)}
                title="Remove image"
                aria-label="Remove uploaded image"
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer flex flex-col items-center">
              <ImageIcon className="text-gray-300 mb-4" size={48} />
              <span className="text-brand-600 font-medium">
                Click to select image
              </span>
              <span className="text-xs text-gray-400 mt-1">
                PNG, JPG up to 5MB
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clinical Notes / Description
          </label>
          <textarea
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 h-32 outline-none"
            placeholder="Describe the findings of this X-Ray..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !preview}
          className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-lg transition-colors disabled:bg-gray-300 flex items-center justify-center gap-2"
        >
          <Upload size={20} />
          {loading ? "Uploading to Cloudinary..." : "Confirm Upload"}
        </button>
      </form>
    </div>
  );
};
