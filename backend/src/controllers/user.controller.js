const userRepository = require('../db/user.repository');
const indianStates = require('../data/indian-states');

async function getMe(req, res, next) {
  try {
    const user = await userRepository.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Account not found.' });
    }
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
}

async function updateProfile(req, res, next) {
  const { name, state, batchYear } = req.body || {};
  if (
    typeof name !== 'string' ||
    name.trim().length < 1 ||
    name.trim().length > 100 ||
    typeof state !== 'string' ||
    !indianStates.includes(state.trim()) ||
    !Number.isInteger(Number(batchYear)) ||
    Number(batchYear) < 2016 ||
    Number(batchYear) > new Date().getFullYear()
  ) {
    return res.status(400).json({ message: 'Enter a valid name, state, and batch year.' });
  }

  try {
    const user = await userRepository.updateProfile(req.user.id, {
      name,
      state: state.trim(),
      batchYear: Number(batchYear),
    });
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getMe, updateProfile };
