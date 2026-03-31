"use client";

import { useState } from "react";
import Image from "next/image";

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
    <div className="min-h-screen bg-brand-green text-brand-cream font-sans relative overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 opacity-60 pointer-events-none -z-10">
        <Image
          src="/minor-pic.png"
          alt="Background Texture"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      <main className="w-full max-w-2xl px-6 py-12 flex flex-col items-center z-10">
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

        {/* Search Section */}
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="p-6 bg-brand-green/40 rounded-2xl border border-brand-cream/5">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 block mb-2">
                      Pickup Model
                    </span>
                    <span className="text-xl font-medium">{data.model}</span>
                  </div>
                  <div className="p-6 bg-brand-green/40 rounded-2xl border border-brand-cream/5">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 block mb-2">
                      Target Output
                    </span>
                    <span className="text-xl font-medium">
                      {data.outputK}{" "}
                      <span className="text-sm opacity-40">kΩ</span>
                    </span>
                  </div>
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
              <p className="text-center text-sm font-light uppercase tracking-widest italic">
                Awaiting serial input...
              </p>
            </div>
          )} */}
        </div>
      </main>

      <footer
        className="w-full mt-auto py-8 text-center opacity-30 text-[10px] uppercase tracking-widest font-bold"
        suppressHydrationWarning
      >
        © {new Date().getFullYear()} Slowhand Guitar Pickups. All Rights
        Reserved.
      </footer>
    </div>
  );
}
