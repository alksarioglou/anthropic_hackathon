"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Show, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/onboarding");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return null;

  return (
    <Show when="signed-out">
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-4xl font-bold">matura</h1>
          <p className="text-lg text-gray-600">
            AI-Powered Software Planning
          </p>
          <div className="flex gap-4">
            <SignInButton mode="modal">
              <button className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="rounded-lg border border-black px-6 py-3 hover:bg-gray-100">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </div>
      </div>
    </Show>
  );
}
