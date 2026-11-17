import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { setAuthToken } from "../api/client";

export function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      if (setAuthToken(token) !== false) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/?error=auth_storage_unavailable", { replace: true });
      }
    } else {
      // No token means OAuth failed or was denied — back to Landing
      // with the error flag that page was always meant to read.
      navigate("/?error=oauth_failed", { replace: true });
    }
  }, [searchParams, navigate]);

  return <div>Signing you in…</div>;
}
