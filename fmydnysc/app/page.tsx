"use client";

import { useState } from "react";

const organizations = ["FMYD", "NYSC"];
const statuses = ["Government Official", "Youth Participant"];

export default function RegistrationPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [status, setStatus] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const validateForm = () => {
    if (!firstName.trim()) return "First name is required";
    if (!lastName.trim()) return "Last name is required";
    if (!organisation.trim()) return "Organisation is required";
    if (!status.trim()) return "Status is required";
    if (!phone.trim()) return "Phone number is required";
    if (!/^\+?[0-9\s\-]{7,15}$/.test(phone.trim())) return "Valid phone number is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return "Valid email is required";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const err = validateForm();
    if (err) { 
      setError(err); 
      return; 
    }

    setLoading(true);

    const payload = {
      first_name: firstName,
      last_name: lastName,
      organisation,
      status,
      phone,
      email,
    };

    try {
      const res = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessMessage("Successful. Thank you for registering.");
        setTimeout(() => window.location.reload(), 3000);
        return;
      }

      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Submission failed. Please try again.");
    } catch {
      setError("Network error. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white border border-black/70 text-black text-sm px-4 py-3 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all placeholder:text-black/40 rounded-sm";

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(26,71,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(26,71,42,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none" />

      <header className="relative z-10 border-b border-black bg-white backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-6 flex w-full items-center justify-between">
  <img src="/download26.jpeg" alt="Left Event Logo" className="h-16 w-auto object-contain" />
  <img src="/download25.png" alt="Right Event Logo" className="h-16 w-auto object-contain" />
</div>

          <div className="text-center mb-6">
            <p className="text-sm font-bold text-emerald-800 tracking-widest uppercase">
              CHINA-NIGERIA YOUTH EXCHANGE SEMINAR ON CHINA-AFRICA COMMUNITY WITH A SHARED FUTURE
            </p>
          </div>
          <div className="text-center mt-6 text-xs text-black">
            DATE: JUNE 1st, 2026<br/>TIME: 09:00am prompt<br/>VENUE: CHINESE CULTURAL CENTER, WUSE ZONE 5, FCT, ABUJA
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black text-black uppercase tracking-tight mb-3">
            Registration Form
          </h1>
        </div>

        <div className="bg-white border border-black p-8 sm:p-10">
          {successMessage ? (
            <div className="p-8 text-center bg-emerald-50 border-2 border-emerald-600 rounded-sm my-4" role="status">
              <p className="text-xl font-black text-emerald-900 uppercase tracking-wide mb-2">Success!</p>
              <p className="text-base font-bold text-black">{successMessage}</p>
              <p className="text-xs text-emerald-800/60 mt-4 animate-pulse">Refreshing registration window...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">First Name <span className="text-emerald-600">*</span></label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="e.g. Amaka" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Last Name <span className="text-emerald-600">*</span></label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="e.g. Okonkwo" className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">Organisation <span className="text-emerald-600">*</span></label>
                <select value={organisation} onChange={(e) => setOrganisation(e.target.value)} className={inputClass}>
                  <option value="">Select Organisation</option>
                  {organizations.map((org) => (
                    <option key={org} value={org}>{org}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">Status <span className="text-emerald-600">*</span></label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
                  <option value="">Select Status</option>
                  {statuses.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Phone Number <span className="text-emerald-600">*</span></label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08012345678" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Email Address <span className="text-emerald-600">*</span></label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded" role="alert">
                  ⚠ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 py-4 text-white font-bold text-lg transition-all mt-6"
              >
                {loading ? "Submitting..." : "Submit Registration"}
              </button>
            </form>
          )}
        </div>
      </main>

      <footer className="relative z-10 border-t border-black bg-white py-6 mt-16">
        <p className="text-center text-sm text-black/70">
Bullet Building, Shehu Shagari Way, Central Business District, Abuja, Federal Capital </p>
      </footer>
    </div>
  );
}