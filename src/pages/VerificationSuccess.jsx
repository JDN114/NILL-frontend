import React from "react";
import { Link } from "react-router-dom"; // falls du react-router benutzt

const VerificationSuccess = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.success}>✅ Deine E-Mail wurde erfolgreich verifiziert!</h1>
      <p style={styles.text}>
        Du kannst dich jetzt <Link to="/login" style={styles.link}>einloggen</Link> und das volle Produkt nutzen.
      </p>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f0f8ff",
    textAlign: "center",
    padding: "50px",
    minHeight: "100vh",
  },
  success: {
    color: "#4CAF50",
  },
  text: {
    fontSize: "1.2em",
  },
  link: {
    color: "#4CAF50",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default VerificationSuccess;
