import { useState, useCallback } from 'react';
import { signIn } from '../services/api';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isLoggedIn = !!localStorage.getItem('token');

  const login = useCallback(async (userId, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await signIn(userId, password);
      const data = response.result || response; // result 객체 안에 데이터가 있음

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userGuid', data.userGuid);
        localStorage.setItem('userName', data.userName);
        return true;
      }
      setError('로그인 정보를 확인해주세요.');
      return false;
    } catch (err) {
      setError(err.response?.data?.message || '로그인에 실패했습니다.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userGuid');
    localStorage.removeItem('userName');
  }, []);

  const user = {
    guid: localStorage.getItem('userGuid'),
    name: localStorage.getItem('userName')
  };

  return { login, logout, loading, error, isLoggedIn, user };
}
