"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LoginWall } from "@/components/auth/LoginWall";
import { GoogleIdentityProvider, GoogleOneTap } from "@/components/auth/GoogleIdentityProvider";
import { apiFetch } from "@/lib/api";

export type AuthUser = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

type MeResponse = {
  authenticated: boolean;
  user: AuthUser | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
  requireAuth: () => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginWallOpen, setLoginWallOpen] = useState(false);
  const [returnTo, setReturnTo] = useState("/");

  const refresh = useCallback(async () => {
    try {
      const me = await apiFetch<MeResponse>("/auth/me", { skipVisitor: true });
      setUser(me.authenticated ? me.user : null);
    } catch {
      // A public page must remain usable if the API is temporarily unavailable.
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void apiFetch<MeResponse>("/auth/me", { skipVisitor: true })
      .then((me) => {
        if (active) setUser(me.authenticated ? me.user : null);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const signOut = useCallback(async () => {
    await apiFetch("/auth/logout", { method: "POST", skipVisitor: true });
    setUser(null);
    setLoginWallOpen(false);
  }, []);

  const requireAuth = useCallback(() => {
    if (user) return true;
    const path = typeof window === "undefined"
      ? "/"
      : `${window.location.pathname}${window.location.search}`;
    setReturnTo(path.startsWith("/") && !path.startsWith("//") ? path : "/");
    setLoginWallOpen(true);
    return false;
  }, [user]);

  const onGoogleSignedIn = useCallback(async () => {
    await refresh();
    setLoginWallOpen(false);
  }, [refresh]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isInitialized: !isLoading,
      isAuthenticated: !!user,
      refresh,
      signOut,
      requireAuth,
    }),
    [user, isLoading, refresh, signOut, requireAuth],
  );


  return (
    <AuthContext.Provider value={value}>
      <GoogleIdentityProvider onSignedIn={onGoogleSignedIn}>
        <GoogleOneTap enabled={!isLoading && !user && !loginWallOpen} />
        {children}
        <LoginWall
          open={loginWallOpen && !user}
          returnTo={returnTo}
          onClose={() => setLoginWallOpen(false)}
        />
      </GoogleIdentityProvider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
