import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#f97316", "#a855f7"];

export default function ExpensePieChart({ data }) {
  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
      <h2 className="text-white font-semibold mb-2">
        Ausgaben nach Kategorie
      </h2>

      <PieChart width={300} height={220}>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={80}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}
