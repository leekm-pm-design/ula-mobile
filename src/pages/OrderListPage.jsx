import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import CargoCard from '../components/CargoCard';
import { STATUS_FILTERS } from '../constants/orderStatus';
import { getTodayString, getTomorrowString } from '../utils/dateUtils';
import BottomNav from '../components/BottomNav';

/**
 * 화물 리스트 페이지
 */
export default function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'new'
  const [statusFilter, setStatusFilter] = useState('전체');
  const [search, setSearch] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  // 날짜 필터 - 기본값: 오늘 ~ 내일
  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState(getTomorrowString());

  const { logout } = useAuth();
  const navigate = useNavigate();

  // 화물 목록 조회
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrders({ startDate, endDate });

      // API 응답 구조에 맞춰 데이터 추출
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

  // 신규건 필터 함수 (1시간 이내 접수)
  const isNewOrder = (order) => {
    if (!order.RegistDate) return false;
    const registTime = new Date(order.RegistDate).getTime();
    const now = Date.now();
    const oneHourInMs = 60 * 60 * 1000;
    return (now - registTime) <= oneHourInMs;
  };

  // 상태별 건수 계산 (신규건 모드일 때는 신규건만 카운트)
  const statusCounts = STATUS_FILTERS.reduce((acc, status) => {
    const targetOrders = viewMode === 'new' ? orders.filter(isNewOrder) : orders;
    if (status === '전체') {
      acc[status] = targetOrders.length;
    } else {
      acc[status] = targetOrders.filter((o) => o.OrdState === status).length;
    }
    return acc;
  }, {});

  // 필터링
  const filtered = orders
    .filter((o) => {
      // 신규건 보기 모드일 때
      if (viewMode === 'new' && !isNewOrder(o)) return false;

      // 상태 필터
      if (statusFilter !== '전체' && o.OrdState !== statusFilter) return false;

      // 검색어 필터
      if (search) {
        const q = search.toLowerCase();
        const loadAreaText = o.LoadArea?.Name || o.LoadArea?.Addr1 || '';
        const dropAreaText = o.DropArea?.Name || o.DropArea?.Addr1 || '';
        const cargoCorpName = o.CargoCorpName || '';
        return (
          (o.OrderNum || '').toLowerCase().includes(q) ||
          loadAreaText.toLowerCase().includes(q) ||
          dropAreaText.toLowerCase().includes(q) ||
          cargoCorpName.toLowerCase().includes(q)
        );
      }

      return true;
    })
    .sort((a, b) => {
      // 신규 탭: 접수시간 기준 내림차순 정렬 (최신순)
      if (viewMode === 'new') {
        const dateA = a.RegistDate ? new Date(a.RegistDate).getTime() : 0;
        const dateB = b.RegistDate ? new Date(b.RegistDate).getTime() : 0;
        return dateB - dateA;
      }

      // 전체 탭: 상차시간 기준 오름차순 정렬 (가까운 시간이 위로)
      const dateA = a.LoadArea?.Date ? new Date(a.LoadArea.Date).getTime() : Infinity;
      const dateB = b.LoadArea?.Date ? new Date(b.LoadArea.Date).getTime() : Infinity;
      return dateA - dateB;
    });

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col pb-20">
      {/* 헤더 + 필터 영역 (고정) */}
      <div className="sticky top-0 z-10 bg-white">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-900">ULA</h1>
          <button onClick={handleLogout} className="text-xs text-gray-500 py-1 px-2">
            로그아웃
          </button>
        </div>

        {/* 전체/신규 탭 */}
        <div className="flex border-b border-gray-200 bg-white">
          <button
            onClick={() => setViewMode('all')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              viewMode === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setViewMode('new')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              viewMode === 'new'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
          >
            신규
            {orders.filter(isNewOrder).length > 0 && (
              <span className="absolute top-2 right-[calc(50%-20px)] w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* 필터 영역 */}
        <div className="bg-gray-50">
          {/* 필터 헤더 */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
            <span className="text-sm font-medium text-gray-700">필터</span>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-1"
            >
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {isFilterOpen && (
            <div className="pb-3 bg-gray-50">
              {/* 검색 */}
              <div className="px-4 pt-2">
                <input
                  type="text"
                  placeholder="화물번호, 화주명, 상차지, 하차지 검색"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              {/* 날짜 선택 */}
              <div className="px-4 pt-3">
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <span className="text-gray-500 text-sm">~</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              {/* 상태 필터 */}
              <div className="grid grid-cols-7 gap-2 px-4 pt-3">
                {STATUS_FILTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-2 py-1.5 rounded-full text-xs font-medium transition-colors
                    ${statusFilter === s ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                  >
                    <div className="flex flex-col items-center">
                      <span>{s}</span>
                      <span
                        className={`text-[10px] ${statusFilter === s ? 'text-blue-100' : 'text-gray-400'}`}
                      >
                        {statusCounts[s] || 0}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 리스트 */}
      <div className="flex-1 px-4 pb-6 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-sm text-gray-400">
            조회된 화물이 없습니다.
          </div>
        ) : (
          filtered.map((order) => <CargoCard key={order.OrderNum} order={order} />)
        )}
      </div>

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
