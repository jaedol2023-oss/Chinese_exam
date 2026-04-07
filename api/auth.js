module.exports = (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const { password } = JSON.parse(body);
      const correct = process.env.ADMIN_PASSWORD;
      if (!correct) return res.status(500).json({ error: 'ADMIN_PASSWORD not configured' });
      if (password === correct) {
        res.status(200).json({ ok: true });
      } else {
        res.status(401).json({ error: '비밀번호가 틀렸습니다.' });
      }
    } catch (e) {
      res.status(400).json({ error: 'Invalid request' });
    }
  });
};
