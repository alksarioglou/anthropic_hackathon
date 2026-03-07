"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function RootPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    router.replace(isSignedIn ? "/home" : "/landing");
  }, [isLoaded, isSignedIn, router]);

  return null;
}
