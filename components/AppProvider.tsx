"use client";

import { AppContextProvider } from "../context/AppContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const isClerkActive =
        typeof publishableKey === "string" &&
        publishableKey.startsWith("pk_test_") &&
        !publishableKey.includes("empty") &&
        !publishableKey.includes("placeholder");

    return (
        <AppContextProvider isClerkActive={isClerkActive}>
            {children}
        </AppContextProvider>
    );
}