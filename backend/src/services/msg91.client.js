const BASE_URL = 'https://api.msg91.com/api/v5/widget';
const REQUEST_TIMEOUT_MS = 10000;

function getConfig() {
  const authKey = (process.env.MSG91_TOKEN_AUTH || process.env.MSG91_AUTH_KEY)?.trim();
  const widgetId = process.env.MSG91_WIDGET_ID?.trim();
  if (!authKey || !widgetId) {
    const error = new Error('MSG91 OTP is not configured.');
    error.code = 'MSG91_NOT_CONFIGURED';
    throw error;
  }
  return { authKey, widgetId };
}

function isSuccessful(data) {
  return [data, data?.data].some((result) =>
    String(result?.type || result?.status || '').toLowerCase() === 'success' ||
    result?.success === true
  );
}

function getRequestId(data) {
  for (const result of [data, data?.data]) {
    const requestId = result?.reqId || result?.requestId || result?.request_id;
    if (typeof requestId === 'string' && requestId.trim()) {
      return requestId.trim();
    }
  }
  for (const result of [data?.data, data]) {
    if (
      isSuccessful(data) &&
      typeof result?.message === 'string' &&
      /^[A-Za-z0-9_-]{8,}$/.test(result.message.trim())
    ) {
      return result.message.trim();
    }
  }
  return null;
}

async function requestJson(endpoint, payload) {
  const { authKey } = getConfig();
  let response;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authkey: authKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (cause) {
    const error = new Error('Could not connect to MSG91.');
    error.code = 'MSG91_NETWORK_ERROR';
    error.cause = cause;
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  let data;
  try {
    data = await response.json();
  } catch (cause) {
    const error = new Error('MSG91 returned an invalid response.');
    error.code = 'MSG91_INVALID_RESPONSE';
    error.cause = cause;
    throw error;
  }

  if (!response.ok) {
    const error = new Error('MSG91 rejected the OTP request.');
    error.code = 'MSG91_PROVIDER_ERROR';
    error.status = response.status;
    throw error;
  }
  return data;
}

async function sendOtp(identifier) {
  const { widgetId } = getConfig();
  const data = await requestJson('/sendOtp', { widgetId, identifier });
  const requestId = getRequestId(data);
  if (!isSuccessful(data) || !requestId) {
    const error = new Error('MSG91 did not accept the OTP request.');
    error.code = 'MSG91_PROVIDER_REJECTED';
    throw error;
  }
  return requestId;
}

async function retryOtp(requestId, retryChannel) {
  const { widgetId } = getConfig();
  const payload = { widgetId, reqId: requestId };
  if (retryChannel) {
    payload.retryChannel = retryChannel;
  }
  const data = await requestJson('/retryOtp', payload);
  if (!isSuccessful(data)) {
    const error = new Error('MSG91 could not resend the OTP.');
    error.code = 'MSG91_PROVIDER_REJECTED';
    throw error;
  }
}

async function verifyOtp(requestId, otp) {
  const { widgetId } = getConfig();
  const data = await requestJson('/verifyOtp', { widgetId, reqId: requestId, otp });
  return isSuccessful(data);
}

module.exports = { sendOtp, retryOtp, verifyOtp };
