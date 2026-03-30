const STEPS = ['등록', '접수', '배차', '운행', '완료'];

export default function StepIndicator({ currentStatus }) {
  // 상태에 따른 인덱스 매핑
  const getStatusIndex = (status) => {
    const statusMap = {
      '등록': 0,
      '접수': 1,
      '배차': 2,
      '운행': 3,
      '완료': 4,
      '취소': -1  // 취소는 별도 처리
    };
    return statusMap[status] ?? -1;
  };

  const currentIdx = getStatusIndex(currentStatus);
  const isCancelled = currentStatus === '취소';

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
      {STEPS.map((step, i) => {
        const isDone = i <= currentIdx;
        const isCurrent = i === currentIdx;
        return (
          <>
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                  ${isCurrent ? 'bg-blue-600 text-white ring-2 ring-blue-200' : isDone ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}
              >
                {isDone ? '✓' : i + 1}
              </div>
              <span className={`mt-1 text-[10px] whitespace-nowrap ${isCurrent ? 'text-blue-600 font-semibold' : isDone ? 'text-gray-700' : 'text-gray-400'}`}>
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${i < currentIdx ? 'bg-blue-600' : 'bg-gray-200'}`} />
            )}
          </>
        );
      })}
    </div>
  );
}
