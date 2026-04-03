import { useState } from 'react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import { ETIMS_INVOICES, ORGANIZATIONS, PRODUCTS, BATCHES } from '../data/mockData';
import {
  Receipt, CheckCircle, Search, ExternalLink, QrCode,
  Building, ArrowRight, Calendar, AlertCircle, X, Download,
  ShieldCheck, Barcode, Package
} from 'lucide-react';

function InvoiceModal({ invoice, onClose }) {
  const seller = ORGANIZATIONS.find(o => o.id === invoice.seller.id);
  const buyer  = ORGANIZATIONS.find(o => o.id === invoice.buyer.id);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-blue-50 border-b border-blue-100 sticky top-0 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">{invoice.invoiceNumber}</div>
              <div className="text-xs text-blue-600 font-mono">{invoice.id}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={invoice.status} />
            <button onClick={onClose} className="p-2 hover:bg-blue-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* KRA Validation Banner */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-semibold text-green-800">KRA eTIMS Validated — </span>
              <span className="text-green-700">This invoice has been validated by Kenya Revenue Authority. Medicines in this invoice are traceable on the PPB supply chain ledger.</span>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-4">
            {[['Seller', invoice.seller, seller], ['Buyer', invoice.buyer, buyer]].map(([role, party, org]) => (
              <div key={role} className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs text-gray-400 font-bold uppercase mb-2">{role}</div>
                <div className="font-semibold text-gray-900 text-sm">{party.name}</div>
                <div className="text-xs text-gray-500">{org?.type}</div>
                <div className="font-mono text-xs text-ppb-green mt-1">{party.kraPin}</div>
                <div className="font-mono text-xs text-gray-400">GLN: {org?.gln}</div>
              </div>
            ))}
          </div>

          {/* Invoice details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'Invoice Date', value: invoice.invoiceDate },
              { label: 'Currency', value: invoice.currency },
              { label: 'Subtotal', value: `KES ${invoice.subtotal.toLocaleString()}` },
              { label: 'VAT (12%)', value: `KES ${invoice.vat.toLocaleString()}` },
            ].map(f => (
              <div key={f.label} className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-400">{f.label}</div>
                <div className="font-semibold text-gray-800">{f.value}</div>
              </div>
            ))}
          </div>
          <div className="bg-ppb-green rounded-xl p-4 flex justify-between items-center">
            <span className="text-white font-bold">Total Invoice Amount</span>
            <span className="text-white font-bold text-xl">KES {invoice.total.toLocaleString()}</span>
          </div>

          {/* Line items with batch traceability */}
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Line Items — Medicines with Batch Traceability</div>
            {invoice.lineItems.map((item, i) => {
              const product = PRODUCTS.find(p => p.id === item.productId);
              const batch = BATCHES.find(b => b.batchNumber === item.batchNumber);
              return (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-ppb-green" />
                      <span className="font-semibold text-gray-900">{product?.brandName}</span>
                      <span className="text-xs text-gray-400">{product?.genericName} {product?.strength}</span>
                    </div>
                    <span className="font-bold text-gray-900">KES {item.total.toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
                      <div className="text-blue-500 font-bold flex items-center gap-1"><Barcode className="w-3 h-3" />GTIN</div>
                      <div className="font-mono text-gray-800 mt-0.5">{item.gtin}</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-2 border border-orange-100">
                      <div className="text-orange-500 font-bold">Batch Number</div>
                      <div className="font-mono text-gray-800 mt-0.5">{item.batchNumber}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-gray-400 font-bold">Expiry Date</div>
                      <div className="font-mono text-gray-800 mt-0.5">{item.expiryDate}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-gray-400 font-bold">Qty · Unit Price</div>
                      <div className="text-gray-800 mt-0.5">{item.qty.toLocaleString()} × KES {item.unitPrice}</div>
                    </div>
                  </div>
                  {batch && (
                    <div className="flex items-center gap-2 text-xs text-ppb-green bg-ppb-green-light rounded-lg px-3 py-2">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      Batch verified on PPB traceability ledger — GS1: {batch.gs1Barcode}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Download */}
          <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />Download eTIMS Invoice (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ETIMs() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = ETIMS_INVOICES.filter(inv => {
    const q = search.toLowerCase();
    return !q || inv.invoiceNumber.toLowerCase().includes(q) || inv.id.toLowerCase().includes(q) ||
      inv.seller.name.toLowerCase().includes(q) || inv.buyer.name.toLowerCase().includes(q) ||
      inv.lineItems.some(li => li.batchNumber.toLowerCase().includes(q));
  });

  return (
    <Layout
      title="eTIMS Integration"
      subtitle="Kenya Revenue Authority Electronic Tax Invoice Management — batch-level medicine traceability in fiscal invoices"
    >
      {/* Explainer */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <span className="font-bold">eTIMS × PPB Integration: </span>
          Every pharmaceutical invoice submitted to KRA eTIMS must include the
          <span className="font-semibold"> GTIN (01)</span>, <span className="font-semibold">Batch/Lot Number (10)</span>,
          and <span className="font-semibold">Expiry Date (17) </span>
          of each medicine line item. This creates a dual fiscal + regulatory audit trail and enables automatic
          supply chain event recording on the PPB traceability ledger.
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Invoices This Month', value: '14,230', color: 'text-blue-700' },
          { label: 'Validated', value: '14,186', color: 'text-green-700' },
          { label: 'Pending', value: '44', color: 'text-yellow-700' },
          { label: 'Flagged', value: '3', color: 'text-red-700' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex items-center gap-3 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search invoice, eTIMS ref, batch, seller…"
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ppb-green"
          />
        </div>
      </div>

      {/* Invoice List */}
      <div className="space-y-3">
        {filtered.map(invoice => {
          const seller = ORGANIZATIONS.find(o => o.id === invoice.seller.id);
          const buyer  = ORGANIZATIONS.find(o => o.id === invoice.buyer.id);
          return (
            <div key={invoice.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelected(invoice)}>
              <div className="px-5 py-4">
                <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Receipt className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{invoice.invoiceNumber}</div>
                      <div className="font-mono text-xs text-blue-600">{invoice.id}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" />{invoice.invoiceDate}</span>
                    <StatusBadge status={invoice.status} />
                    <span className="font-bold text-gray-900">KES {invoice.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Parties */}
                <div className="flex items-center gap-3 text-sm mb-3">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-700 font-medium">{invoice.seller.name}</span>
                    <span className="text-xs text-gray-400">({seller?.type})</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-blue-700 font-medium">{invoice.buyer.name}</span>
                    <span className="text-xs text-gray-400">({buyer?.type})</span>
                  </div>
                </div>

                {/* Batch items */}
                <div className="flex flex-wrap gap-2">
                  {invoice.lineItems.map((item, i) => {
                    const p = PRODUCTS.find(pr => pr.id === item.productId);
                    return (
                      <div key={i} className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5 text-xs">
                        <QrCode className="w-3 h-3 text-orange-500" />
                        <span className="font-semibold text-orange-700">{p?.brandName}</span>
                        <span className="text-orange-500">Batch: <span className="font-mono font-bold">{item.batchNumber}</span></span>
                        <span className="text-gray-400">Exp: {item.expiryDate}</span>
                        <span className="text-gray-500">× {item.qty.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* eTIMS Flow Diagram */}
      <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-4">eTIMS–PPB Integration Flow</h3>
        <div className="flex items-center justify-between gap-2 overflow-x-auto">
          {[
            { step: '1', label: 'Sale / Distribution', desc: 'Supplier creates invoice with batch numbers', icon: Receipt, color: 'bg-blue-100 text-blue-700' },
            { step: '2', label: 'eTIMS Submission', desc: 'Invoice submitted to KRA eTIMS API', icon: ShieldCheck, color: 'bg-purple-100 text-purple-700' },
            { step: '3', label: 'KRA Validation', desc: 'KRA validates & returns eTIMS reference', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
            { step: '4', label: 'PPB Sync', desc: 'Batch movement auto-recorded on PPB ledger', icon: Package, color: 'bg-orange-100 text-orange-700' },
            { step: '5', label: 'Full Traceability', desc: 'End-to-end audit trail complete', icon: QrCode, color: 'bg-teal-100 text-teal-700' },
          ].map((s, i, arr) => (
            <div key={s.step} className="flex items-center gap-2 flex-shrink-0">
              <div className="text-center w-32">
                <div className={`w-10 h-10 rounded-full ${s.color} flex items-center justify-center mx-auto mb-2`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-gray-800">{s.label}</div>
                <div className="text-xs text-gray-400 mt-0.5 leading-tight">{s.desc}</div>
              </div>
              {i < arr.length - 1 && <ArrowRight className="w-5 h-5 text-gray-300 flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {selected && <InvoiceModal invoice={selected} onClose={() => setSelected(null)} />}
    </Layout>
  );
}
