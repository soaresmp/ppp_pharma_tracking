import { useState } from 'react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import { BATCHES, PRODUCTS, SUPPLY_CHAIN_EVENTS, ORGANIZATIONS } from '../data/mockData';
import {
  Search, GitBranch, CheckCircle, ArrowRight, Package,
  MapPin, Calendar, FileText, Receipt, AlertTriangle, Truck
} from 'lucide-react';

const EVENT_ICONS = {
  'Import': Truck,
  'Manufacture': Package,
  'Distribution': ArrowRight,
  'Dispensed': CheckCircle,
  'Recall Initiated': AlertTriangle,
};

const EVENT_COLORS = {
  'Import': 'bg-purple-100 text-purple-700 border-purple-200',
  'Manufacture': 'bg-blue-100 text-blue-700 border-blue-200',
  'Distribution': 'bg-green-100 text-green-700 border-green-200',
  'Dispensed': 'bg-teal-100 text-teal-700 border-teal-200',
  'Recall Initiated': 'bg-red-100 text-red-700 border-red-200',
};

function TimelineEvent({ event, index, total }) {
  const fromOrg = ORGANIZATIONS.find(o => o.id === event.fromOrg);
  const toOrg   = ORGANIZATIONS.find(o => o.id === event.toOrg);
  const Icon = EVENT_ICONS[event.eventType] || ArrowRight;
  const colorCls = EVENT_COLORS[event.eventType] || 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <div className="flex gap-4">
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${colorCls}`}>
          <Icon className="w-4 h-4" />
        </div>
        {index < total - 1 && <div className="w-0.5 flex-1 bg-gray-200 my-1 min-h-6"></div>}
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${colorCls}`}>{event.eventType}</span>
              <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" />{event.date}</span>
            </div>
            <span className="font-mono text-xs text-gray-400">{event.id}</span>
          </div>

          <div className="flex items-center gap-2 text-sm mb-3 flex-wrap">
            {fromOrg ? (
              <span className="flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1 text-xs font-medium text-gray-700">
                <MapPin className="w-3 h-3 text-gray-400" />{fromOrg.name}
                <span className="text-gray-400 text-xs">({fromOrg.type})</span>
              </span>
            ) : <span className="text-xs text-gray-400 italic">Origin</span>}
            <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
            {toOrg ? (
              <span className="flex items-center gap-1 bg-ppb-green-light rounded-lg px-2 py-1 text-xs font-medium text-ppb-green">
                <MapPin className="w-3 h-3" />{toOrg.name}
                <span className="text-green-600 text-xs">({toOrg.type})</span>
              </span>
            ) : <span className="text-xs text-gray-400 italic">Quarantine</span>}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-gray-400">Quantity</div>
              <div className="font-semibold text-gray-800">{event.quantity.toLocaleString()} units</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-gray-400 flex items-center gap-1"><FileText className="w-3 h-3" />Document Ref</div>
              <div className="font-mono font-semibold text-gray-800 truncate">{event.documentRef || '—'}</div>
            </div>
            <div className={`rounded-lg p-2 ${event.etimsRef ? 'bg-blue-50' : 'bg-gray-50'}`}>
              <div className="text-gray-400 flex items-center gap-1"><Receipt className="w-3 h-3" />eTIMS Ref</div>
              <div className={`font-mono font-semibold truncate ${event.etimsRef ? 'text-blue-700' : 'text-gray-400'}`}>
                {event.etimsRef || 'Not invoiced'}
              </div>
            </div>
          </div>

          {event.notes && (
            <div className="mt-2 text-xs text-gray-500 italic border-t border-gray-100 pt-2">{event.notes}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SupplyChain() {
  const [selectedBatch, setSelectedBatch] = useState(BATCHES[0]);
  const [searchBatch, setSearchBatch] = useState('');

  const filteredBatches = BATCHES.filter(b => {
    const q = searchBatch.toLowerCase();
    if (!q) return true;
    const p = PRODUCTS.find(pr => pr.id === b.productId);
    return b.batchNumber.toLowerCase().includes(q) || p?.brandName.toLowerCase().includes(q) || b.gtin.includes(q);
  });

  const events = SUPPLY_CHAIN_EVENTS.filter(e => e.batchId === selectedBatch?.id);
  const product = PRODUCTS.find(p => p.id === selectedBatch?.productId);
  const currentOrg = ORGANIZATIONS.find(o => o.id === selectedBatch?.currentLocation);

  return (
    <Layout
      title="Supply Chain Tracker"
      subtitle="End-to-end batch traceability — from manufacturer to patient"
    >
      <div className="flex gap-5 h-full">
        {/* Left panel – batch selector */}
        <div className="w-72 flex-shrink-0 space-y-3">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={searchBatch}
                onChange={e => setSearchBatch(e.target.value)}
                placeholder="Search batch / GTIN…"
                className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ppb-green"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {filteredBatches.map(b => {
              const p = PRODUCTS.find(pr => pr.id === b.productId);
              const isSelected = selectedBatch?.id === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedBatch(b)}
                  className={`w-full text-left rounded-xl border p-3 transition-all ${isSelected ? 'border-ppb-green bg-ppb-green-light shadow' : 'border-gray-200 bg-white hover:border-gray-300 shadow-sm'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">{p?.brandName}</div>
                      <div className="font-mono text-xs text-gray-500 mt-0.5">{b.batchNumber}</div>
                      <div className="font-mono text-xs text-gray-400">{b.gtin}</div>
                    </div>
                    <StatusBadge status={b.status} size="xs" />
                  </div>
                  <div className="mt-2 text-xs text-gray-500">Exp: {b.expiryDate}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right panel – timeline */}
        <div className="flex-1 min-w-0">
          {selectedBatch ? (
            <>
              {/* Batch header */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold text-gray-900">{product?.brandName}</h2>
                      <StatusBadge status={selectedBatch.status} />
                      {selectedBatch.recallStatus && <StatusBadge status="Recalled" />}
                    </div>
                    <p className="text-sm text-gray-500">{product?.genericName} {product?.strength} · {product?.dosageForm}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Current Location</div>
                    <div className="text-sm font-semibold text-ppb-green">{currentOrg?.name || '—'}</div>
                    <div className="text-xs text-gray-400">{currentOrg?.type}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  {[
                    { label: 'Batch Number', value: selectedBatch.batchNumber, mono: true },
                    { label: 'GTIN', value: selectedBatch.gtin, mono: true },
                    { label: 'Manufactured', value: selectedBatch.manufactureDate },
                    { label: 'Expires', value: selectedBatch.expiryDate, warning: new Date(selectedBatch.expiryDate) < new Date('2026-06-01') },
                  ].map(f => (
                    <div key={f.label} className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-400">{f.label}</div>
                      <div className={`text-sm font-semibold mt-0.5 ${f.mono ? 'font-mono' : ''} ${f.warning ? 'text-orange-600' : 'text-gray-900'}`}>{f.value}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  {[
                    { label: 'Original Quantity', value: `${selectedBatch.quantity.toLocaleString()} units` },
                    { label: 'Remaining', value: `${selectedBatch.remainingQty.toLocaleString()} units` },
                    { label: 'GS1 Barcode', value: selectedBatch.gs1Barcode, mono: true },
                    { label: 'Import Permit', value: selectedBatch.importPermitNo || 'Locally produced' },
                  ].map(f => (
                    <div key={f.label} className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-400">{f.label}</div>
                      <div className={`text-sm font-semibold mt-0.5 truncate ${f.mono ? 'font-mono text-xs' : ''}`}>{f.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-5">
                  <GitBranch className="w-4 h-4 text-ppb-green" />
                  <h3 className="text-sm font-bold text-gray-800">Supply Chain Timeline</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{events.length} events</span>
                </div>

                {events.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No supply chain events recorded for this batch.</p>
                ) : (
                  <div>
                    {events.map((evt, i) => (
                      <TimelineEvent key={evt.id} event={evt} index={i} total={events.length} />
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
              Select a batch to view its supply chain journey.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
