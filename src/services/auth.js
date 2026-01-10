// frontend/src/services/auth.js

export async function fetchMe() {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/me`,
    {
      method: "GET",
      credentials: "include", // 🔑 Cookie mitsenden
    }
  );

  if (!res.ok) {
    throw new Error("Not authenticated");
  }

  return res.json();
}
