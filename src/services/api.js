import axios from 'axios';

// 개발 환경에서만 상대 경로 강제
const baseURL = '/api';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  maxRedirects: 0, // 리다이렉트 따라가지 않기
});

// 개발 모드에서 baseURL 확인
if (import.meta.env.DEV) {
  console.log('[API Config] baseURL:', api.defaults.baseURL);
  console.log('[API Config] mode:', import.meta.env.MODE);
  console.log('[API Config] origin:', window.location.origin);
}

// 요청 인터셉터: 토큰 자동 삽입
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 개발 모드에서 요청 URL 로깅
  if (import.meta.env.DEV) {
    console.log('[API Request]', config.method?.toUpperCase(), config.url);
    console.log('[API Request] baseURL:', config.baseURL);
    console.log('[API Request] window.location.origin:', window.location.origin);

    // axios가 실제로 생성할 URL 확인
    try {
      const fullUrl = axios.getUri(config);
      console.log('[API Request] axios.getUri():', fullUrl);
    } catch (e) {
      console.error('[API Request] Error getting URI:', e);
    }
  }

  return config;
});

// 응답 인터셉터: 401 시 로그인 화면으로 리다이렉트
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userGuid');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 로그인
export const signIn = async (userId, password) => {
  const { data } = await api.post('/Login/SignIn', {
    Id: userId,
    Password: password,
    ServiceCategory: 'DISPATCH'
  });
  return data;
};

// 화물 리스트 조회
export const getOrders = async (params = {}) => {
  const userGuid = localStorage.getItem('userGuid');

  // params에서 startDate, endDate 추출
  const { startDate, endDate, ...otherParams } = params;

  // 기본 날짜 범위 설정 (오늘)
  const defaultDate = new Date().toISOString().split('T')[0];

  const queryParams = {
    authGuid: userGuid,
    dateSearchMethod: 'LOAD',
    startDate: startDate || defaultDate,
    endDate: endDate || defaultDate,
    ...otherParams
  };

  const { data } = await api.get('/Orders', { params: queryParams });
  return data;
};

// 화물 상세 조회
export const getOrderDetail = async (orderId) => {
  const { data } = await api.get(`/Orders/${orderId}`);
  return data;
};

export default api;
