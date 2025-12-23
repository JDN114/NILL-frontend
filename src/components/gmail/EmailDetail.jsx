import { useContext } from "react";
import { GmailContext } from "../../context/GmailContext";

export default function EmailDetail() {
  const { activeEmail, closeEmail, loadingEmail } = useContext(GmailContext);

  if (loadingEmail) {
    return <div className="p-4">Lade Email…</div>;
  }

  if (!activeEmail) {
    return <div className="p-4 text-gray-400">Wähle eine Email aus</div>;
  }

  return (
    <div className="p-6 border rounded h-full">
      <button
        onClick={closeEmail}
        className="mb-4 text-sm text-blue-500 hover:underline"
      >
        ← Zurück
      </button>

      <h2 className="text-xl font-bold mb-2">{activeEmail.subject}</h2>
      <div className="text-sm text-gray-600 mb-4">
        Von: {activeEmail.from}
      </div>

      <pre className="whitespace-pre-wrap text-sm">
        {activeEmail.body || "(Kein Textinhalt)"}
      </pre>
    </div>
  );
}
