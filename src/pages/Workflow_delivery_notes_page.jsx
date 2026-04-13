import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import api from "../lib/api";

export default function DeliveryNotesPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, [year]);

  async function fetchFiles() {
    setLoading(true);
    try {
      const res = await api.get("/workflow/delivery-notes", {
        params: { year, search }
      });
      setFiles(res.data?.items || []);
    } catch (e) {
      console.error("fetch delivery notes failed", e);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      await api.post("/workflow/delivery-notes/upload", formData);
      await fetchFiles();
    } catch (e) {
      console.error("upload failed", e);
    } finally {
      setUploading(false);
    }
  }

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6 text-white">Lieferscheine</h1>

      {/* Upload */}
      <div className="mb-6 p-4 bg-[#0a1120] border border-white/10 rounded-lg">
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleUpload}
          className="text-white"
        />
        {uploading && <p className="text-gray-400 mt-2">Upload läuft...</p>}
      </div>

      {/* Filter */}
      <div className="flex gap-3 mb-4">
        <input
          className="p-2 rounded bg-[#0a1120] text-white border border-white/10"
          placeholder="Suche Lieferant / Nummer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchFiles()}
        />

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="p-2 rounded bg-[#0a1120] text-white border border-white/10"
        >
          {[2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <button
          onClick={fetchFiles}
          className="px-4 py-2 bg-[var(--accent)] rounded text-white"
        >
          Suchen
        </button>
      </div>

      {/* List */}
      {loading && <p className="text-gray-400">Lade Lieferscheine...</p>}

      {!loading && files.length === 0 && (
        <p className="text-gray-400">Keine Dokumente gefunden</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {files.map((f) => (
          <div
            key={f.id}
            className="bg-[#0a1120] p-4 rounded-lg border border-white/5"
          >
            <p className="font-semibold text-white">{f.supplier || "Unbekannt"}</p>
            <p className="text-gray-400 text-sm">{f.document_number}</p>
            <p className="text-gray-500 text-xs">Jahr: {f.year}</p>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
