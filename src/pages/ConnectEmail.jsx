// src/pages/ConnectEmail.jsx

import { useState } from "react";
import axios from "../utils/axios";
import { motion } from "framer-motion";

export default function ConnectEmail() {
  const [form, setForm] = useState({
    email_address: "",
    provider: "custom",
    imap_host: "",
    imap_port: 993,
    password: ""
  });

  const connect = async () => {
    try {
      const res = await axios.post("/email-accounts/connect", form);
      alert("Postfach erfolgreich verbunden!");
    } catch (err) {
      console.error(err);
      alert("Fehler beim Verbinden.");
    }
  };

  const gmailLogin = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/email-accounts/gmail/auth`;
  };

  const outlookLogin = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/email-accounts/outlook/auth`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-8 max-w-3xl mx-auto text-white"
    >
      <h1 className="text-3xl font-bold mb-6">📨 Postfach verbinden</h1>

      {/* Gmail */}
      <button 
        onClick={gmailLogin}
        className="bg-red-500 px-4 py-2 rounded-lg mb-4 w-full"
      >
        Mit Gmail verbinden
      </button>

      {/* Outlook */}
      <button 
        onClick={outlookLogin}
        className="bg-blue-600 px-4 py-2 rounded-lg mb-4 w-full"
      >
        Mit Outlook verbinden
      </button>

      {/* Separator */}
      <div className="text-gray-400 text-center my-4">oder ein IMAP Postfach hinzufügen</div>

      {/* Custom IMAP */}
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
        <input 
          className="bg-gray-800 p-2 rounded w-full mb-3"
          placeholder="Email-Adresse"
          onChange={(e) => setForm({...form, email_address: e.target.value})}
        />

        <input 
          className="bg-gray-800 p-2 rounded w-full mb-3"
          placeholder="IMAP Host (z.B. imap.ionos.de)"
          onChange={(e) => setForm({...form, imap_host: e.target.value})}
        />

        <input 
          className="bg-gray-800 p-2 rounded w-full mb-3"
          placeholder="IMAP Port (Standard: 993)"
          type="number"
          onChange={(e) => setForm({...form, imap_port: e.target.value})}
        />

        <input 
          className="bg-gray-800 p-2 rounded w-full mb-4"
          placeholder="Passwort / App Passwort"
          type="password"
          onChange={(e) => setForm({...form, password: e.target.value})}
        />

        <button 
          className="w-full bg-green-600 py-2 rounded-lg"
          onClick={connect}
        >
          Verbinden
        </button>
      </div>
    </motion.div>
  );
}
