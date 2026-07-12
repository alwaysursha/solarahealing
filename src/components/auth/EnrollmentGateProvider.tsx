"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/cart/CartProvider";
import type { CartAddInput } from "@/lib/cart/types";
import {
  HEADER_LOGIN_TARGET_ID,
  PENDING_ENROLLMENT_STORAGE_KEY,
  getFirstName,
} from "@/lib/auth-utils";

export type LoginFlyParticle = {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  initial?: string;
};

type PendingEnrollment = {
  input: CartAddInput;
  origin: { x: number; y: number } | null;
  reduceMotion: boolean;
};

type EnrollmentGateContextValue = {
  signUpOpen: boolean;
  accountPulse: boolean;
  loginFlyParticle: LoginFlyParticle | null;
  openSignUp: () => void;
  closeSignUp: () => void;
  requestEnrollment: (
    input: CartAddInput,
    originEl: HTMLElement | null,
    reduceMotion: boolean,
  ) => void;
  completeLoginFly: () => void;
  handleSignUpSuccess: (name: string, originEl?: HTMLElement | null) => Promise<void>;
  stashPendingForOAuth: () => void;
};

const EnrollmentGateContext = createContext<EnrollmentGateContextValue | null>(null);

function readPendingEnrollment(): PendingEnrollment | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(PENDING_ENROLLMENT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingEnrollment;
  } catch {
    return null;
  }
}

function writePendingEnrollment(pending: PendingEnrollment | null) {
  if (typeof window === "undefined") return;
  if (!pending) {
    window.sessionStorage.removeItem(PENDING_ENROLLMENT_STORAGE_KEY);
    return;
  }
  window.sessionStorage.setItem(PENDING_ENROLLMENT_STORAGE_KEY, JSON.stringify(pending));
}

function centerOf(el: HTMLElement | null): { x: number; y: number } | null {
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

export function EnrollmentGateProvider({ children }: { children: ReactNode }) {
  const { status, data: session, update } = useSession();
  const { beginAddFromElement } = useCart();
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [accountPulse, setAccountPulse] = useState(false);
  const [loginFlyParticle, setLoginFlyParticle] = useState<LoginFlyParticle | null>(null);
  const pendingRef = useRef<PendingEnrollment | null>(null);
  const welcomeInitialRef = useRef("S");
  const pulseTimerRef = useRef<number | null>(null);
  const oauthHandledRef = useRef(false);

  const triggerAccountPulse = useCallback(() => {
    setAccountPulse(true);
    if (pulseTimerRef.current !== null) {
      window.clearTimeout(pulseTimerRef.current);
    }
    pulseTimerRef.current = window.setTimeout(() => setAccountPulse(false), 900);
  }, []);

  const finishEnrollment = useCallback(
    (pending: PendingEnrollment) => {
      pendingRef.current = null;
      writePendingEnrollment(null);
      // Synthetic origin near login target so cart fly still works after signup.
      const loginTarget = document.getElementById(HEADER_LOGIN_TARGET_ID);
      beginAddFromElement(pending.input, loginTarget, pending.reduceMotion);
    },
    [beginAddFromElement],
  );

  const startLoginFly = useCallback(
    (from: { x: number; y: number } | null, initial: string, reduceMotion: boolean) => {
      const target = document.getElementById(HEADER_LOGIN_TARGET_ID);
      if (reduceMotion || !from || !target) {
        void update().then(() => {
          triggerAccountPulse();
          const pending = pendingRef.current;
          if (pending) {
            window.setTimeout(() => finishEnrollment(pending), 280);
          }
        });
        return;
      }

      const toRect = target.getBoundingClientRect();
      welcomeInitialRef.current = initial;
      setLoginFlyParticle({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        from,
        to: {
          x: toRect.left + toRect.width / 2,
          y: toRect.top + toRect.height / 2,
        },
        initial,
      });
    },
    [finishEnrollment, triggerAccountPulse, update],
  );

  const completeLoginFly = useCallback(() => {
    setLoginFlyParticle(null);
    void update().then(() => {
      triggerAccountPulse();
      const pending = pendingRef.current;
      if (pending) {
        window.setTimeout(() => finishEnrollment(pending), 420);
      }
    });
  }, [finishEnrollment, triggerAccountPulse, update]);

  const requestEnrollment = useCallback(
    (input: CartAddInput, originEl: HTMLElement | null, reduceMotion: boolean) => {
      if (status === "loading") {
        return;
      }

      if (status === "authenticated") {
        beginAddFromElement(input, originEl, reduceMotion);
        return;
      }

      const pending: PendingEnrollment = {
        input,
        origin: centerOf(originEl),
        reduceMotion,
      };
      pendingRef.current = pending;
      writePendingEnrollment(pending);
      setSignUpOpen(true);
    },
    [beginAddFromElement, status],
  );

  const handleSignUpSuccess = useCallback(
    async (name: string, originEl?: HTMLElement | null) => {
      setSignUpOpen(false);
      const initial = getFirstName(name).charAt(0).toUpperCase() || "S";
      const from =
        centerOf(originEl ?? null) ??
        pendingRef.current?.origin ?? {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        };
      startLoginFly(from, initial, Boolean(pendingRef.current?.reduceMotion));
    },
    [startLoginFly],
  );

  const stashPendingForOAuth = useCallback(() => {
    if (pendingRef.current) {
      writePendingEnrollment(pendingRef.current);
    }
  }, []);

  // Resume enrollment after Google OAuth return.
  useEffect(() => {
    if (status !== "authenticated" || oauthHandledRef.current) return;
    const stored = readPendingEnrollment();
    if (!stored) return;
    oauthHandledRef.current = true;
    pendingRef.current = stored;
    writePendingEnrollment(null);
    const initial = getFirstName(session?.user?.name).charAt(0).toUpperCase() || "S";
    startLoginFly(
      { x: window.innerWidth / 2, y: window.innerHeight * 0.4 },
      initial,
      stored.reduceMotion,
    );
  }, [session?.user?.name, startLoginFly, status]);

  useEffect(() => {
    return () => {
      if (pulseTimerRef.current !== null) {
        window.clearTimeout(pulseTimerRef.current);
      }
    };
  }, []);

  const value = useMemo<EnrollmentGateContextValue>(
    () => ({
      signUpOpen,
      accountPulse,
      loginFlyParticle,
      openSignUp: () => setSignUpOpen(true),
      closeSignUp: () => setSignUpOpen(false),
      requestEnrollment,
      completeLoginFly,
      handleSignUpSuccess,
      stashPendingForOAuth,
    }),
    [
      signUpOpen,
      accountPulse,
      loginFlyParticle,
      requestEnrollment,
      completeLoginFly,
      handleSignUpSuccess,
      stashPendingForOAuth,
    ],
  );

  return (
    <EnrollmentGateContext.Provider value={value}>{children}</EnrollmentGateContext.Provider>
  );
}

export function useEnrollmentGate() {
  const context = useContext(EnrollmentGateContext);
  if (!context) {
    throw new Error("useEnrollmentGate must be used within EnrollmentGateProvider");
  }
  return context;
}
