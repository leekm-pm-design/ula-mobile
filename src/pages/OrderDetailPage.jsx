import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import StepIndicator from '../components/StepIndicator';

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-gray-100">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right max-w-[60%] break-words">{value || '-'}</span>
    </div>
  );
}

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(false);

  // 시간 포맷팅 함수
  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center text-gray-400">
        <p>화물 정보를 찾을 수 없습니다.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 text-sm">
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gray-50 pb-8">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-base font-bold text-gray-900">화물 상세</h1>
      </header>

      {/* 상태 스텝 인디케이터 */}
      <div className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100">
        <StepIndicator currentStatus={order.OrdState} />
      </div>

      {/* 구간 정보 */}
      <div className="bg-white mx-4 mt-3 rounded-xl shadow-sm border border-gray-100 p-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">구간 정보</h2>
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center pt-1">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <div className="w-0.5 h-16 bg-gray-200 my-1" />
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">상차지</p>
              <p className="text-sm font-semibold text-gray-900">{order.LoadArea?.Name || '-'}</p>
              <p className="text-xs text-gray-500 mt-0.5">{order.LoadArea?.FullAddr || '-'}</p>
              <p className="text-xs text-gray-400 mt-1">{formatDateTime(order.LoadArea?.Date)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">하차지</p>
              <p className="text-sm font-semibold text-gray-900">{order.DropArea?.Name || '-'}</p>
              <p className="text-xs text-gray-500 mt-0.5">{order.DropArea?.FullAddr || '-'}</p>
              <p className="text-xs text-gray-400 mt-1">{formatDateTime(order.DropArea?.Date)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 화물 정보 */}
      <div className="bg-white mx-4 mt-3 rounded-xl shadow-sm border border-gray-100 p-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">화물 정보</h2>
        <InfoRow label="화물번호" value={order.OrderNum} />
        <InfoRow label="화주" value={order.CargoCorpName} />
        <InfoRow label="접수일" value={formatDateTime(order.RegistDate)} />
        <InfoRow label="톤수" value={order.ExpectCarWeight} />
        <InfoRow label="차종" value={order.ExpectCarType} />
        <InfoRow label="차체타입" value={order.ExpectCarBodyTypes?.join(', ')} />
        <InfoRow label="운임" value={order.Pay ? `${Number(order.Pay).toLocaleString()}원` : null} />
        <InfoRow label="청구금" value={order.TotalSalesAmount !== undefined ? `${Number(order.TotalSalesAmount).toLocaleString()}원` : null} />
        <InfoRow label="총배차금" value={order.TotalPurchaseAmount !== undefined ? `${Number(order.TotalPurchaseAmount).toLocaleString()}원` : null} />
        <InfoRow label="거리" value={order.Distance ? `${order.Distance}km` : null} />
        <InfoRow label="화물내역" value={order.Items} />
        <InfoRow label="추가요청사항" value={order.AddRequests} />
      </div>

      {/* 차주 정보 (배차완료 이후에만) */}
      {order.CarName && (
        <div className="bg-white mx-4 mt-3 rounded-xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">차주 정보</h2>
          <InfoRow label="차주명" value={order.CarName} />
          <InfoRow label="연락처" value={order.CarPhoneNum} />
          <InfoRow label="차량번호" value={order.CarNum} />
          <InfoRow label="차량정보" value={`${order.CarWeight || ''} ${order.CarType || ''}`.trim()} />
          {order.CarPhoneNum && (
            <a
              href={`tel:${order.CarPhoneNum}`}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-green-50 text-green-700 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              전화걸기
            </a>
          )}
        </div>
      )}
    </div>
  );
}
