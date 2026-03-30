const STATUS_STYLES = {
  접수: 'bg-gray-100 text-gray-700',
  배차대기: 'bg-yellow-100 text-yellow-800',
  배차완료: 'bg-blue-100 text-blue-800',
  상차: 'bg-indigo-100 text-indigo-800',
  운송중: 'bg-sky-100 text-sky-800',
  하차완료: 'bg-green-100 text-green-800',
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}
