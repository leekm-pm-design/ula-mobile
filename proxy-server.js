import express from 'express';
import axios from 'axios';
import https from 'https';
import http from 'http';
import cors from 'cors';
import zlib from 'zlib';

const app = express();
const PORT = 3001;

// HTTPS 인증서 검증 비활성화 (개발 환경 전용)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  secureProtocol: 'TLSv1_2_method', // TLS 1.2 강제
});

const httpAgent = new http.Agent({
  keepAlive: true,
});

// CORS 허용
app.use(cors());
app.use(express.json());

// 모든 /api 요청을 실제 API 서버로 프록시
app.use('/api', async (req, res) => {
  // 실제 API 도메인 + 쿼리 파라미터
  const queryString = new URLSearchParams(req.query).toString();
  const apiUrl = `https://api.nalo.kr/api${req.path}${queryString ? `?${queryString}` : ''}`;

  console.log(`[Proxy] ${req.method} ${req.path}${queryString ? `?${queryString}` : ''} -> ${apiUrl}`);

  try {
    // 클라이언트에서 보낸 헤더 복사 (Authorization 포함)
    const headers = {
      'Content-Type': 'application/json',
    };

    // Authorization 헤더가 있으면 전달
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }

    console.log('[Proxy] Headers:', headers);

    const response = await axios({
      method: req.method,
      url: apiUrl,
      data: req.body,
      headers: headers,
      maxRedirects: 5,
      validateStatus: () => true, // 모든 HTTP 상태 코드 허용
    });

    console.log(`[Proxy] Response: ${response.status} ${response.statusText}`);

    // Orders API 응답 압축 해제 처리
    if (req.path.includes('Orders') && req.method === 'GET' && response.data.result && typeof response.data.result === 'string') {
      try {
        const buffer = Buffer.from(response.data.result, 'base64');
        const decompressed = zlib.inflateRawSync(buffer);
        const decodedData = JSON.parse(decompressed.toString('utf8'));

        console.log('[Proxy] Decompressed Orders data, count:', Array.isArray(decodedData) ? decodedData.length : 0);
        if (Array.isArray(decodedData) && decodedData.length > 0) {
          console.log('[Proxy] Sample order keys:', Object.keys(decodedData[0]));
        }

        // 압축 해제된 데이터로 교체
        response.data = {
          ...response.data,
          result: decodedData
        };
      } catch (e) {
        console.error('[Proxy] Failed to decompress Orders data:', e.message);
      }
    }

    res.status(response.status);

    // 응답 헤더 복사
    Object.keys(response.headers).forEach(key => {
      if (key.toLowerCase() !== 'content-length' && key.toLowerCase() !== 'transfer-encoding') {
        res.setHeader(key, response.headers[key]);
      }
    });

    res.send(response.data);
  } catch (error) {
    console.error('[Proxy] Error:', error.message);
    console.error('[Proxy] Error code:', error.code);

    res.status(500).json({
      error: 'Proxy error',
      message: error.message,
      code: error.code
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🔄 Proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Forwarding requests to https://api.nalo.kr`);
  console.log(`✅ Using domain with valid SSL certificate\n`);
});
