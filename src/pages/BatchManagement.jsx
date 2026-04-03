import { useState } from 'react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import { BATCHES, PRODUCTS, ORGANIZATIONS, RECALLS, SUPPLY_CHAIN_EVENTS } from '../data/mockData';
import {
  AlertTriangle, CheckCircle, Search, Filter, Thermometer,
  QrCode, Info, MapPin, X, ShieldAlert, Clock, Users, FileText
} from 'lucide-react';

function RecallModal({ recall, onClose }) {
  const product = PRODUCTS.find(p => p.id === recall.productId);
  const batch   = BATCHES.find(b => b.id === recall.batchId);
  const pct = Math.round((recall.recoveredQty / recall.affectedQty) * 100);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-red-50 rounded-t-2xl sticky top-0">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-red-600" />
            <div>
              <h2 className="text-lg font-bold text-red-800">{recall.id}</h2>
              <p className="text-sm text-red-600">{product?.brandName} — Batch {batch?.batchNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-red-500" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-5">
          {/* Status */}
          <div className="flex items-center gap-4 flex-wrap">
            <StatusBadge status={recall.status} />
            <StatusBadge status={recall.recallClass} />
            <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" />Deadline: {recall.deadline}</span>
          </div>

          {/* Reason */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Recall Reason</div>
            <p className="text-sm text-red-800">{recall.reason}</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {[
              { label: 'Initiated By', value: recall.initiatedBy },
              { label: 'Initiated Date', value: recall.initiatedDate },
              { label: 'Affected Qty', value: `${recall.affectedQty.toLocaleString()} units` },
              { label: 'Recovered', value: `${recall.recoveredQty.toLocaleString()} units` },
              { label: 'Distribution Area', value: recall.distributionArea },
              { label: 'Consumer Notified', value: recall.consumerNotification ? 'Yes' : 'No' },
            ].map(f => (
              <div key={f.label} className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-400">{f.label}</div>
                <div className="font-semibold text-gray-800 mt-0.5">{f.value}</div>
              </div>
            ))}
          </div>

          {/* Recovery progress */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold text-gray-700">Recovery Progress</span>
              <span className="font-bold text-ppb-green">{pct}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div className="bg-ppb-green h-3 rounded-full transition-all" style={{ width: `${pct}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{recall.recoveredQty.toLocaleString()} recovered</span>
              <span>{(recall.affectedQty - recall.recoveredQty).toLocaleString()} outstanding</span>
            </div>
          </div>

          {/* Affected nodes */}
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Users className="w-3 h-3" />Affected Supply Chain Nodes</div>
            <div className="flex flex-wrap gap-2">
              {recall.affectedNodes.map(nodeId => {
                const org = ORGANIZATIONS.find(o => o.id === nodeId);
                return (
                  <span key={nodeId} className="flex items-center gap-1 text-xs bg-orange-50 border border-orange-200 text-orange-700 px-2 py-1 rounded-lg">
                    <MapPin className="w-3 h-3" />{org?.name} <span className="text-orange-400">({org?.type})</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button className="flex-1 bg-ppb-green text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-ppb-green-dark transition-colors flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />Update Recovery Qty
            </button>
            <button className="flex-1 bg-white border border-red-300 text-red-700 py-2 px-4 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />Generate Recall Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BatchManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRecall, setSelectedRecall] = useState(null);
  const [tab, setTab] = useState('batches');

  const statuses = ['All', 'Active', 'Recalled', 'Expired'];

  const filtered = BATCHES.filter(b => {
    const q = search.toLowerCase();
    const p = PRODUCTS.find(pr => pr.id === b.productId);
    const matchSearch = !q || b.batchNumber.toLowerCase().includes(q) || p?.brandName.toLowerCase().includes(q) || b.gtin.includes(q);
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <Layout
      title="Batch Management & Recalls"
      subtitle="Track batch lifecycle and manage regulatory recalls"
    >
      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl w-fit">
        {[['batches', 'All Batches'], ['recalls', 'Recalls & Alerts']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === key ? 'bg-white text-ppb-green shadow' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {label}
            {key === 'recalls' && <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{RECALLS.length}</span>}
          </button>
        ))}
      </div>

      {tab === 'batches' && (
        <>
          {/* Toolbar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap items-center gap-3 shadow-sm">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search batch number, product, GTIN…"
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ppb-green"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              {statuses.map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${statusFilter === s ? 'bg-ppb-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Product', 'Batch Number', 'GS1 Barcode', 'Mfg. Date', 'Expiry', 'Qty', 'Remaining', 'Cold Chain', 'Status', 'Recall'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(b => {
                  const product = PRODUCTS.find(p => p.id === b.productId);
                  const recall = RECALLS.find(r => r.batchId === b.id);
                  const pctUsed = b.quantity > 0 ? Math.round(((b.quantity - b.remainingQty) / b.quantity) * 100) : 100;
                  return (
                    <tr key={b.id} className={`hover:bg-gray-50 ${b.status === 'Recalled' ? 'bg-red-50/30' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900 text-sm">{product?.brandName}</div>
                        <div className="text-xs text-gray-400">{product?.strength}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs font-bold text-gray-800">{b.batchNumber}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500 max-w-[140px] truncate">{b.gs1Barcode}</td>
                      <td className="px-4 py-3 text-xs">{b.manufactureDate}</td>
                      <td className="px-4 py-3 text-xs font-medium">
                        <span className={new Date(b.expiryDate) < new Date('2026-06-01') ? 'text-orange-600' : 'text-gray-700'}>
                          {b.expiryDate}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">{b.quantity.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="text-xs font-semibold text-gray-700">{b.remainingQty.toLocaleString()}</div>
                        <div className="w-16 bg-gray-100 rounded-full h-1.5 mt-1">
                          <div className="bg-ppb-green h-1.5 rounded-full" style={{ width: `${100 - pctUsed}%` }}></div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {b.temperature ? <span className="flex items-center gap-1 text-xs text-cyan-700"><Thermometer className="w-3 h-3" />{b.temperature}</span> : <span className="text-xs text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                      <td className="px-4 py-3">
                        {recall ? (
                          <button onClick={() => setSelectedRecall(recall)} className="flex items-center gap-1 text-xs text-red-600 font-semibold hover:underline">
                            <AlertTriangle className="w-3 h-3" />{recall.id}
                          </button>
                        ) : <span className="text-xs text-gray-300">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'recalls' && (
        <div className="space-y-4">
          {/* Recall Summary */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Active Recalls', value: RECALLS.filter(r => r.status === 'In Progress').length, color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'Completed', value: RECALLS.filter(r => r.status === 'Completed').length, color: 'text-green-700', bg: 'bg-green-50' },
              { label: 'Total Affected Units', value: RECALLS.reduce((a, r) => a + r.affectedQty, 0).toLocaleString(), color: 'text-orange-600', bg: 'bg-orange-50' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-xl border border-gray-200 p-4 text-center`}>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Recall cards */}
          {RECALLS.map(recall => {
            const product = PRODUCTS.find(p => p.id === recall.productId);
            const batch = BATCHES.find(b => b.id === recall.batchId);
            const pct = Math.round((recall.recoveredQty / recall.affectedQty) * 100);
            return (
              <div key={recall.id} className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
                <div className="bg-red-50 px-5 py-3 flex items-center justify-between gap-2 flex-wrap border-b border-red-100">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="w-5 h-5 text-red-600" />
                    <div>
                      <span className="font-bold text-red-800">{recall.id}</span>
                      <span className="ml-2 text-sm text-red-600">{product?.brandName} — {product?.genericName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={recall.recallClass} />
                    <StatusBadge status={recall.status} />
                    <button onClick={() => setSelectedRecall(recall)} className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
                <div className="px-5 py-4">
                  <p className="text-sm text-gray-700 mb-4">{recall.reason}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-4">
                    <div><span className="text-gray-400">Batch</span><div className="font-mono font-bold">{batch?.batchNumber}</div></div>
                    <div><span className="text-gray-400">Initiated</span><div className="font-semibold">{recall.initiatedDate}</div></div>
                    <div><span className="text-gray-400">Deadline</span><div className="font-semibold text-orange-600">{recall.deadline}</div></div>
                    <div><span className="text-gray-400">Initiated By</span><div className="font-semibold">{recall.initiatedBy}</div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Recovery: {recall.recoveredQty.toLocaleString()} / {recall.affectedQty.toLocaleString()} units</span>
                      <span className="font-bold text-ppb-green">{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="bg-ppb-green h-2.5 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Initiate Recall CTA */}
          <div className="bg-white rounded-xl border border-dashed border-orange-300 p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-700 mb-1">Initiate a New Recall</h3>
            <p className="text-sm text-gray-400 mb-4">Instantly notify all affected supply chain nodes and generate recall documentation.</p>
            <button className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors">
              + Initiate Batch Recall
            </button>
          </div>
        </div>
      )}

      {selectedRecall && <RecallModal recall={selectedRecall} onClose={() => setSelectedRecall(null)} />}
    </Layout>
  );
}
