import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { setAuthToken } from "../api/client";

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      setAuthToken(token);
      navigate("/dashboard", { replace: true });
    } else {
      // Token missing or invalid
      navigate("/", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      fontFamily: 'sans-serif' 
    }}>
      <p>Completing authentication, please wait...</p>
    </div>
  );
}
