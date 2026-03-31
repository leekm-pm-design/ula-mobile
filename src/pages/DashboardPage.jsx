import { useState, useEffect, useCallback } from 'react';
import { getOrders } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/formatUtils';
import { getTodayString, getTomorrowString } from '../utils/dateUtils';
import BottomNav from '../components/BottomNav';

/**
 * 대시보드 페이지
 */
export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState(getTomorrowString());
  const { user } = useAuth();

  // 화물 목록 조회
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrders({ startDate, endDate });

      let ordersList = [];
      if (Array.isArray(data)) {
        ordersList = data;
      } else if (Array.isArray(data.result)) {
        ordersList = data.result;
      } else if (Array.isArray(data.items)) {
        ordersList = data.items;
      } else if (data.result && typeof data.result === 'string') {
        console.warn('API returned compressed/encoded data in result field');
        ordersList = [];
      }

      setOrders(ordersList);
    } catch (err) {
      console.error('화물 조회 실패:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // 디버깅: 사용자 정보 확인
  useEffect(() => {
    if (user?.guid) {
      console.log('로그인한 사용자 GUID:', user.guid);
      console.log('로그인한 사용자 이름:', user.name);
    }
  }, [user]);

  // 전체 화물 배차 완료된 건만 필터링
  const allDispatchedOrders = orders.filter(o =>
    ['배차', '운행', '완료'].includes(o.OrdState)
  );

  // 내 화물만 필터링
  const myOrders = orders.filter(o => o.DispatchManagerGuid === user?.guid);

  // 디버깅: 필터링 결과 확인
  useEffect(() => {
    if (orders.length > 0 && user?.guid) {
      console.log('전체 주문 수:', orders.length);
      console.log('내 주문 수:', myOrders.length);
      console.log('샘플 주문의 DispatchManagerGuid:', orders[0]?.DispatchManagerGuid);
      console.log('로그인한 사용자 GUID:', user.guid);
    }
  }, [orders, myOrders, user]);

  // 내 화물 중 배차 완료된 건
  const myDispatchedOrders = myOrders.filter(o =>
    ['배차', '운행', '완료'].includes(o.OrdState)
  );

  // 전체 화물 통계
  const allStats = {
    totalCount: orders.length,
    dispatchedCount: allDispatchedOrders.length,
    totalSales: allDispatchedOrders.reduce((sum, o) => sum + (o.TotalSalesAmount || 0), 0),
    totalPurchase: allDispatchedOrders.reduce((sum, o) => sum + (o.TotalPurchaseAmount || 0), 0),
    get profit() {
      return this.totalSales - this.totalPurchase;
    },
    get profitMargin() {
      return this.totalSales > 0 ? (this.profit / this.totalSales * 100) : 0;
    }
  };

  // 내 화물 통계
  const myStats = {
    totalCount: myOrders.length,
    dispatchedCount: myDispatchedOrders.length,
    totalSales: myDispatchedOrders.reduce((sum, o) => sum + (o.TotalSalesAmount || 0), 0),
    totalPurchase: myDispatchedOrders.reduce((sum, o) => sum + (o.TotalPurchaseAmount || 0), 0),
    get profit() {
      return this.totalSales - this.totalPurchase;
    },
    get profitMargin() {
      return this.totalSales > 0 ? (this.profit / this.totalSales * 100) : 0;
    }
  };

  // 상태별 통계 (전체)
  const statusOrder = ['등록', '접수', '배차', '운행', '완료', '취소'];
  const allStatusCounts = statusOrder.map(status => {
    const count = orders.filter(o => o.OrdState === status).length;
    return { status, count };
  });

  // 상태별 통계 (내 화물)
  const myStatusCounts = statusOrder.map(status => {
    const count = myOrders.filter(o => o.OrdState === status).length;
    return { status, count };
  });

  return (
    <div className="min-h-dvh bg-gray-50 pb-20">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <h1 className="text-lg font-bold text-gray-900">대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">
          안녕하세요, <span className="font-medium text-gray-900">{user?.name || '담당자'}</span>님
        </p>
      </header>

      {/* 날짜 선택 */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex-1 min-w-0 px-2 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500 text-xs shrink-0">~</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex-1 min-w-0 px-2 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* 비교 지표 */}
          <div className="px-3 mt-3">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-3 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold">내 성과 분석</h3>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {/* 처리율 */}
                <div className="bg-white/10 backdrop-blur rounded-lg p-2 text-center">
                  <p className="text-[9px] text-white/80 mb-0.5">처리율</p>
                  <p className="text-base font-bold">
                    {allStats.totalCount > 0
                      ? ((myStats.totalCount / allStats.totalCount) * 100).toFixed(1)
                      : 0}%
                  </p>
                  <p className="text-[8px] text-white/70 mt-0.5">
                    {myStats.totalCount}/{allStats.totalCount}건
                  </p>
                </div>

                {/* 수익률 차이 */}
                <div className="bg-white/10 backdrop-blur rounded-lg p-2 text-center">
                  <p className="text-[9px] text-white/80 mb-0.5">수익률 차이</p>
                  <p className={`text-base font-bold ${
                    (myStats.profitMargin - allStats.profitMargin) >= 0
                      ? 'text-yellow-300'
                      : 'text-red-300'
                  }`}>
                    {myStats.profitMargin - allStats.profitMargin >= 0 ? '+' : ''}
                    {(myStats.profitMargin - allStats.profitMargin).toFixed(1)}%p
                  </p>
                  <p className="text-[8px] text-white/70 mt-0.5">
                    {myStats.profitMargin >= allStats.profitMargin ? '평균 이상' : '평균 이하'}
                  </p>
                </div>

                {/* 건당 평균 수익 비교 */}
                <div className="bg-white/10 backdrop-blur rounded-lg p-2 text-center">
                  <p className="text-[9px] text-white/80 mb-0.5">건당 수익</p>
                  <p className={`text-base font-bold ${
                    ((myStats.dispatchedCount > 0 ? myStats.profit / myStats.dispatchedCount : 0) -
                    (allStats.dispatchedCount > 0 ? allStats.profit / allStats.dispatchedCount : 0)) >= 0
                      ? 'text-yellow-300'
                      : 'text-red-300'
                  }`}>
                    {((myStats.dispatchedCount > 0 ? myStats.profit / myStats.dispatchedCount : 0) -
                    (allStats.dispatchedCount > 0 ? allStats.profit / allStats.dispatchedCount : 0)) >= 0 ? '+' : ''}
                    {formatCurrency(Math.round(Math.abs((myStats.dispatchedCount > 0 ? myStats.profit / myStats.dispatchedCount : 0) -
                    (allStats.dispatchedCount > 0 ? allStats.profit / allStats.dispatchedCount : 0))))}
                  </p>
                  <p className="text-[8px] text-white/70 mt-0.5">
                    {((myStats.dispatchedCount > 0 ? myStats.profit / myStats.dispatchedCount : 0) -
                    (allStats.dispatchedCount > 0 ? allStats.profit / allStats.dispatchedCount : 0)) >= 0 ? '평균 이상' : '평균 이하'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 주요 통계 카드 (전체 / 내) */}
          <div className="px-3 mt-3">
            <div className="grid grid-cols-2 gap-2">
              {/* 전체 화물 */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2.5 border border-gray-200">
                <div className="flex items-center gap-1 mb-1.5">
                  <div className="w-0.5 h-3 bg-gray-600 rounded-full"></div>
                  <h3 className="text-[11px] font-bold text-gray-800">전체</h3>
                </div>
                <div className="space-y-1.5">
                  <div className="bg-white rounded p-1.5 border border-gray-200">
                    <p className="text-[8px] text-gray-500">건수</p>
                    <p className="text-xs font-bold text-gray-900">{allStats.totalCount}건</p>
                  </div>
                  <div className="bg-white rounded p-1.5 border border-gray-200">
                    <p className="text-[8px] text-gray-500">청구</p>
                    <p className="text-xs font-bold text-blue-600">{formatCurrency(allStats.totalSales)}</p>
                  </div>
                  <div className="bg-white rounded p-1.5 border border-gray-200">
                    <p className="text-[8px] text-gray-500">배차</p>
                    <p className="text-xs font-bold text-green-600">{formatCurrency(allStats.totalPurchase)}</p>
                  </div>
                  <div className="bg-white rounded p-1.5 border border-gray-200">
                    <p className="text-[8px] text-gray-500">수익</p>
                    <p className={`text-xs font-bold ${allStats.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatCurrency(allStats.profit)}
                    </p>
                  </div>
                  <div className="bg-white rounded p-1.5 border border-gray-200">
                    <p className="text-[8px] text-gray-500">수익률</p>
                    <p className={`text-sm font-bold ${allStats.profitMargin >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {allStats.profitMargin.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* 내 화물 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-2.5 border-2 border-blue-200">
                <div className="flex items-center gap-1 mb-1.5">
                  <div className="w-0.5 h-3 bg-blue-600 rounded-full"></div>
                  <h3 className="text-[11px] font-bold text-blue-900">내화물</h3>
                </div>
                <div className="space-y-1.5">
                  <div className="bg-white rounded p-1.5 border border-blue-100">
                    <p className="text-[8px] text-blue-600">건수</p>
                    <p className="text-xs font-bold text-blue-900">{myStats.totalCount}건</p>
                  </div>
                  <div className="bg-white rounded p-1.5 border border-blue-100">
                    <p className="text-[8px] text-blue-600">청구</p>
                    <p className="text-xs font-bold text-blue-700">{formatCurrency(myStats.totalSales)}</p>
                  </div>
                  <div className="bg-white rounded p-1.5 border border-blue-100">
                    <p className="text-[8px] text-blue-600">배차</p>
                    <p className="text-xs font-bold text-green-600">{formatCurrency(myStats.totalPurchase)}</p>
                  </div>
                  <div className="bg-white rounded p-1.5 border border-blue-100">
                    <p className="text-[8px] text-blue-600">수익</p>
                    <p className={`text-xs font-bold ${myStats.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatCurrency(myStats.profit)}
                    </p>
                  </div>
                  <div className="bg-white rounded p-1.5 border border-blue-100">
                    <p className="text-[8px] text-blue-600">수익률</p>
                    <p className={`text-sm font-bold ${myStats.profitMargin >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {myStats.profitMargin.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 상태별 통계 */}
          <div className="px-3 mt-3 mb-3">
            <div className="grid grid-cols-2 gap-2">
              {/* 전체 상태 */}
              <div className="bg-white rounded-lg border border-gray-100 p-2">
                <h3 className="text-[9px] font-semibold text-gray-400 uppercase mb-1.5">
                  전체 상태
                </h3>
                <div className="grid grid-cols-2 gap-1">
                  {allStatusCounts.map(({ status, count }) => (
                    <div key={status} className="bg-gray-50 rounded p-1 text-center">
                      <p className="text-[8px] text-gray-500">{status}</p>
                      <p className="text-xs font-bold text-gray-900">{count}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 내 화물 상태 */}
              <div className="bg-white rounded-lg border border-blue-100 p-2">
                <h3 className="text-[9px] font-semibold text-blue-600 uppercase mb-1.5">
                  내 화물 상태
                </h3>
                <div className="grid grid-cols-2 gap-1">
                  {myStatusCounts.map(({ status, count }) => (
                    <div key={status} className="bg-blue-50 rounded p-1 text-center">
                      <p className="text-[8px] text-blue-600">{status}</p>
                      <p className="text-xs font-bold text-blue-900">{count}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 새로고침 FAB */}
      <button
        onClick={fetchOrders}
        className="fixed bottom-24 right-6 w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center active:bg-blue-700"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>

      {/* 하단 탭 네비게이션 */}
      <BottomNav />
    </div>
  );
}

/**
 * 통계 카드 컴포넌트
 */
function StatCard({ label, value, bgColor, textColor }) {
  return (
    <div className={`${bgColor} rounded-xl p-4`}>
      <p className="text-xs text-gray-600 mb-1">{label}</p>
      <p className={`text-xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
}
