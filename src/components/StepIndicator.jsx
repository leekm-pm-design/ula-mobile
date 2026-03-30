import { ORDER_STEPS, getStatusIndex } from '../constants/orderStatus';

/**
 * 주문 상태 진행 단계 표시 컴포넌트
 * @param {Object} props
 * @param {string} props.currentStatus - 현재 주문 상태
 */
export default function StepIndicator({ currentStatus }) {
  const currentIdx = getStatusIndex(currentStatus);
  const isCancelled = currentStatus === '취소';

  // 취소 상태인 경우 별도 UI 표시
  if (isCancelled) {
    return (
      <div className="flex items-center justify-center w-full px-2 py-4">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-400 text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <span className="mt-2 text-sm font-semibold text-gray-600">취소</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center w-full px-4 py-4">
      {ORDER_STEPS.map((step, i) => {
        const isDone = i <= currentIdx;
        const isCurrent = i === currentIdx;

        return (
          <>
            {/* 단계 원형 아이콘 */}
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                  ${isCurrent ? 'bg-blue-600 text-white ring-2 ring-blue-200' : isDone ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}
              >
                {isDone ? '✓' : i + 1}
              </div>
              <span
                className={`mt-1 text-[10px] whitespace-nowrap ${isCurrent ? 'text-blue-600 font-semibold' : isDone ? 'text-gray-700' : 'text-gray-400'}`}
              >
                {step}
              </span>
            </div>

            {/* 단계 간 연결선 */}
            {i < ORDER_STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${i < currentIdx ? 'bg-blue-600' : 'bg-gray-200'}`} />
            )}
          </>
        );
      })}
    </div>
  );
}
