import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const SESSION_KEY = 'splenexa_session_token';
const REQUEST_TIMEOUT_MS = 15000;

function getApiUrl() {
  const apiUrl = Constants.expoConfig?.extra?.apiUrl?.replace(/\/+$/, '');
  if (!apiUrl) {
    throw new Error('Backend URL is not configured. Set EXPO_PUBLIC_API_URL in frontend/.env.');
  }
  return apiUrl;
}

function getSupabaseFunctionConfig() {
  const { supabaseUrl, supabaseAnonKey } = Constants.expoConfig?.extra || {};
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase Edge Function is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in frontend/.env.',
    );
  }
  return {
    baseUrl: supabaseUrl.replace(/\/+$/, ''),
    apiKey: supabaseAnonKey,
  };
}

async function request(path, { method = 'GET', body, token, baseUrl, apiKey } = {}) {
  let response;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    response = await fetch(`${baseUrl || getApiUrl()}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(apiKey ? { apikey: apiKey } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: controller.signal,
    });
  } catch (error) {
    throw new Error(`Unable to reach the backend: ${error.message}`);
  } finally {
    clearTimeout(timeout);
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`Backend returned an invalid response (HTTP ${response.status}).`);
  }

  if (!response.ok) {
    if (response.status === 401) {
      await SecureStore.deleteItemAsync(SESSION_KEY);
    }
    const error = new Error(payload.message || `Backend request failed (HTTP ${response.status}).`);
    error.status = response.status;
    throw error;
  }

  return payload;
}

function splitPhoneNumber(phoneNumber) {
  const match = /^\+(\d{1,3})(\d{6,14})$/.exec(phoneNumber);
  if (!match) {
    throw new Error('Enter a valid phone number including its country code.');
  }
  return { dialCode: match[1], phone: match[2] };
}

export async function getExistingSession() {
  const token = await SecureStore.getItemAsync(SESSION_KEY);
  if (!token) {
    return null;
  }

  try {
    const user = await requestUserProfile(token);
    return { access_token: token, user };
  } catch (error) {
    if (error.status === 401) {
      return null;
    }
    throw error;
  }
}

export async function requestPhoneOtp(phoneNumber) {
  const phone = splitPhoneNumber(phoneNumber);
  const { requestId } = await request('/api/auth/send-otp', {
    method: 'POST',
    body: phone,
  });
  if (typeof requestId !== 'string' || !requestId.trim()) {
    throw new Error('The backend did not return an OTP request. Please try again.');
  }
  return requestId;
}

export async function retryPhoneOtp(phoneNumber, requestId) {
  const phone = splitPhoneNumber(phoneNumber);
  const { requestId: nextRequestId } = await request('/api/auth/retry-otp', {
    method: 'POST',
    body: { ...phone, requestId },
  });
  return nextRequestId || requestId;
}

export async function verifyPhoneOtp(phoneNumber, code, requestId) {
  const phone = splitPhoneNumber(phoneNumber);
  const { token, user } = await request('/api/auth/verify-otp', {
    method: 'POST',
    body: { ...phone, code, requestId },
  });
  await SecureStore.setItemAsync(SESSION_KEY, token);
  return { session: { access_token: token, user }, user };
}

export async function getUserProfile() {
  const token = await SecureStore.getItemAsync(SESSION_KEY);
  if (!token) {
    throw new Error('No signed-in session is available.');
  }
  const user = await requestUserProfile(token);
  return user;
}

export async function saveUserProfile(profile) {
  const token = await SecureStore.getItemAsync(SESSION_KEY);
  if (!token) {
    throw new Error('No signed-in session is available.');
  }
  const { baseUrl, apiKey } = getSupabaseFunctionConfig();
  const { user } = await request('/functions/v1/super-worker', {
    method: 'PATCH',
    body: profile,
    token,
    baseUrl,
    apiKey,
  });
  return user;
}

async function requestUserProfile(token) {
  const { baseUrl, apiKey } = getSupabaseFunctionConfig();
  const { user } = await request('/functions/v1/super-worker', {
    token,
    baseUrl,
    apiKey,
  });
  return user;
}

export async function signOut() {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
