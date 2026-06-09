import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Liputan6 Search Engine",
  description: "Mesin pencari artikel Liputan6 menggunakan TF-IDF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
