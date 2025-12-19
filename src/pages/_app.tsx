import React from "react";
import { EmailProvider } from "../context/EmailContext";

function MyApp({ Component, pageProps }) {
  return (
    <EmailProvider>
      <Component {...pageProps} />
    </EmailProvider>
  );
}

export default MyApp;
