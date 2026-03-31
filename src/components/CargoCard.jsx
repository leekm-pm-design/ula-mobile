import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { formatDateTimeShort } from '../utils/dateUtils';
import { formatNumber } from '../utils/formatUtils';

/**
 * 화물 카드 컴포넌트
 * @param {Object} props
 * @param {Object} props.order - 주문 정보 객체
 */
export default function CargoCard({ order }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/orders/${order.OrderNum}`, { state: { order } });
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 active:bg-gray-50 cursor-pointer"
    >
      {/* 상단: 화물번호 + 주문유형 뱃지 + 화주명 / 상태 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <span className="text-xs text-gray-500 shrink-0">#{order.OrderNum || '-'}</span>
          {/* 주문 유형 뱃지 */}
          {order.IsRound && (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-purple-50 text-purple-600 rounded shrink-0">
              왕복
            </span>
          )}
          {order.IsLayover && (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-orange-50 text-orange-600 rounded shrink-0">
              경유
            </span>
          )}
          {order.IsAllowMix && (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-600 rounded shrink-0">
              혼적
            </span>
          )}
          {order.IsUrgency && (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-red-50 text-red-600 rounded shrink-0">
              긴급
            </span>
          )}
          {order.CargoCorpName && (
            <>
              <span className="text-gray-300 shrink-0">|</span>
              <span className="text-xs font-medium text-gray-900 truncate">
                {order.CargoCorpName}
              </span>
            </>
          )}
        </div>
        <StatusBadge status={order.OrdState} />
      </div>

      {/* 상하차지 정보 */}
      <div className="space-y-2 mb-2">
        {/* 상차지 */}
        <LocationRow
          label="상차"
          bgColor="bg-blue-600"
          name={order.LoadArea?.Name}
          address={order.LoadArea?.FullAddr}
          time={formatDateTimeShort(order.LoadArea?.Date)}
        />

        {/* 하차지 */}
        <LocationRow
          label="하차"
          bgColor="bg-red-600"
          name={order.DropArea?.Name}
          address={order.DropArea?.FullAddr}
          time={formatDateTimeShort(order.DropArea?.Date)}
        />
      </div>

      {/* 하단: 차량 정보 + 금액 정보 */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        {/* 차량 정보 */}
        <VehicleInfo order={order} />

        {/* 금액 정보 */}
        <AmountInfo order={order} />
      </div>
    </div>
  );
}

/**
 * 상하차지 행 컴포넌트
 */
function LocationRow({ label, bgColor, name, address, time }) {
  return (
    <div className="flex items-start gap-1.5">
      <span className={`text-[10px] text-white ${bgColor} px-1 py-0.5 rounded font-medium shrink-0`}>
        {label}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-900 truncate">{name || '-'}</p>
        <p className="text-[10px] text-gray-500 truncate mt-0.5">{address || '-'}</p>
      </div>
      <span className="text-[10px] text-gray-400 shrink-0">{time}</span>
    </div>
  );
}

/**
 * 차량 정보 컴포넌트
 */
function VehicleInfo({ order }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
      {order.ExpectCarWeight && (
        <span className="bg-gray-100 px-1.5 py-0.5 rounded">{order.ExpectCarWeight}</span>
      )}
      {order.ExpectCarType && (
        <span className="bg-gray-100 px-1.5 py-0.5 rounded">{order.ExpectCarType}</span>
      )}
      {order.ExpectCarBodyTypes && order.ExpectCarBodyTypes.length > 0 && (
        <span className="bg-gray-100 px-1.5 py-0.5 rounded">
          {order.ExpectCarBodyTypes[0]}
        </span>
      )}
    </div>
  );
}

/**
 * 금액 정보 컴포넌트
 */
function AmountInfo({ order }) {
  return (
    <div className="flex items-center gap-3">
      {order.TotalSalesAmount !== undefined && (
        <AmountItem label="청구" value={order.TotalSalesAmount} colorClass="text-blue-600" />
      )}
      {order.TotalPurchaseAmount !== undefined && (
        <AmountItem
          label="배차"
          value={order.TotalPurchaseAmount}
          colorClass="text-green-600"
        />
      )}
    </div>
  );
}

/**
 * 금액 항목 컴포넌트
 */
function AmountItem({ label, value, colorClass }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[9px] text-gray-400">{label}</span>
      <span className={`text-xs font-semibold ${colorClass}`}>{formatNumber(value)}</span>
    </div>
  );
}
