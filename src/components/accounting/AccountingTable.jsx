export default function AccountingTable({ invoices }) {
  return (
    <div className="mt-6 bg-gray-900 rounded-lg border border-gray-700">
      <table className="w-full text-sm text-white">
        <thead>
          <tr className="border-b border-gray-700">
            <th scope="col" className="p-2 text-left">Datum</th>
            <th scope="col" className="p-2">Partner</th>
            <th scope="col" className="p-2">Kategorie</th>
            <th scope="col" className="p-2">Betrag</th>
            <th scope="col" className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id} className="border-b border-gray-800">
              <td className="p-2">{inv.date}</td>
              <td className="p-2">{inv.partner}</td>
              <td className="p-2">{inv.category}</td>
              <td className="p-2">{inv.amount} €</td>
              <td className="p-2">{inv.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
