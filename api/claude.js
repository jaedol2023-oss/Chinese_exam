const https = require('https');

module.exports = (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    const postData = body;
    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const proxyReq = https.request(options, (proxyRes) => {
      let data = '';
      proxyRes.on('data', chunk => { data += chunk; });
      proxyRes.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (proxyRes.statusCode !== 200) {
            const errMsg = parsed.error?.message || JSON.stringify(parsed);
            return res.status(proxyRes.statusCode).json({ error: errMsg });
          }
          res.status(200).json(parsed);
        } catch (e) {
          res.status(500).json({ error: 'Parse error' });
        }
      });
    });
    proxyReq.on('error', err => res.status(500).json({ error: err.message }));
    proxyReq.write(postData);
    proxyReq.end();
  });
};
