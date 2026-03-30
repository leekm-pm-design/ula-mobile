/**
 * 포맷팅 관련 유틸리티 함수
 */

/**
 * 숫자를 천 단위 구분 기호가 있는 문자열로 변환
 * @param {number|string} value - 변환할 숫자
 * @returns {string} 포맷된 문자열 또는 '-'
 */
export const formatNumber = (value) => {
  if (value === undefined || value === null || value === '') return '-';
  try {
    return Number(value).toLocaleString();
  } catch (error) {
    console.error('formatNumber error:', error);
    return '-';
  }
};

/**
 * 숫자를 원화 형식으로 변환 (예: 1,234,567원)
 * @param {number|string} value - 변환할 숫자
 * @returns {string} 원화 포맷 문자열 또는 null
 */
export const formatCurrency = (value) => {
  if (value === undefined || value === null || value === '') return null;
  try {
    return `${Number(value).toLocaleString()}원`;
  } catch (error) {
    console.error('formatCurrency error:', error);
    return null;
  }
};

/**
 * 거리를 km 단위로 포맷팅
 * @param {number|string} distance - 거리 값
 * @returns {string} 거리 문자열 또는 null
 */
export const formatDistance = (distance) => {
  if (distance === undefined || distance === null || distance === '') return null;
  try {
    return `${distance}km`;
  } catch (error) {
    console.error('formatDistance error:', error);
    return null;
  }
};

/**
 * 배열을 쉼표로 구분된 문자열로 변환
 * @param {Array} array - 변환할 배열
 * @returns {string} 쉼표로 구분된 문자열 또는 '-'
 */
export const formatArray = (array) => {
  if (!array || !Array.isArray(array) || array.length === 0) return '-';
  return array.join(', ');
};

/**
 * 전화번호에 하이픈(-) 추가
 * @param {string} phoneNumber - 전화번호
 * @returns {string} 포맷된 전화번호 또는 null
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return null;

  // 숫자만 추출
  const numbers = phoneNumber.replace(/[^0-9]/g, '');

  // 이미 하이픈이 있거나 숫자가 아닌 경우 원본 반환
  if (numbers.length < 9) return phoneNumber;

  // 010-1234-5678 (11자리)
  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }

  // 02-123-4567 또는 02-1234-5678 (서울 지역번호)
  if (numbers.startsWith('02')) {
    if (numbers.length === 9) {
      return numbers.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
  }

  // 031-123-4567 또는 031-1234-5678 (10자리)
  if (numbers.length === 10) {
    return numbers.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }

  // 기타 형식
  return phoneNumber;
};
