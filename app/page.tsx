"use client";
import { useState, useRef } from "react";

interface Result {
  score: number;
  no: number;
  url: string;
  judul: string;
  isi: string;
}

interface SearchResponse {
  results: Result[];
  query: string;
  total: number;
  error?: string;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [processedQuery, setProcessedQuery] = useState("");
  const [total, setTotal] = useState(0);
  const [topScore, setTopScore] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setSearched(false);
    const t0 = performance.now();

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data: SearchResponse = await res.json();
      const t1 = performance.now();

      if (data.error) {
        setError(data.error);
      } else {
        setResults(data.results);
        setProcessedQuery(data.query);
        setTotal(data.total);
        setTopScore(data.results[0]?.score ?? 0);
        setElapsed(parseFloat(((t1 - t0) / 1000).toFixed(2)));
        setSearched(true);
      }
    } catch {
      setError("Gagal menghubungi server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen" style={{ background: "#f5f0ff" }}>
      {/* HERO HEADER */}
      <div
        className="relative flex flex-col items-center justify-center pt-12 pb-16 px-4"
        style={{ background: "linear-gradient(135deg, #6b21a8 0%, #7c3aed 60%, #a855f7 100%)" }}
      >
        {/* Icon */}
        <div
          className="mb-5 flex items-center justify-center rounded-2xl shadow-lg"
          style={{ width: 72, height: 72, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)" }}
        >
          <svg width="36" height="36" fill="white" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6zm2-5h8v1.5H8V15zm0-3h8v1.5H8V12zm0-3h5v1.5H8V9z"/>
          </svg>
        </div>

        <h1 className="text-white text-4xl font-bold tracking-tight mb-2" style={{ fontFamily: "Georgia, serif" }}>
          Mesin Pencari Dokumen
        </h1>
        <p className="text-purple-200 text-sm tracking-widest font-semibold">
          TF-IDF · COSINE SIMILARITY · SASTRAWI · 50 DOKUMEN
        </p>
      </div>

      {/* SEARCH AREA */}
      <div className="max-w-3xl mx-auto px-4 -mt-7">
        <div className="bg-white rounded-2xl shadow-xl px-6 py-6">
          <form onSubmit={handleSearch} className="flex gap-3 items-center">
            {/* Search icon */}
            <svg className="shrink-0" width="22" height="22" fill="none" stroke="#a855f7" strokeWidth="2.2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ketik kata kunci pencarian di sini..."
              className="flex-1 outline-none text-base text-gray-700 placeholder-gray-400"
              style={{ border: "none", background: "transparent" }}
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 text-white font-semibold px-5 py-2.5 rounded-full transition disabled:opacity-60"
              style={{ background: "linear-gradient(90deg,#7c3aed,#a855f7)", fontSize: 15 }}
            >
              <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              {loading ? "Mencari..." : "Cari"}
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-3">
            Tekan <kbd className="bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 text-gray-600 font-mono text-xs">Enter</kbd> atau klik Cari untuk memulai
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16 text-purple-300">
            <div className="text-5xl mb-3 animate-spin inline-block">⚙️</div>
            <p className="text-sm text-gray-500">Sedang memproses query & menghitung TF-IDF...</p>
            <p className="text-xs mt-1 text-gray-400">Pertama kali butuh waktu lebih lama (scraping 50 artikel)</p>
          </div>
        )}

        {/* Empty state */}
        {!searched && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-16 text-purple-200">
            <svg width="60" height="60" fill="none" stroke="#d8b4fe" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <p className="mt-3 text-sm text-gray-400">Mulai pencarian untuk melihat hasil</p>
          </div>
        )}

        {/* Results */}
        {searched && !loading && (
          <>
            {/* Stats badges */}
            <div className="flex flex-wrap gap-2 mt-5 mb-4">
              <span className="flex items-center gap-1.5 bg-white border border-purple-100 rounded-full px-3 py-1.5 text-sm text-gray-700 shadow-sm">
                <svg width="14" height="14" fill="#7c3aed" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/></svg>
                <strong>{total}</strong> dokumen ditemukan
              </span>
              {processedQuery && (
                <span className="flex items-center gap-1.5 bg-white border border-purple-100 rounded-full px-3 py-1.5 text-sm text-gray-700 shadow-sm">
                  <span style={{ color: "#7c3aed", fontWeight: 700, fontSize: 13 }}>T</span>
                  {processedQuery}
                </span>
              )}
              {total > 0 && (
                <span className="flex items-center gap-1.5 bg-white border border-purple-100 rounded-full px-3 py-1.5 text-sm text-gray-700 shadow-sm">
                  <svg width="14" height="14" fill="#7c3aed" viewBox="0 0 24 24"><path d="M4 20V8l8-6 8 6v12H4zm2-2h4v-6h4v6h4v-9.5L12 4.1 6 8.5V18z"/></svg>
                  Skor tertinggi: <strong>{topScore.toFixed(4)}</strong>
                </span>
              )}
              <span className="flex items-center gap-1.5 bg-white border border-purple-100 rounded-full px-3 py-1.5 text-sm text-gray-700 shadow-sm">
                <svg width="14" height="14" fill="none" stroke="#7c3aed" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                {elapsed}s
              </span>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-white rounded-2xl shadow-sm">
                Tidak ada dokumen yang cocok dengan "<strong>{query}</strong>"
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((r, i) => (
                  <div
                    key={r.no}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-5 flex gap-4"
                    style={{ borderLeft: "4px solid #7c3aed" }}
                  >
                    {/* Number badge */}
                    <div
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}
                    >
                      {i + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-base leading-snug hover:underline"
                          style={{ color: "#6b21a8" }}
                        >
                          {r.judul || "(Judul tidak tersedia)"}
                        </a>
                        {/* Score badge */}
                        <span
                          className="shrink-0 flex items-center gap-1 text-white text-xs font-bold px-3 py-1 rounded-full"
                          style={{ background: "linear-gradient(90deg,#7c3aed,#a855f7)" }}
                        >
                          <svg width="12" height="12" fill="white" viewBox="0 0 24 24"><path d="M3 22v-8.5l9-9 9 9V22H3zm2-2h4v-5h6v5h4v-6.6l-7-7-7 7V20z"/></svg>
                          {r.score.toFixed(4)}
                        </span>
                      </div>

                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-purple-400 hover:underline truncate block mt-1"
                      >
                        🔗 {r.url}
                      </a>

                      <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                        {r.isi ? r.isi + "..." : "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <p className="text-center text-xs text-gray-300 mt-10 pb-8">
          Liputan6 Search Engine · TF-IDF + Cosine Similarity · 50 dokumen
        </p>
      </div>
    </main>
  );
}
