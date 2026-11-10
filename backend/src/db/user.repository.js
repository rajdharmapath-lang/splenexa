const supabase = require('./supabase');

function unwrap(result) {
  if (result.error) {
    throw result.error;
  }
  return result.data;
}

function toUser(row) {
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    dialCode: row.dial_code,
    phone: row.phone,
    name: row.name,
    state: row.state,
    batchYear: row.batch_year,
    profile_completed: Boolean(row.profile_completed),
  };
}

async function getUserById(userId) {
  const result = await supabase
    .getClient()
    .from('users')
    .select('id, dial_code, phone, name, state, batch_year, profile_completed')
    .eq('id', userId)
    .maybeSingle();
  return toUser(unwrap(result));
}

async function getUserByPhone(dialCode, phone) {
  const result = await supabase
    .getClient()
    .from('users')
    .select('id, dial_code, phone, name, state, batch_year, profile_completed')
    .eq('dial_code', dialCode)
    .eq('phone', phone)
    .maybeSingle();
  return toUser(unwrap(result));
}

async function getOrCreateUserByPhone(dialCode, phone) {
  const normalizedDialCode = String(dialCode).replace(/\D/g, '');
  const normalizedPhone = String(phone).replace(/\D/g, '');
  const existingUser = await getUserByPhone(normalizedDialCode, normalizedPhone);
  if (existingUser) {
    return { user: existingUser, created: false };
  }

  const result = await supabase
    .getClient()
    .from('users')
    .insert({ dial_code: normalizedDialCode, phone: normalizedPhone })
    .select('id, dial_code, phone, name, state, batch_year, profile_completed')
    .single();

  if (!result.error) {
    return { user: toUser(result.data), created: true };
  }
  if (result.error.code !== '23505') {
    throw result.error;
  }

  const concurrentUser = await getUserByPhone(normalizedDialCode, normalizedPhone);
  if (!concurrentUser) {
    throw result.error;
  }
  return { user: concurrentUser, created: false };
}

async function updateProfile(userId, profile) {
  const result = await supabase
    .getClient()
    .from('users')
    .update({
      name: profile.name.trim(),
      state: profile.state,
      batch_year: profile.batchYear,
      profile_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select('id, dial_code, phone, name, state, batch_year, profile_completed')
    .single();
  return toUser(unwrap(result));
}

module.exports = { getUserById, getOrCreateUserByPhone, updateProfile };
