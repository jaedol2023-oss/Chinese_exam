const express = require('express');
const path = require('path');
const https = require('https');
const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/claude', (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.' });

  const postData = JSON.stringify(req.body);
  const options = {
    hostname: 'api.anthropic.com', path: '/v1/messages', method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  const proxyReq = https.request(options, (proxyRes) => {
    let data = '';
    proxyRes.on('data', (chunk) => { data += chunk; });
    proxyRes.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        if (proxyRes.statusCode !== 200) {
          const errMsg = parsed.error?.message || JSON.stringify(parsed);
          console.error('  [API 에러]', proxyRes.statusCode, errMsg);
          return res.status(proxyRes.statusCode).json({ error: errMsg });
        }
        res.json(parsed);
      } catch (e) {
        res.status(500).json({ error: '응답 파싱 실패' });
      }
    });
  });
  proxyReq.on('error', (err) => res.status(500).json({ error: err.message }));
  proxyReq.write(postData);
  proxyReq.end();
});

app.listen(PORT, () => {
  console.log('');
  console.log('  ╔═══════════════════════════════════════╗');
  console.log('  ║  중국어 시험 생성기 서버 실행 중!     ║');
  console.log(`  ║  👉 http://localhost:${PORT}            ║`);
  console.log('  ║  종료: Ctrl + C                       ║');
  console.log('  ╚═══════════════════════════════════════╝');
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('\n  ⚠️  API 키 미설정! 아래처럼 실행하세요:');
    console.log('  export ANTHROPIC_API_KEY="sk-ant-..." && npm start\n');
  }
});
