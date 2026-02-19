
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Always redirect root to login; auth guard handles further routing
    router.replace("/login");
  }, [router]);

  return null;
}
