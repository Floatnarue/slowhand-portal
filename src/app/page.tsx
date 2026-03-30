"use client";

import { useState } from "react";

export default function Home() {
  const [serial, setSerial] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    serialNumber: string;
    model: string;
    outputK: string;
    status: string;
    lastUpdate: string;
  } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serial.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/track/${encodeURIComponent(serial)}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Could not find your product");
      }
      setData(json);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-zinc-800 font-sans px-4 sm:px-6 flex items-center justify-center relative overflow-hidden">
      {/* Dynamic Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-900/40 via-blue-900/10 to-transparent rounded-full blur-[120px] -z-10 pointer-events-none opacity-50"></div>

      <main className="w-full max-w-xl mx-auto pt-20 md:pt-0 pb-20">
        <header className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
            Slowhand Portal
          </h1>
          <p className="text-zinc-400 text-lg">
            Track your bespoke guitar pickup production status.
          </p>
        </header>

        <form
          onSubmit={handleSearch}
          className="mb-10 relative transition-all duration-300 transform group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-700 to-zinc-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative flex bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-2 items-center border border-zinc-800">
            <input
              type="text"
              className="flex-1 w-full bg-transparent px-5 py-3 text-lg text-white placeholder-zinc-500 outline-none"
              placeholder="Enter your Serial Number"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !serial.trim()}
              className="ml-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hidden sm:block shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            >
              {loading ? "Searching..." : "Track"}
            </button>
            <button
              type="submit"
              disabled={loading || !serial.trim()}
              className="ml-2 p-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed sm:hidden shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
          </div>
        </form>

        <div className="min-h-[200px] relative">
          {error && (
            <div className="absolute inset-0 p-6 rounded-2xl bg-red-950/30 border border-red-900/50 backdrop-blur-sm flex flex-col items-center justify-center text-center transition-all duration-500">
              <svg
                className="w-10 h-10 text-red-500 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="text-red-400 font-semibold text-lg">{error}</h3>
              <p className="text-red-400/70 text-sm mt-1">
                Please verify your serial number and try again.
              </p>
            </div>
          )}

          {data && (
            <div className="absolute inset-x-0 top-0 transition-all duration-700 ease-out transform translate-y-0 opacity-100 rounded-3xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl overflow-hidden shadow-2xl">
              <div className="px-6 py-8 sm:px-8 bg-gradient-to-b from-zinc-800/20 to-transparent relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-500/10 rounded-full blur-3xl -z-10"></div>
                  <div>
                    <p className="text-zinc-500 text-sm uppercase tracking-widest font-bold mb-1">
                      Serial Number
                    </p>
                    <p className="font-mono text-3xl font-medium tracking-wider text-white drop-shadow-sm">
                      {data.serialNumber}
                    </p>
                  </div>
                  <div className="self-start sm:self-auto inline-flex items-center px-4 py-2 rounded-full bg-black/50 border border-zinc-800/80 shadow-inner">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mr-2.5 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                    <span className="text-sm font-semibold text-zinc-200 tracking-wide uppercase">
                      {data.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/60 rounded-2xl p-5 border border-zinc-800/50 shadow-inner">
                    <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">
                      Model
                    </p>
                    <p className="text-xl font-medium text-zinc-100">
                      {data.model}
                    </p>
                  </div>
                  <div className="bg-black/60 rounded-2xl p-5 border border-zinc-800/50 shadow-inner">
                    <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">
                      Output
                    </p>
                    <p className="text-xl font-medium text-zinc-100 tracking-tight">
                      {data.outputK}{" "}
                      <span className="text-zinc-500 text-base font-normal">
                        kΩ
                      </span>
                    </p>
                  </div>
                  <div className="bg-black/60 rounded-2xl p-5 border border-zinc-800/50 shadow-inner col-span-2 flex justify-between items-center sm:hidden">
                    <div>
                      <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">
                        Last Update
                      </p>
                      <p className="text-base text-zinc-300 font-medium">
                        {data.lastUpdate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 sm:px-8 border-t border-zinc-800/50 bg-black/40 flex justify-between items-center hidden sm:flex">
                <p className="text-zinc-500 text-sm font-medium">
                  Last modification
                </p>
                <p className="text-zinc-300 text-sm font-medium">
                  {data.lastUpdate}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
