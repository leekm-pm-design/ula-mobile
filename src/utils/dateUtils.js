/**
 * 날짜 관련 유틸리티 함수
 */

/**
 * Date 객체를 로컬 날짜 문자열로 변환 (YYYY-MM-DD)
 * @param {Date} date - 변환할 Date 객체
 * @returns {string} YYYY-MM-DD 형식의 문자열
 */
export const getLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 오늘 날짜 문자열 반환 (YYYY-MM-DD)
 * @returns {string} 오늘 날짜
 */
export const getTodayString = () => {
  return getLocalDateString(new Date());
};

/**
 * 내일 날짜 문자열 반환 (YYYY-MM-DD)
 * @returns {string} 내일 날짜
 */
export const getTomorrowString = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getLocalDateString(tomorrow);
};

/**
 * 시간 포맷팅 (HH:mm)
 * @param {string} dateString - ISO 날짜 문자열
 * @returns {string} HH:mm 형식의 시간 또는 '-'
 */
export const formatTime = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('formatTime error:', error);
    return '-';
  }
};

/**
 * 날짜 포맷팅 (MM/DD)
 * @param {string} dateString - ISO 날짜 문자열
 * @returns {string} MM/DD 형식의 날짜 또는 '-'
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  } catch (error) {
    console.error('formatDate error:', error);
    return '-';
  }
};

/**
 * 날짜/시간 포맷팅 (YYYY. MM. DD HH:mm)
 * @param {string} dateString - ISO 날짜 문자열
 * @returns {string} 포맷된 날짜/시간 또는 '-'
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('formatDateTime error:', error);
    return '-';
  }
};

/**
 * 날짜만 포맷팅 (YYYY. MM. DD)
 * @param {string} dateString - ISO 날짜 문자열
 * @returns {string} 포맷된 날짜 또는 '-'
 */
export const formatDateOnly = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    console.error('formatDateOnly error:', error);
    return '-';
  }
};

/**
 * 간단한 날짜/시간 포맷팅 (MM/DD HH:mm)
 * @param {string} dateString - ISO 날짜 문자열
 * @returns {string} 포맷된 날짜/시간 또는 '-'
 */
export const formatDateTimeShort = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  } catch (error) {
    console.error('formatDateTimeShort error:', error);
    return '-';
  }
};
