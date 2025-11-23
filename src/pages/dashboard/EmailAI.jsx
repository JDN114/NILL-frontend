import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { fetchEmailSummary } from "../../services/api";

export default function EmailAI() {
   const { token } = useContext(AuthContext);
   const [input, setInput] = useState("");
   const [result, setResult] = useState("");

   const runAI = async () => {
     const res = await fetchEmailSummary(token, input);
     setResult(res.summary || JSON.stringify(res));
   };

   return (
     <div>
       <h1>Email AI</h1>
       <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          style={{ width: "100%" }}
        />
        <button onClick={runAI}>Analyze</button>

        <pre style={{ marginTop: "20px" }}>{result}</pre>
     </div>
   );
}

