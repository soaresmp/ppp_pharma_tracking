const variants = {
  Active:      'bg-green-100 text-green-800',
  Recalled:    'bg-red-100 text-red-800',
  Expired:     'bg-gray-100 text-gray-600',
  Validated:   'bg-blue-100 text-blue-800',
  Pending:     'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-orange-100 text-orange-800',
  Completed:   'bg-green-100 text-green-800',
  Dispensed:   'bg-blue-100 text-blue-800',
  'Pending Dispensing': 'bg-yellow-100 text-yellow-800',
  Imported:    'bg-purple-100 text-purple-800',
  'Cold Chain':'bg-cyan-100 text-cyan-800',
  Warning:     'bg-orange-100 text-orange-800',
  Error:       'bg-red-100 text-red-800',
  default:     'bg-gray-100 text-gray-700',
};

export default function StatusBadge({ status, size = 'sm' }) {
  const cls = variants[status] || variants.default;
  const sizeCls = size === 'xs' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeCls} ${cls}`}>
      {status}
    </span>
  );
}
