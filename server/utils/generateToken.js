const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'replace_with_a_long_random_secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    secret,
    {
      expiresIn,
    }
  );
};

module.exports = generateToken;
