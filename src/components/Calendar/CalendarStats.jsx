// /src/components/calendar/CalendarStats.jsx
export default function CalendarStats({ events = [] }) {
  const upcoming = events.filter(e => new Date(e.date) >= new Date()).length;

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="bg-[#111827] p-3 rounded-lg border border-white/5">
        <p className="text-gray-400 text-sm">Gesamt</p>
        <p className="text-white text-lg font-bold">{events.length}</p>
      </div>

      <div className="bg-[#111827] p-3 rounded-lg border border-white/5">
        <p className="text-gray-400 text-sm">Bevorstehend</p>
        <p className="text-white text-lg font-bold">{upcoming}</p>
      </div>
    </div>
  );
}
