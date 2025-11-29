export default function Emails({ selectedCategory }) {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmails() {
      try {
        const res = await axios.get("/api/emails");
        const filtered = res.data.filter(
          (email) =>
            selectedCategory === "All" || email.category === selectedCategory
        );

        const emailsWithAI = await Promise.all(
          filtered.map(async (email) => {
            try {
              const [summary, category, priority, spam, actions, language, dates] =
                await Promise.all([
                  axios.post(`/api/email/${email.id}/summarize`),
                  axios.post(`/api/email/${email.id}/categorize`),
                  axios.post(`/api/email/${email.id}/priority`),
                  axios.post(`/api/email/${email.id}/spam`),
                  axios.post(`/api/email/${email.id}/actions`),
                  axios.post(`/api/email/${email.id}/language`),
                  axios.post(`/api/email/${email.id}/dates`),
                ]);

              return {
                ...email,
                summary: summary.data.result,
                category: category.data.result,
                priority: priority.data.result,
                spam: spam.data.result,
                actions: actions.data.result,
                language: language.data.result,
                dates: dates.data.result,
              };
            } catch (err) {
              console.error("KI-Fehler bei Email ID:", email.id, err);
              return email;
            }
          })
        );

        setEmails(emailsWithAI);
      } catch (err) {
        console.error("Fehler beim Laden der Emails:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEmails();
  }, [selectedCategory]);

  return (
    <div>
      {loading ? (
        <div>Lade Emails...</div>
      ) : emails.length === 0 ? (
        <div>Keine Emails gefunden.</div>
      ) : (
        <div className="space-y-4">
          {emails.map((email) => (
            <div
              key={email.id}
              className={`bg-black/20 backdrop-blur-md p-4 rounded-lg border ${
                email.spam === "Spam" ? "border-red-500" : "border-white/10"
              }`}
            >
              <h3 className="text-lg font-bold">{email.subject}</h3>
              <p>{email.summary || email.body}</p>
              <div className="mt-2 flex flex-wrap justify-between text-sm text-gray-400 gap-2">
                <span>Kategorie: {email.category || "Allgemein"}</span>
                <span>Priorität: {email.priority || "Normal"}</span>
                <span>Sprache: {email.language || "Unbekannt"}</span>
                <span>Spam: {email.spam || "Nein"}</span>
                {email.dates && <span>Termine: {email.dates.join(", ")}</span>}
              </div>
              {email.actions && email.actions.length > 0 && (
                <div className="mt-2 text-gray-200">
                  <strong>Action Items:</strong>
                  <ul className="list-disc list-inside">
                    {email.actions.map((act, idx) => (
                      <li key={idx}>{act}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
