import Navbar from "./Navbar";

export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]">
      <Navbar />
      <main className="p-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
