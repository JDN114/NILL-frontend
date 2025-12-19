import { useEffect, useState } from "react";
import api from "../services/api";
import EmailList from "../components/EmailList";

export default function GmailPage() {
  const [authUrl, setAuthUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthUrl = async () => {
      try {
        const res = await api.get("/gmail/auth-url");
        setAuthUrl(res.data.url);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAuthUrl();
  }, []);

  return (
    <div className="p-6">
      {!authUrl ? (
        <p>Loading Gmail connection...</p>
      ) : (
        <a
          href={authUrl}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Connect Gmail
        </a>
      )}

      <div className="mt-6">
        <EmailList />
      </div>
    </div>
  );
}
