import React from "react";
import { ErrorBoundary } from "../components/ErrorBoundary";
import EmailList from "../components/EmailList";

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <ErrorBoundary>
        <EmailList />
      </ErrorBoundary>
    </div>
  );
}
