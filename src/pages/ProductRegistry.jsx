import { useState } from 'react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import { PRODUCTS, ORGANIZATIONS } from '../data/mockData';
import {
  Package, Search, Filter, QrCode, ExternalLink,
  Thermometer, ChevronDown, ChevronUp, X, CheckCircle
} from 'lucide-react';

function GS1Breakdown({ gtin }) {
  const gs1 = {
    indicator: gtin[0],
    companyPrefix: gtin.slice(1, 8),
    itemRef: gtin.slice(8, 13),
    checkDigit: gtin.slice(13),
  };
  return (
    <div className="mt-3 bg-gray-900 rounded-lg p-3 font-mono text-xs">
      <div className="text-green-400 mb-2 text-xs font-bold">GS1 GTIN-14 Breakdown</div>
      <div className="flex gap-1 mb-2 flex-wrap">
        <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded">{gs1.indicator}</span>
        <span className="bg-green-900 text-green-200 px-2 py-1 rounded">{gs1.companyPrefix}</span>
        <span className="bg-yellow-900 text-yellow-200 px-2 py-1 rounded">{gs1.itemRef}</span>
        <span className="bg-red-900 text-red-200 px-2 py-1 rounded">{gs1.checkDigit}</span>
      </div>
      <div className="space-y-1 text-gray-400">
        <div><span className="text-blue-400">■</span> Indicator: {gs1.indicator}</div>
        <div><span className="text-green-400">■</span> GS1 Company Prefix (Kenya 628): {gs1.companyPrefix}</div>
        <div><span className="text-yellow-400">■</span> Item Reference: {gs1.itemRef}</div>
        <div><span className="text-red-400">■</span> Check Digit: {gs1.checkDigit}</div>
      </div>
      <div className="mt-2 text-gray-500 text-xs">
        GS1-128 Data Matrix: (01){gtin}
      </div>
    </div>
  );
}

function ProductModal({ product, onClose }) {
  const org = ORGANIZATIONS.find(o => o.id === product.marketingAuthHolder);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{product.brandName}</h2>
            <p className="text-sm text-gray-500">{product.genericName} {product.strength}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-5">
          {/* Registration Info */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">PPB Registration</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500 text-xs">Reg. Number</span><div className="font-semibold text-ppb-green">{product.regNumber}</div></div>
              <div><span className="text-gray-500 text-xs">Status</span><div className="mt-0.5"><StatusBadge status={product.status} /></div></div>
              <div><span className="text-gray-500 text-xs">ATC Code</span><div className="font-mono text-xs mt-0.5 bg-gray-100 px-2 py-1 rounded">{product.atcCode}</div></div>
              <div><span className="text-gray-500 text-xs">Shelf Life</span><div className="font-semibold">{product.shelfLife} months</div></div>
              <div><span className="text-gray-500 text-xs">Dosage Form</span><div>{product.dosageForm}</div></div>
              <div><span className="text-gray-500 text-xs">Pack Size</span><div>{product.packSize}</div></div>
              <div className="col-span-2"><span className="text-gray-500 text-xs">Storage</span><div>{product.storageCondition}</div></div>
              <div className="col-span-2"><span className="text-gray-500 text-xs">Marketing Auth. Holder</span><div className="font-semibold">{org?.name}</div></div>
              <div className="col-span-2"><span className="text-gray-500 text-xs">Manufacturer</span><div>{product.manufacturer}</div></div>
            </div>
          </div>

          {/* GS1 Section */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">GS1 Identification</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-1">
                <QrCode className="w-5 h-5 text-ppb-green flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500">GTIN-14</div>
                  <div className="font-mono font-bold text-lg text-gray-900">{product.gtin}</div>
                </div>
              </div>
              <GS1Breakdown gtin={product.gtin} />
            </div>
            {product.requiresColdChain && (
              <div className="mt-3 flex items-center gap-2 text-sm bg-cyan-50 border border-cyan-200 rounded-lg px-3 py-2">
                <Thermometer className="w-4 h-4 text-cyan-600" />
                <span className="text-cyan-700 font-medium">Cold Chain Required — Serialisation with temperature logging mandatory</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductRegistry() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const types = ['All', 'Tablet', 'Oral suspension', 'Oral drops'];

  const filtered = PRODUCTS.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.brandName.toLowerCase().includes(q) ||
      p.genericName.toLowerCase().includes(q) ||
      p.gtin.includes(q) ||
      p.regNumber.toLowerCase().includes(q);
    const matchType = typeFilter === 'All' || p.dosageForm === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <Layout
      title="Product Registry"
      subtitle="PPB-registered medicines with GS1 GTIN identifiers"
    >
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Total Registered', value: '1,248', color: 'text-ppb-green' },
          { label: 'Locally Produced', value: '387', color: 'text-blue-600' },
          { label: 'Imported', value: '861', color: 'text-purple-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap items-center gap-3 shadow-sm">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by brand, generic, GTIN, or reg. number…"
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ppb-green"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          {types.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${typeFilter === t ? 'bg-ppb-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Brand Name', 'Generic Name', 'Strength / Form', 'GTIN', 'Reg. Number', 'Origin', 'Cold Chain', 'Status', ''].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(p => {
              const org = ORGANIZATIONS.find(o => o.id === p.marketingAuthHolder);
              return (
                <tr key={p.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(p)}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{p.brandName}</div>
                    <div className="text-xs text-gray-400">{org?.name}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{p.genericName}</td>
                  <td className="px-4 py-3">
                    <div className="text-gray-700">{p.strength}</div>
                    <div className="text-xs text-gray-400">{p.dosageForm} · {p.packSize}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{p.gtin}</td>
                  <td className="px-4 py-3 font-mono text-xs text-ppb-green font-semibold">{p.regNumber}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{p.manufacturer}</td>
                  <td className="px-4 py-3 text-center">
                    {p.requiresColdChain
                      ? <span className="inline-flex items-center gap-1 text-xs text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full"><Thermometer className="w-3 h-3" />Yes</span>
                      : <span className="text-xs text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3">
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors" onClick={e => { e.stopPropagation(); setSelected(p); }}>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No products match your search.</div>
        )}
      </div>

      {/* GS1 Info box */}
      <div className="mt-5 bg-ppb-green-light border border-ppb-green/20 rounded-xl p-4 flex gap-3">
        <QrCode className="w-5 h-5 text-ppb-green flex-shrink-0 mt-0.5" />
        <div className="text-sm text-ppb-green-dark">
          <span className="font-semibold">GS1 Kenya Compliance: </span>
          All products must carry a GTIN-14 encoded in a GS1-128 or DataMatrix barcode including
          (01) GTIN, (10) Batch/Lot, (17) Expiry Date, and (21) Serial Number for track-and-trace.
          Cold-chain products additionally require (91) internal temperature log references.
        </div>
      </div>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </Layout>
  );
}
