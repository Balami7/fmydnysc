"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Registration {
  id: string;
  firstName: string;
  lastName: string;
  organisation: string;
  status: string;
  phone: string;
  email: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await fetch("/api/admin/export");
      
      if (!response.ok) {
        throw new Error(`Export failed with status ${response.status}`);
      }

      const blob = await response.blob();
      
      if (blob.size === 0) {
        throw new Error("Export returned empty file");
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `registrations-${new Date().toISOString().split("T")[0]}.xlsx`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      alert("Excel file downloaded successfully!");
    } catch (err) {
      console.error("Export error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to export registrations";
      alert(`Error: ${errorMessage}`);
    } finally {
      setExporting(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await fetch("/api/registration");
        if (!response.ok) throw new Error("Failed to fetch registrations");

        const data = await response.json();
        setRegistrations(data.data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch registrations"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Registration Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Total Registrations: {registrations.length}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              disabled={exporting || registrations.length === 0}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              {exporting ? "Exporting..." : "📥 Export Excel"}
            </button>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
            >
              {loggingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {registrations.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-600">No registrations yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    First Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Last Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Organisation
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Registered
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {reg.firstName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {reg.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {reg.organisation}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {reg.status}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {reg.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {reg.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}