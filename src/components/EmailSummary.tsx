interface EmailSummaryProps {
  email: {
    id: string;
    summary: string;
    category: string;
  };
}

export default function EmailSummary({ email }: EmailSummaryProps) {
  return (
    <div className="p-4 border rounded shadow hover:shadow-lg transition">
      <p className="text-gray-500 text-sm">Category: {email.category}</p>
      <p className="text-gray-800 font-medium">{email.summary}</p>
    </div>
  );
}
