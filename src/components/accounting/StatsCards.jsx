const fmtEur = (v) =>
  Number(v || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

export default function StatsCards({ stats }) {
  const items = [
    { label: "Einnahmen", value: stats.income },
    { label: "Ausgaben", value: stats.expenses },
    { label: "Gewinn", value: stats.profit },
    { label: "Offen", value: stats.openInvoices },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((i) => (
        <div
          key={i.label}
          className="bg-gray-900 p-4 rounded-lg border border-gray-700"
        >
          <div className="text-sm text-gray-400">{i.label}</div>
          <div className="text-xl font-bold text-white">{fmtEur(i.value)}</div>
        </div>
      ))}
    </div>
  );
}
