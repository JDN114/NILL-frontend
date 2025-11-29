import React, { useState } from "react";
import EmailList from "../components/EmailList";
import EmailForm from "../components/EmailForm";

export default function Emails() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEmailCreated = () => {
    setRefreshKey((prev) => prev + 1); // löst Neuladen der Liste aus
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Postfach</h1>
      <EmailForm onEmailCreated={handleEmailCreated} />
      <EmailList key={refreshKey} />
    </div>
  );
}
