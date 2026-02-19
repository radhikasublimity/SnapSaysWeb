"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Checks sessionStorage for isLoggedIn flag.
 * - If NOT logged in → redirects to /login.
 * - Returns { isAuthenticated } so the calling component can
 *   avoid rendering protected content before the check completes.
 */
export function useAuthGuard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  return { isAuthenticated };
}
