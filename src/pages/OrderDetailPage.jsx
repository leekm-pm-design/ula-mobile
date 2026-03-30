import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import StepIndicator from '../components/StepIndicator';
import { formatDateTime } from '../utils/dateUtils';
import { formatCurrency, formatDistance, formatArray, formatPhoneNumber } from '../utils/formatUtils';

/**
 * 정보 행 컴포넌트
 */
function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-gray-100">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right max-w-[60%] break-words">
        {value || '-'}
      </span>
    </div>
  );
}

/**
 * 화물 상세 페이지
 */
export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order] = useState(location.state?.order || null);
  const [loading] = useState(false);

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 주문 정보 없음
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
      <RouteSection order={order} />

      {/* 화물 정보 */}
      <CargoInfoSection order={order} />

      {/* 차주 정보 (배차완료 이후에만) */}
      {order.CarName && <DriverInfoSection order={order} />}
    </div>
  );
}

/**
 * 구간 정보 섹션
 */
function RouteSection({ order }) {
  return (
    <div className="bg-white mx-4 mt-3 rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          구간 정보
        </h2>
        {/* 주문 유형 뱃지 */}
        <div className="flex items-center gap-1.5">
          {order.IsRound && (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-purple-50 text-purple-600 rounded">
              왕복
            </span>
          )}
          {!order.IsRound && (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-50 text-gray-600 rounded">
              편도
            </span>
          )}
          {order.IsAllowMix ? (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-600 rounded">
              혼적
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-green-50 text-green-600 rounded">
              독차
            </span>
          )}
          {order.IsUrgency && (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-red-50 text-red-600 rounded">
              긴급
            </span>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3">
        {/* 구간 표시 아이콘 */}
        <div className="flex flex-col items-center pt-0.5">
          <div className="w-2 h-2 rounded-full bg-blue-600" />
          <div className="w-0.5 h-12 bg-gray-200 my-0.5" />
          <div className="w-2 h-2 rounded-full bg-red-500" />
        </div>

        {/* 상하차지 정보 */}
        <div className="flex-1 space-y-3">
          {/* 상차지 */}
          <LocationInfo
            label="상차지"
            name={order.LoadArea?.Name}
            address={order.LoadArea?.FullAddr}
            date={formatDateTime(order.LoadArea?.Date)}
            method={order.LoadArea?.CargoMoveMethod}
            contactName={order.LoadArea?.ManagerName}
            contactPhone={order.LoadArea?.ManagerPhoneNum}
          />

          {/* 하차지 */}
          <LocationInfo
            label="하차지"
            name={order.DropArea?.Name}
            address={order.DropArea?.FullAddr}
            date={formatDateTime(order.DropArea?.Date)}
            method={order.DropArea?.CargoMoveMethod}
            contactName={order.DropArea?.ManagerName}
            contactPhone={order.DropArea?.ManagerPhoneNum}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * 위치 정보 컴포넌트
 */
function LocationInfo({ label, name, address, date, method, contactName, contactPhone }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-0.5">
        <p className="text-[10px] text-gray-400">{label}</p>
        {method && (
          <span className="px-1.5 py-0.5 text-[9px] font-medium bg-blue-50 text-blue-600 rounded">
            {method}
          </span>
        )}
      </div>
      <p className="text-sm font-semibold text-gray-900">{name || '-'}</p>
      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{address || '-'}</p>
      <p className="text-[11px] text-gray-400 mt-0.5">{date}</p>
      {(contactName || contactPhone) && (
        <div className="mt-1.5 flex items-center gap-2 text-[11px]">
          {contactName && (
            <span className="text-gray-600">{contactName}</span>
          )}
          {contactPhone && (
            <>
              {contactName && <span className="text-gray-300">•</span>}
              <a
                href={`tel:${contactPhone}`}
                className="text-green-600 font-medium"
              >
                {formatPhoneNumber(contactPhone)}
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 화물 정보 섹션
 */
function CargoInfoSection({ order }) {
  return (
    <div className="bg-white mx-4 mt-3 rounded-xl shadow-sm border border-gray-100 p-4">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        화물 정보
      </h2>
      <InfoRow label="화물번호" value={order.OrderNum} />
      <InfoRow label="화주" value={order.CargoCorpName} />
      <InfoRow label="화주 담당자" value={order.CargoCorpManagerName} />
      <InfoRow label="화주 연락처" value={formatPhoneNumber(order.CargoCorpContactNumber)} />
      <InfoRow label="접수일" value={formatDateTime(order.RegistDate)} />
      <InfoRow label="톤수" value={order.ExpectCarWeight} />
      <InfoRow label="차종" value={order.ExpectCarType} />
      <InfoRow label="차체타입" value={formatArray(order.ExpectCarBodyTypes)} />
      <InfoRow label="청구금" value={formatCurrency(order.TotalSalesAmount)} />
      <InfoRow label="총배차금" value={formatCurrency(order.TotalPurchaseAmount)} />
      <InfoRow label="거리" value={formatDistance(order.Distance)} />
      <InfoRow label="화물내역" value={order.Items} />
      <InfoRow label="추가요청사항" value={order.AddRequests} />
    </div>
  );
}

/**
 * 차주 정보 섹션
 */
function DriverInfoSection({ order }) {
  return (
    <div className="bg-white mx-4 mt-3 rounded-xl shadow-sm border border-gray-100 p-4">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        차주 정보
      </h2>
      <InfoRow label="차주명" value={order.CarName} />
      <InfoRow label="연락처" value={formatPhoneNumber(order.CarPhoneNum)} />
      <InfoRow label="차량번호" value={order.CarNum} />
      <InfoRow
        label="차량정보"
        value={`${order.CarWeight || ''} ${order.CarType || ''}`.trim()}
      />
      {order.CarPhoneNum && (
        <a
          href={`tel:${order.CarPhoneNum}`}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-green-50 text-green-700 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          전화걸기
        </a>
      )}
    </div>
  );
}
