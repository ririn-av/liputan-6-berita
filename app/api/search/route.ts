import { NextRequest, NextResponse } from "next/server";
import { search, preprocess, Document } from "@/lib/tfidf";
import { scrapeArticle, URLS } from "@/lib/scraper";

// Cache scraped docs in memory for the process lifetime (serverless warm instance)
let cachedDocs: Document[] | null = null;

async function getDocs(): Promise<Document[]> {
  if (cachedDocs) return cachedDocs;

  const results = await Promise.all(
    URLS.map((url, i) => scrapeArticle(url, i + 1))
  );

  const docs: Document[] = results
    .filter((d): d is Document => d !== null)
    .map((d) => ({ ...d, isiPreprocessed: preprocess(d.isi) }));

  cachedDocs = docs;
  return docs;
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") ?? "";
  if (!query.trim()) {
    return NextResponse.json({ results: [], query: "" });
  }

  try {
    const docs = await getDocs();
    const results = search(query, docs);

    const formatted = results.slice(0, 10).map((r) => ({
      score: parseFloat(r.score.toFixed(4)),
      no: r.doc.no,
      url: r.doc.url,
      judul: r.doc.judul,
      isi: r.doc.isi.slice(0, 200),
    }));

    return NextResponse.json({ results: formatted, query, total: results.length });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
