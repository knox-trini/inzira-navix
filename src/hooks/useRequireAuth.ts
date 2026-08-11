"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, pathname, router]);

  return user !== null;
}
