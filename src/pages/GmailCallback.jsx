import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GmailCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code) {
            window.location.href = `https://api.nillai.de/gmail/callback?code=${code}`;
        } else {
            navigate("/dashboard?error=no_code");
        }
    }, []);

    return <div>Verarbeite Google Login…</div>;
}
