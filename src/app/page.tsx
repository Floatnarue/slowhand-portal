"use client";

import { useState } from "react";
import Image from "next/image";
import { PickupStatus } from "../services/googleSheets";

export default function Home() {
  const [serial, setSerial] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PickupStatus | null>(null);

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
    <div className="min-h-screen bg-brand-green text-brand-cream font-sans relative overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 opacity-60 pointer-events-none z-0">
        {/* Mobile Background */}
        <div className="sm:hidden absolute inset-0">
          <Image
            src="/mobile-bg.png"
            alt="Mobile Background"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
        {/* Desktop Background */}
        <div className="hidden sm:block absolute inset-0">
          <Image
            src="/desktop-bg.png"
            alt="Desktop Background"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      </div>

      <main className="w-full max-w-3xl px-6 py-12 flex flex-col items-center relative z-10">
        {/* Header with Logo */}
        <header className="w-full flex flex-col items-center mb-16">
          <div className="relative w-64 h-24 mb-6">
            <Image
              src="/logo.png"
              alt="Slowhand Logo"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-center opacity-90">
            Product Tracking
          </h1>
          <div className="w-12 h-1 bg-brand-rust mt-4 rounded-full"></div>
        </header>

        <form onSubmit={handleSearch} className="w-full mb-12">
          <div className="relative group flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                className="w-full bg-brand-cream/5 border-2 border-brand-cream/20 rounded-xl px-6 py-4 text-xl focus:outline-none focus:border-brand-rust focus:bg-brand-cream/10 transition-all placeholder:text-brand-cream/30"
                placeholder="Serial Number (e.g. SH-001)"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                disabled={loading}
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading || !serial.trim()}
              className="w-full sm:w-auto px-10 py-4 bg-brand-rust hover:bg-brand-rust/90 text-brand-cream font-bold uppercase tracking-wider rounded-xl transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
            >
              {loading ? "Searching..." : "Track"}
            </button>
          </div>
        </form>

        {/* Results / Feedback Section */}
        <div className="w-full relative min-h-[300px]">
          {error && (
            <div className="p-8 rounded-2xl bg-red-950/20 border-2 border-red-900/30 backdrop-blur-md flex flex-col items-center text-center">
              <span className="text-4xl mb-4">⚠️</span>
              <h3 className="text-xl font-semibold mb-2">{error}</h3>
              <p className="opacity-60 text-sm">
                Please check your serial number and try again.
              </p>
            </div>
          )}

          {data && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-3xl bg-brand-cream/10 border border-brand-cream/20 backdrop-blur-xl overflow-hidden shadow-2xl">
              <div className="p-8 pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-brand-cream/10 pb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-rust block mb-1">
                      Serial Verified
                    </span>
                    <h2 className="text-5xl font-mono tracking-tighter">
                      {data.serialNumber}
                    </h2>
                  </div>
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-rust text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-3"></span>
                    {data.status}
                  </div>
                </div>

                {/* Specs Table */}
                <div className="overflow-x-auto -mx-8 px-8 mb-8">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr>
                        <th className="py-4 px-4 border-b border-brand-cream/20">
                          <div className="relative w-20 h-8 opacity-50">
                            <Image
                              src="/logo.png"
                              alt="Logo"
                              fill
                              className="object-contain object-left"
                            />
                          </div>
                        </th>
                        <th className="py-4 px-6 bg-brand-green/60 border border-brand-cream/20 text-center text-xs font-bold uppercase tracking-widest">
                          Neck
                        </th>
                        <th className="py-4 px-6 bg-brand-green/60 border border-brand-cream/20 text-center text-xs font-bold uppercase tracking-widest">
                          Middle
                        </th>
                        <th className="py-4 px-6 bg-brand-green/60 border border-brand-cream/20 text-center text-xs font-bold uppercase tracking-widest">
                          Bridge
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr>
                        <td className="py-4 px-4 font-bold uppercase tracking-widest text-[10px] opacity-60 border-b border-brand-cream/10">
                          Type
                        </td>
                        <td className="py-4 px-6 border border-brand-cream/10 text-center font-medium">
                          {data.spec.neck?.type || "-"}
                        </td>
                        <td className="py-4 px-6 border border-brand-cream/10 text-center font-medium">
                          {data.spec.middle?.type || "-"}
                        </td>
                        <td className="py-4 px-6 border border-brand-cream/10 text-center font-medium">
                          {data.spec.bridge?.type || "-"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 px-4 font-bold uppercase tracking-widest text-[10px] opacity-60 border-b border-brand-cream/10">
                          MAGNET
                        </td>
                        <td className="py-4 px-6 border border-brand-cream/10 text-center font-medium">
                          {data.spec.neck?.magnet || "-"}
                        </td>
                        <td className="py-4 px-6 border border-brand-cream/10 text-center font-medium">
                          {data.spec.middle?.magnet || "-"}
                        </td>
                        <td className="py-4 px-6 border border-brand-cream/10 text-center font-medium">
                          {data.spec.bridge?.magnet || "-"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 px-4 font-bold uppercase tracking-widest text-[10px] opacity-60 border-b border-brand-cream/10">
                          Magnet wire
                        </td>
                        <td className="py-4 px-6 border border-brand-cream/10 text-center font-medium">
                          {data.spec.neck?.magnetWire || "-"}
                        </td>
                        <td className="py-4 px-6 border border-brand-cream/10 text-center font-medium">
                          {data.spec.middle?.magnetWire || "-"}
                        </td>
                        <td className="py-4 px-6 border border-brand-cream/10 text-center font-medium">
                          {data.spec.bridge?.magnetWire || "-"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 px-4 font-bold uppercase tracking-widest text-[10px] opacity-60 border-b border-brand-cream/10">
                          DCR
                        </td>
                        <td className="py-4 px-6 border border-brand-cream/10 text-center font-mono text-brand-rust font-bold">
                          {data.spec.neck?.dcr
                            ? (parseFloat(data.spec.neck.dcr) / 1000).toFixed(
                                1,
                              ) + "K"
                            : "-"}
                        </td>
                        <td className="py-4 px-6 border border-brand-cream/10 text-center font-mono text-brand-rust font-bold">
                          {data.spec.middle?.dcr
                            ? (parseFloat(data.spec.middle.dcr) / 1000).toFixed(
                                1,
                              ) + "K"
                            : "-"}
                        </td>
                        <td className="py-4 px-6 border border-brand-cream/10 text-center font-mono text-brand-rust font-bold">
                          {data.spec.bridge?.dcr
                            ? (parseFloat(data.spec.bridge.dcr) / 1000).toFixed(
                                1,
                              ) + "K"
                            : "-"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="px-8 py-4 bg-brand-rust/20 border-t border-brand-cream/10 flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-widest opacity-60">
                  Last Updated
                </span>
                <span className="font-mono">{data.lastUpdate}</span>
              </div>
            </div>
          )}

          {/* {!data && !error && !loading && (
            <div className="flex flex-col items-center justify-center opacity-30 py-20 grayscale">
              <div className="relative w-24 h-24 mb-6">
                <Image
                  src="/logo.png"
                  alt="Background Logo"
                  fill
                  sizes="96px"
                  className="object-contain"
                />
              </div>
            </div>
          )} */}
        </div>
      </main>

      <footer
        className="w-full mt-auto py-8 text-center opacity-30 text-[10px] uppercase tracking-widest font-bold relative z-10"
        suppressHydrationWarning
      >
        © {new Date().getFullYear()} Slowhand Guitar Pickups. All Rights
        Reserved.
      </footer>
    </div>
  );
}
