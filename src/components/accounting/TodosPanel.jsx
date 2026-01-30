export default function TodosPanel({ todos }) {
  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
      <h2 className="text-white font-semibold mb-2">Hinweise</h2>

      {todos.length === 0 && (
        <div className="text-gray-400">Alles erledigt 🎉</div>
      )}

      {todos.map((t) => (
        <div key={t.id} className="text-sm text-yellow-400 mb-1">
          ⚠️ {t.text}
        </div>
      ))}
    </div>
  );
}
