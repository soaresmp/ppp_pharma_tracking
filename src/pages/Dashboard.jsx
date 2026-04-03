import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Package, GitBranch, AlertTriangle, FileText,
  Receipt, Activity, TrendingUp, ShieldAlert,
  CheckCircle, Clock, Truck, FlaskConical
} from 'lucide-react';
import {
  DASHBOARD_STATS, MONTHLY_DISTRIBUTION,
  PRODUCT_DISTRIBUTION_BY_REGION, SUPPLY_CHAIN_FLOW,
  RECALLS, BATCHES, PRODUCTS, ORGANIZATIONS
} from '../data/mockData';

function StatCard({ icon: Icon, label, value, sub, color = 'green', urgent }) {
  const colors = {
    green:  { bg: 'bg-ppb-green-light', icon: 'text-ppb-green', border: 'border-ppb-green' },
    red:    { bg: 'bg-red-50',   icon: 'text-red-600',   border: 'border-red-400' },
    yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600', border: 'border-yellow-400' },
    blue:   { bg: 'bg-blue-50',  icon: 'text-blue-600',  border: 'border-blue-400' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-400' },
  };
  const c = colors[color] || colors.green;
  return (
    <div className={`bg-white rounded-xl border ${urgent ? `border-l-4 ${c.border}` : 'border-gray-200'} p-5 flex items-start gap-4 shadow-sm`}>
      <div className={`p-2.5 rounded-lg ${c.bg} flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${c.icon}`} />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</div>
        <div className="text-sm font-medium text-gray-700 mt-0.5">{label}</div>
        {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const s = DASHBOARD_STATS;

  return (
    <Layout
      title="PPB PharmaTrack Dashboard"
      subtitle="Kenya Pharmacy & Poisons Board — Real-time medicines traceability overview"
    >
      {/* Alert Banner */}
      {RECALLS.some(r => r.status === 'In Progress') && (
        <div className="mb-5 bg-red-50 border border-red-300 rounded-xl px-5 py-3 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <span className="font-semibold text-red-800 text-sm">Active Recall Alert: </span>
            <span className="text-red-700 text-sm">
              RECALL-2025-003 — Metformin HCl Batch MF231201 (Class II) is under active recall.
              Recovery rate: 88.9%.
            </span>
          </div>
          <StatusBadge status="In Progress" />
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Package}    label="Registered Products" value={s.registeredProducts} sub="PPB-approved" color="green" />
        <StatCard icon={FlaskConical} label="Active Batches"    value={s.activeBatches}      sub="In circulation" color="blue" />
        <StatCard icon={GitBranch}  label="Supply Chain Events" value={s.supplyChainEvents}  sub="All-time recorded" color="purple" />
        <StatCard icon={FileText}   label="Active Prescriptions" value={s.activePrescriptions} sub="e-Rx this month" color="green" />
        <StatCard icon={AlertTriangle} label="Active Recalls"   value={s.activeRecalls}      sub="Class I & II"   color="red"    urgent />
        <StatCard icon={Clock}      label="Pending Clearance"   value={s.pendingImportClearance} sub="Import permits" color="yellow" urgent />
        <StatCard icon={ShieldAlert} label="Counterfeit Alerts" value={s.counterfeitAlerts}  sub="Under investigation" color="red" urgent />
        <StatCard icon={Receipt}    label="eTIMS Invoices"       value={s.eTIMSInvoicesMonth} sub="This month"     color="blue" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Monthly Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-800">Supply Chain Events & Prescriptions</h2>
              <p className="text-xs text-gray-500">Last 6 months</p>
            </div>
            <TrendingUp className="w-4 h-4 text-ppb-green" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY_DISTRIBUTION}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="events" stroke="#006B3F" strokeWidth={2} dot={{ r: 3 }} name="SC Events" />
              <Line type="monotone" dataKey="prescriptions" stroke="#D4AF37" strokeWidth={2} dot={{ r: 3 }} name="e-Prescriptions" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Supply Chain Nodes */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-gray-800">Registered Stakeholders</h2>
            <p className="text-xs text-gray-500">By supply chain role</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={SUPPLY_CHAIN_FLOW} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                {SUPPLY_CHAIN_FLOW.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-1">
            {SUPPLY_CHAIN_FLOW.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.fill }}></span>
                  <span className="text-gray-600 truncate">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional Distribution & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Regional Bar */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-gray-800">Units Distributed by Region</h2>
            <p className="text-xs text-gray-500">Current quarter</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={PRODUCT_DISTRIBUTION_BY_REGION} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="region" type="category" tick={{ fontSize: 11 }} width={65} />
              <Tooltip />
              <Bar dataKey="units" fill="#006B3F" radius={[0, 4, 4, 0]} name="Units" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Batches */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-800 mb-3">Recent Batch Activity</h2>
          <div className="space-y-3">
            {BATCHES.slice(0, 5).map(b => {
              const product = PRODUCTS.find(p => p.id === b.productId);
              return (
                <div key={b.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${b.status === 'Recalled' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-gray-800 truncate">{product?.brandName}</div>
                    <div className="text-xs text-gray-500">Batch: {b.batchNumber}</div>
                    <div className="text-xs text-gray-400">Exp: {b.expiryDate}</div>
                  </div>
                  <StatusBadge status={b.status} size="xs" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Status Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h2 className="text-sm font-bold text-gray-800 mb-4">Active Recall Status</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Recall ID', 'Product', 'Batch', 'Class', 'Reason', 'Recovered', 'Status'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 pb-2 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECALLS.map(r => {
                const product = PRODUCTS.find(p => p.id === r.productId);
                const batch = BATCHES.find(b => b.id === r.batchId);
                const pct = Math.round((r.recoveredQty / r.affectedQty) * 100);
                return (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 pr-4 font-mono text-xs text-red-700 font-semibold">{r.id}</td>
                    <td className="py-2 pr-4 text-xs">{product?.brandName}</td>
                    <td className="py-2 pr-4 font-mono text-xs">{batch?.batchNumber}</td>
                    <td className="py-2 pr-4"><StatusBadge status={r.recallClass} /></td>
                    <td className="py-2 pr-4 text-xs text-gray-600 max-w-xs truncate">{r.reason}</td>
                    <td className="py-2 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 w-16">
                          <div className="bg-ppb-green h-1.5 rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-700 font-semibold">{pct}%</span>
                      </div>
                    </td>
                    <td className="py-2"><StatusBadge status={r.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
