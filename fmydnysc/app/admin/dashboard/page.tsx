"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface RegistrationRecord {
  id: string;
  first_name: string;
  last_name: string;
  organisation: string;
  status: string;
  phone: string;
  email: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [records, setRecords] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await fetch("/api/admin/registrations", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (res.status === 401 || res.status === 403) {
          router.push("/admin/login");
          return;
        }
        if (!res.ok) throw new Error("Failed to load registration data.");
        const data = await res.json();
        setRecords(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const res = await fetch("/api/admin/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        router.push("/admin/login");
        return;
      }
      setError("Logout failed on server. Clearing view.");
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    } finally {
      setLoggingOut(false);
    }
  };

  const exportToExcel = () => {
    if (records.length === 0) return;

    const headers = [
      "First Name", 
      "Last Name", 
      "Organisation", 
      "Status", 
      "Email", 
      "Phone"
    ];

    const rows = records.map(r => [
      `"${r.first_name.replace(/"/g, '""')}"`,
      `"${r.last_name.replace(/"/g, '""')}"`,
      `"${r.organisation.replace(/"/g, '""')}"`,
      `"${r.status.replace(/"/g, '""')}"`,
      `"${r.email.replace(/"/g, '""')}"`,
      `"${r.phone.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Attendee_Roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col justify-between print:bg-white print:p-0">
    
      <div className="absolute inset-0 bg-[linear-gradient(rgba(26,71,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(26,71,42,0.04)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none print:hidden" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none print:hidden" />

      <header className="relative z-10 border-b border-black bg-white backdrop-blur-sm print:border-b-2">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <img src="/1.jpeg" alt=" " className="h-10 w-auto object-contain" />
            <div>
              <h1 className="text-sm font-black uppercase tracking-wider text-black">Admin Management Console</h1>
              <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest"> CHINA-NIGERIA YOUTH EXCHANGE SEMINAR ON CHINA-AFRICA COMMUNITY WITH A SHARED FUTURE</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            disabled={loggingOut} 
            className="border border-red-700 hover:bg-red-700 hover:text-white transition-all px-4 py-2 text-xs font-black uppercase tracking-widest text-black rounded-sm disabled:opacity-50 print:hidden" 
          >
            {loggingOut ? "Exiting..." : "Log Out"}
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex-grow w-full print:py-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 print:grid-cols-3 print:gap-2 print:mb-4">
          <div className="bg-white border border-black p-6 rounded-sm shadow-sm print:p-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-black/50">Total Registered Attendees</p>
            <p className="text-3xl font-black text-black mt-1">{loading ? "..." : records.length}</p>
          </div>
          <div className="bg-white border border-black p-6 rounded-sm shadow-sm print:p-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-black/50">Target Capacity Status</p>
            <p className="text-3xl font-black text-emerald-700 mt-1">Active</p>
          </div>
          <div className="bg-white border border-black p-6 rounded-sm shadow-sm print:p-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-black/50">Event Date Reference</p>
            <p className="text-xl font-black text-black mt-2">JUNE 17, 2026</p>
          </div>
        </div>

        {!loading && records.length > 0 && (
          <div className="flex justify-end gap-3 mb-4 print:hidden">
            <button 
              onClick={exportToExcel}
              className="bg-white hover:bg-gray-50 text-black font-black uppercase tracking-widest text-[11px] border border-black px-4 py-2 transition-all rounded-sm"
            >
              Export Excel (CSV)
            </button>
            <button 
              onClick={exportToPDF}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[11px] px-4 py-2 transition-all rounded-sm"
            >
              Save as PDF
            </button>
          </div>
        )}

        {loading ? (
          <div className="border border-black p-12 text-center bg-white">
            <p className="text-sm font-bold text-black uppercase tracking-widest animate-pulse">Loading Registrations...</p>
          </div>
        ) : error ? (
          <div className="border border-red-500 bg-red-50 p-6 text-red-700 text-sm font-medium rounded-sm" role="alert">
            ⚠ {error}
          </div>
        ) : records.length === 0 ? (
          <div className="border border-black border-dashed p-12 text-center bg-white">
            <p className="text-sm text-black/50 uppercase font-black tracking-wider">No attendee records found.</p>
          </div>
        ) : (
          <div className="bg-white border border-black overflow-hidden shadow-sm print:border-0 print:shadow-none">
            <div className="p-4 border-b border-black bg-gray-50 print:px-0 print:bg-white">
              <h2 className="text-xs font-black uppercase tracking-widest text-black">Attendee Roster Submissions</h2>
            </div>
            <div className="overflow-x-auto print:overflow-visible">
              <table className="w-full text-left border-collapse print:table-fixed">
                <thead>
                  <tr className="border-b border-black bg-white text-black text-[10px] font-black uppercase tracking-wider print:border-b-2">
                    <th className="p-4 border-r border-black print:p-2 print:w-1/5">Name</th>
                    <th className="p-4 border-r border-black print:p-2 print:w-1/5">Organisation</th>
                    <th className="p-4 border-r border-black print:p-2 print:w-1/5">Status</th>
                    <th className="p-4 border-r border-black print:p-2 print:w-1/5">Contact</th>
                    <th className="p-4 print:p-2 print:w-1/5">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs text-black print:divide-y-2 print:divide-black">
                  {records.map((attendee) => (
                    <tr key={attendee.id} className="hover:bg-emerald-50/30 transition-colors print:break-inside-avoid">
                      <td className="p-4 border-r border-black font-bold whitespace-nowrap print:p-2 print:whitespace-normal">
                        <div>{attendee.first_name}</div>
                        <div>{attendee.last_name}</div>
                      </td>
                      <td className="p-4 border-r border-black print:p-2">
                        <div className="font-semibold">{attendee.organisation}</div>
                      </td>
                      <td className="p-4 border-r border-black print:p-2">
                        <div className="font-semibold">{attendee.status}</div>
                      </td>
                      <td className="p-4 border-r border-black font-mono text-[11px] print:p-2">
                        <div>{attendee.email}</div>
                        <div className="text-black/60">{attendee.phone}</div>
                      </td>
                      <td className="p-4 print:p-2 text-center font-medium">
                        <span className="text-emerald-700">
                          {new Date(attendee.created_at).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 border-t border-black bg-white py-6 print:mt-4 print:py-2">
        <p className="text-center text-xs text-black/70 max-w-4xl mx-auto px-6">
Bullet Building, Shehu Shagari Way, Central Business District, Abuja, Federal Capital
      </footer>
    </div>
  );
}