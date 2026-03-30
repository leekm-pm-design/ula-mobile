import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';

export default function CargoCard({ order }) {
  const navigate = useNavigate();

  // 시간 포맷팅 (HH:mm)
  const formatTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // 날짜 포맷팅 (MM/DD)
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div
      onClick={() => navigate(`/orders/${order.OrderNum}`, { state: { order } })}
      className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 active:bg-gray-50 cursor-pointer"
    >
      {/* 상단: 화물번호 + 상태 + 화주명 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-xs text-gray-500">#{order.OrderNum || '-'}</span>
          {order.CargoCorpName && (
            <>
              <span className="text-gray-300">|</span>
              <span className="text-xs font-medium text-gray-900 truncate">{order.CargoCorpName}</span>
            </>
          )}
        </div>
        <StatusBadge status={order.OrdState} />
      </div>

      {/* 상하차지 정보 - 컴팩트 */}
      <div className="space-y-2 mb-2">
        {/* 상차지 */}
        <div className="flex items-start gap-1.5">
          <span className="text-[10px] text-white bg-blue-600 px-1 py-0.5 rounded font-medium shrink-0">상차</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">
              {order.LoadArea?.Name || '-'}
            </p>
            <p className="text-[10px] text-gray-500 truncate mt-0.5">
              {order.LoadArea?.FullAddr || '-'}
            </p>
          </div>
          <span className="text-[10px] text-gray-400 shrink-0">
            {formatTime(order.LoadArea?.Date)}
          </span>
        </div>

        {/* 하차지 */}
        <div className="flex items-start gap-1.5">
          <span className="text-[10px] text-white bg-red-600 px-1 py-0.5 rounded font-medium shrink-0">하차</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">
              {order.DropArea?.Name || '-'}
            </p>
            <p className="text-[10px] text-gray-500 truncate mt-0.5">
              {order.DropArea?.FullAddr || '-'}
            </p>
          </div>
          <span className="text-[10px] text-gray-400 shrink-0">
            {formatTime(order.DropArea?.Date)}
          </span>
        </div>
      </div>

      {/* 하단: 차량 정보 + 금액 정보 */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        {/* 차량 정보 */}
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
          {order.ExpectCarWeight && <span className="bg-gray-100 px-1.5 py-0.5 rounded">{order.ExpectCarWeight}</span>}
          {order.ExpectCarType && <span className="bg-gray-100 px-1.5 py-0.5 rounded">{order.ExpectCarType}</span>}
          {order.ExpectCarBodyTypes && order.ExpectCarBodyTypes.length > 0 && (
            <span className="bg-gray-100 px-1.5 py-0.5 rounded">{order.ExpectCarBodyTypes[0]}</span>
          )}
        </div>

        {/* 금액 정보 */}
        <div className="flex items-center gap-3">
          {order.TotalSalesAmount !== undefined && (
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-gray-400">청구</span>
              <span className="text-xs font-semibold text-blue-600">
                {Number(order.TotalSalesAmount).toLocaleString()}
              </span>
            </div>
          )}
          {order.TotalPurchaseAmount !== undefined && (
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-gray-400">배차</span>
              <span className="text-xs font-semibold text-green-600">
                {Number(order.TotalPurchaseAmount).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
