import { useLocation, useNavigate } from "react-router";
import { useUserStore } from "./State";
import { useEffect } from "react";
import { supabase } from "./supabaseClient";

export function useProtectedRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const checkAuthStatus = useUserStore((s) => s.auth.checkAuthStatus);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const checkAuth = async () => {
      const ok = await checkAuthStatus();
      if (!ok) {
        navigate(`/auth?next=${location.pathname}`, { replace: true });
      }
    };
    checkAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          navigate(`/auth?next=${location.pathname}`, { replace: true });
        }
      }
    );
    unsubscribe = listener?.subscription.unsubscribe;

    return () => {
      unsubscribe?.();
    };
  }, []);
}
