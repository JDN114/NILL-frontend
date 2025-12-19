import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Dashboard Error:", error, errorInfo);
    // Optional: Reporting an external service (Sentry, LogRocket)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 text-red-700 rounded shadow">
          <h2>Ein Fehler ist aufgetreten 😢</h2>
          <p>Bitte versuche es später erneut.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
