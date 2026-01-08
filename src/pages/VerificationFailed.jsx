import React from "react";
import { Link } from "react-router-dom";

const VerificationFailed = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.failed}>❌ Die Verifizierung ist fehlgeschlagen!</h1>
      <p style={styles.text}>
        Der Link ist möglicherweise abgelaufen oder ungültig.
      </p>
      <p style={styles.text}>
        Fordere eine neue Verifizierungs-E-Mail an <Link to="/resend-verification" style={styles.link}>hier</Link>.
      </p>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#fff0f0",
    textAlign: "center",
    padding: "50px",
    minHeight: "100vh",
  },
  failed: {
    color: "#f44336",
  },
  text: {
    fontSize: "1.2em",
  },
  link: {
    color: "#f44336",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default VerificationFailed;
