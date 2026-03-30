/**
 * 주문 상태 관련 상수
 */

// 주문 상태 필터 목록
export const STATUS_FILTERS = ['전체', '등록', '접수', '배차', '운행', '완료', '취소'];

// 주문 진행 단계 (취소 제외)
export const ORDER_STEPS = ['등록', '접수', '배차', '운행', '완료'];

// 상태별 색상 매핑
export const STATUS_COLORS = {
  '등록': 'bg-gray-100 text-gray-700',
  '접수': 'bg-blue-100 text-blue-700',
  '배차': 'bg-purple-100 text-purple-700',
  '운행': 'bg-orange-100 text-orange-700',
  '완료': 'bg-green-100 text-green-700',
  '취소': 'bg-red-100 text-red-700',
};

// 상태 인덱스 매핑
export const STATUS_INDEX_MAP = {
  '등록': 0,
  '접수': 1,
  '배차': 2,
  '운행': 3,
  '완료': 4,
  '취소': -1,
};

/**
 * 상태에 따른 진행 단계 인덱스 반환
 * @param {string} status - 주문 상태
 * @returns {number} 진행 단계 인덱스 (-1: 취소 또는 알 수 없음)
 */
export const getStatusIndex = (status) => {
  return STATUS_INDEX_MAP[status] ?? -1;
};
