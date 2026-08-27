const jwt = require('jsonwebtoken');

/**
 * Token JWT disimpan di cookie httpOnly + Secure + SameSite=Strict, BUKAN
 * di localStorage. Ini mencegah pencurian token lewat XSS (httpOnly) dan
 * mencegah token ikut terkirim pada request lintas-situs (SameSite),
 * yang merupakan bagian penting dari pertahanan anti-spoofing sesi admin.
 */
function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
  });
}

function setAuthCookie(res, token) {
  res.cookie('kpu_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 2 * 60 * 60 * 1000,
    path: '/',
  });
}

function clearAuthCookie(res) {
  res.clearCookie('kpu_session', { path: '/' });
}

function requireAuth(req, res, next) {
  const token = req.cookies?.kpu_session;
  if (!token) {
    return res.status(401).json({ error: 'Tidak terautentikasi.' });
  }
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Sesi tidak valid atau kedaluwarsa.' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({ error: 'Anda tidak memiliki akses untuk aksi ini.' });
    }
    return next();
  };
}

module.exports = { signToken, setAuthCookie, clearAuthCookie, requireAuth, requireRole };
