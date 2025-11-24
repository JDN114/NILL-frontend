const API_URL = "https://5.75.175.150"; // ändern!

export const registerUser = async (email, password) => {
   const res = await fetch(`${API_URL}/auth/register`, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ email, password }),
   });
   return res.json(); };

export const loginUser = async (email, password) => {
   const res = await fetch(`${API_URL}/auth/login`, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ email, password }),
   });
   return res.json(); };

