import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  getExistingSession,
  requestPhoneOtp,
  saveUserProfile,
  signOut as signOutUser,
  verifyPhoneOtp,
} from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [sessionRestored, setSessionRestored] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [authError, setAuthError] = useState(null);

  const minimumSplashDuration = 900;

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      const startedAt = Date.now();
      try {
        const existingSession = await getExistingSession();
        if (!isMounted) {
          return;
        }
        setSession(existingSession);
        setSessionRestored(Boolean(existingSession?.user));

        if (existingSession?.user) {
          setProfile(existingSession.user);
        }
      } catch (error) {
        if (isMounted) {
          setAuthError(error);
        }
      } finally {
        const remainingSplashTime = minimumSplashDuration - (Date.now() - startedAt);
        if (remainingSplashTime > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingSplashTime));
        }
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    }

    restoreSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const verifyOtp = useCallback(async (phoneNumber, token, requestId) => {
    const authenticated = await verifyPhoneOtp(phoneNumber, token, requestId);
    setSession(authenticated.session);
    setSessionRestored(false);
    setAuthError(null);
    setProfile(authenticated.user);
  }, []);

  const completeProfile = useCallback(async (profileDetails) => {
    if (!session?.user) {
      throw new Error('Cannot save profile before an authenticated session exists.');
    }

    const savedProfile = await saveUserProfile(profileDetails);
    setProfile(savedProfile);
    setAuthError(null);
  }, [session]);

  const retrySessionRestore = useCallback(async () => {
    try {
      const existingSession = await getExistingSession();
      setSession(existingSession);
      setSessionRestored(Boolean(existingSession?.user));
      if (!existingSession?.user) {
        setProfile(null);
        setAuthError(null);
        return;
      }
      setProfile(existingSession.user);
    } catch (error) {
      setAuthError(error);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    await signOutUser();
    setSession(null);
    setSessionRestored(false);
    setProfile(null);
    setAuthError(null);
  }, []);

  const value = useMemo(() => ({
    session,
    sessionRestored,
    user: session?.user || null,
    profile,
    isInitializing,
    authError,
    requestOtp: requestPhoneOtp,
    verifyOtp,
    completeProfile,
    retrySessionRestore,
    signOut,
  }), [
    session,
    sessionRestored,
    profile,
    isInitializing,
    authError,
    verifyOtp,
    completeProfile,
    retrySessionRestore,
    signOut,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
