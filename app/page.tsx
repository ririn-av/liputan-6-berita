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

  const s = {
    page: { minHeight: "100vh", background: "#f5f0ff", fontFamily: "Arial, sans-serif", margin: 0 },
    hero: { background: "linear-gradient(135deg, #6b21a8 0%, #7c3aed 60%, #a855f7 100%)", padding: "48px 16px 64px", display: "flex", flexDirection: "column" as const, alignItems: "center", textAlign: "center" as const },
    iconBox: { width: 72, height: 72, borderRadius: 16, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 },
    h1: { color: "white", fontSize: 36, fontWeight: "bold", margin: "0 0 8px", fontFamily: "Georgia, serif" },
    subtitle: { color: "#e9d5ff", fontSize: 13, letterSpacing: 2, fontWeight: 600, margin: 0 },
    searchWrap: { maxWidth: 720, margin: "0 auto", padding: "0 16px" },
    searchCard: { background: "white", borderRadius: 20, boxShadow: "0 8px 32px rgba(124,58,237,0.12)", padding: "20px 24px", marginTop: -28 },
    searchRow: { display: "flex", alignItems: "center", gap: 12 },
    input: { flex: 1, border: "none", outline: "none", fontSize: 16, color: "#374151", background: "transparent", padding: "4px 0" },
    btn: { background: "linear-gradient(90deg,#7c3aed,#a855f7)", color: "white", border: "none", borderRadius: 999, padding: "10px 20px", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 },
    hint: { textAlign: "center" as const, fontSize: 12, color: "#9ca3af", marginTop: 10 },
    kbd: { background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: 4, padding: "1px 6px", fontFamily: "monospace", fontSize: 11, color: "#4b5563" },
    badges: { display: "flex", flexWrap: "wrap" as const, gap: 8, margin: "20px 0 16px" },
    badge: { display: "flex", alignItems: "center", gap: 6, background: "white", border: "1px solid #ede9fe", borderRadius: 999, padding: "6px 14px", fontSize: 13, color: "#374151", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
    emptyState: { textAlign: "center" as const, padding: "60px 0", color: "#c4b5fd" },
    card: { background: "white", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", padding: "20px", display: "flex", gap: 16, marginBottom: 12, borderLeft: "4px solid #7c3aed" },
    numBadge: { minWidth: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "white", fontWeight: "bold", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" },
    cardTitle: { color: "#6b21a8", fontWeight: "bold", fontSize: 15, textDecoration: "none", lineHeight: 1.4 },
    cardUrl: { color: "#a78bfa", fontSize: 12, display: "block", marginTop: 4, textDecoration: "none" },
    cardIsi: { color: "#6b7280", fontSize: 13, marginTop: 8, lineHeight: 1.6 },
    scoreBadge: { background: "linear-gradient(90deg,#7c3aed,#a855f7)", color: "white", borderRadius: 999, padding: "3px 10px", fontSize: 12, fontWeight: "bold", whiteSpace: "nowrap" as const },
    footer: { textAlign: "center" as const, fontSize: 11, color: "#d1d5db", padding: "40px 0 24px" },
    error: { background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 12, padding: "12px 16px", fontSize: 13, marginTop: 16 },
    loading: { textAlign: "center" as const, padding: "60px 0", color: "#6b7280" },
    noResult: { textAlign: "center" as const, padding: "48px 0", color: "#9ca3af", background: "white", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  };

  return (
    <main style={s.page}>
      <div style={s.hero}>
        <div style={s.iconBox}>
          <svg width="36" height="36" fill="white" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6zm2-5h8v1.5H8V15zm0-3h8v1.5H8V12zm0-3h5v1.5H8V9z"/>
          </svg>
        </div>
        <h1 style={s.h1}>Mesin Pencari Dokumen</h1>
      
      </div>
      <div style={s.searchWrap}>
        <div style={s.searchCard}>
          <form onSubmit={handleSearch} style={s.searchRow}>
            <svg width="22" height="22" fill="none" stroke="#a855f7" strokeWidth="2.2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ketik kata kunci pencarian di sini..." style={s.input} />
            <button type="submit" disabled={loading} style={s.btn}>
              <svg width="15" height="15" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              {loading ? "Mencari..." : "Cari"}
            </button>
          </form>
          <p style={s.hint}>Tekan <kbd style={s.kbd}>Enter</kbd> atau klik Cari untuk memulai</p>
        </div>
        {error && <div style={s.error}>⚠️ {error}</div>}
        {loading && (
          <div style={s.loading}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚙️</div>
            <p>Sedang memproses query &amp; menghitung TF-IDF...</p>
            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>Pertama kali butuh waktu lebih lama</p>
          </div>
        )}
        {!searched && !loading && !error && (
          <div style={s.emptyState}>
            <svg width="56" height="56" fill="none" stroke="#d8b4fe" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <p style={{ marginTop: 12, fontSize: 13, color: "#9ca3af" }}>Mulai pencarian untuk melihat hasil</p>
          </div>
        )}
        {searched && !loading && (
          <>
            <div style={s.badges}>
              <span style={s.badge}>📄 <strong>{total}</strong> dokumen ditemukan</span>
              {processedQuery && <span style={s.badge}><span style={{ color: "#7c3aed", fontWeight: 700 }}>T</span> {processedQuery}</span>}
              {total > 0 && <span style={s.badge}>🏆 Skor tertinggi: <strong>{topScore.toFixed(4)}</strong></span>}
              <span style={s.badge}>⏱ {elapsed}s</span>
            </div>
            {results.length === 0 ? (
              <div style={s.noResult}>Tidak ada dokumen cocok dengan "<strong>{query}</strong>"</div>
            ) : (
              <div>
                {results.map((r, i) => (
                  <div key={r.no} style={s.card}>
                    <div style={s.numBadge}>{i + 1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                        <a href={r.url} target="_blank" rel="noopener noreferrer" style={s.cardTitle}>{r.judul || "(Judul tidak tersedia)"}</a>
                        <span style={s.scoreBadge}>{r.score.toFixed(4)}</span>
                      </div>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" style={s.cardUrl}>🔗 {r.url}</a>
                      <p style={s.cardIsi}>{r.isi ? r.isi + "..." : "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        <p style={s.footer}>Liputan6 Search Engine · TF-IDF + Cosine Similarity · 50 dokumen</p>
      </div>
    </main>
  );
}
