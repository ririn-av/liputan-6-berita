import { STOPWORDS_ID } from "./stopwords-id";

export interface Document {
  no: number;
  url: string;
  judul: string;
  isi: string;
  isiPreprocessed?: string;
}

export interface SearchResult {
  score: number;
  doc: Document;
}

// Simple Indonesian stemmer (basic suffix stripping, approximating Sastrawi)
export function stem(word: string): string {
  const prefixes = ["me", "mem", "men", "meng", "menge", "pe", "pem", "pen", "peng", "penge", "ber", "ter", "ke", "se", "di"];
  const suffixes = ["kan", "an", "i", "nya"];

  let w = word;
  for (const sfx of suffixes) {
    if (w.endsWith(sfx) && w.length > sfx.length + 2) {
      w = w.slice(0, -sfx.length);
      break;
    }
  }
  for (const pfx of prefixes) {
    if (w.startsWith(pfx) && w.length > pfx.length + 2) {
      w = w.slice(pfx.length);
      break;
    }
  }
  return w;
}

// Preprocess text: lowercase, remove punctuation, remove stopwords, stem
export function preprocess(text: string): string {
  // Remove "liputan6.com, <day> -" header pattern
  text = text.replace(/^.*?liputan6\.com,?\s+\w+\s+-/i, "");
  text = text.toLowerCase();
  // Remove punctuation
  text = text.replace(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g, " ");
  // Tokenize
  const tokens = text.split(/\s+/).filter(Boolean);
  // Remove stopwords and stem
  const result = tokens
    .filter((w) => !STOPWORDS_ID.has(w) && w.length > 1)
    .map((w) => stem(w));
  return result.join(" ");
}

// Build TF-IDF vectors — same logic as the notebook's TfidfVectorizer
function buildTfIdf(docs: string[]): { matrix: number[][]; vocab: string[] } {
  const vocab: string[] = [];
  const vocabIdx: Record<string, number> = {};
  const tokenizedDocs: string[][] = docs.map((d) => d.split(/\s+/).filter(Boolean));

  // Build vocabulary
  tokenizedDocs.forEach((tokens) => {
    tokens.forEach((t) => {
      if (!(t in vocabIdx)) {
        vocabIdx[t] = vocab.length;
        vocab.push(t);
      }
    });
  });

  const N = docs.length;
  const V = vocab.length;

  // TF per document
  const tfMatrix: number[][] = tokenizedDocs.map((tokens) => {
    const tf = new Array(V).fill(0);
    const total = tokens.length || 1;
    tokens.forEach((t) => {
      tf[vocabIdx[t]] += 1 / total;
    });
    return tf;
  });

  // IDF
  const idf = new Array(V).fill(0);
  vocab.forEach((_, j) => {
    const df = tokenizedDocs.filter((tokens) => tokens.includes(vocab[j])).length;
    idf[j] = Math.log((N + 1) / (df + 1)) + 1; // sklearn-style smooth idf
  });

  // TF-IDF
  const matrix = tfMatrix.map((tf) =>
    tf.map((v, j) => v * idf[j])
  );

  // L2 normalize
  matrix.forEach((row) => {
    const norm = Math.sqrt(row.reduce((s, v) => s + v * v, 0)) || 1;
    row.forEach((_, j) => (row[j] /= norm));
  });

  return { matrix, vocab };
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot; // already L2-normalized
}

// Main search function — same logic as notebook
export function search(query: string, documents: Document[]): SearchResult[] {
  if (!documents.length) return [];

  const processedQuery = preprocess(query);
  const processedDocs = documents.map(
    (d) => d.isiPreprocessed ?? preprocess(d.isi)
  );

  // Combine query + docs as in notebook: vectorizer.fit_transform([query] + processed_paper)
  const allTexts = [processedQuery, ...processedDocs];
  const { matrix } = buildTfIdf(allTexts);

  const queryVec = matrix[0];
  const results: SearchResult[] = [];

  for (let i = 1; i < matrix.length; i++) {
    const score = cosineSimilarity(matrix[i], queryVec);
    if (score > 0.0) {
      results.push({ score, doc: documents[i - 1] });
    }
  }

  // Sort descending by score
  results.sort((a, b) => b.score - a.score);
  return results;
}
