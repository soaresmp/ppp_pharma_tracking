import { useState } from 'react';
import Layout from '../components/Layout';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
  AreaChart, Area
} from 'recharts';
import {
  BarChart3, Download, Filter, Calendar, Building,
  Package, TrendingUp, MapPin, ShieldAlert, Eye, ArrowRight
} from 'lucide-react';
import { PRODUCTS, ORGANIZATIONS, BATCHES, MONTHLY_DISTRIBUTION, PRODUCT_DISTRIBUTION_BY_REGION } from '../data/mockData';

const BRAND_DISTRIBUTION = [
  { product: 'Coartem', org: 'Novartis Kenya', nairobi: 22600, mombasa: 8200, kisumu: 6100, nakuru: 4100, eldoret: 3800, other: 5200 },
  { product: 'Augmentin', org: 'GSK Kenya', nairobi: 18750, mombasa: 6300, kisumu: 4200, nakuru: 3100, eldoret: 2800, other: 3850 },
  { product: 'DYM', org: 'Regal Pharma', nairobi: 41000, mombasa: 18000, kisumu: 15000, nakuru: 10000, eldoret: 9000, other: 7000 },
  { product: 'Metformin', org: 'Cosmos Ltd', nairobi: 28000, mombasa: 12000, kisumu: 9000, nakuru: 7500, eldoret: 6500, other: 17000 },
];

const CHANNEL_CONSUMPTION = [
  { channel: 'Hospitals', coartem: 22600, augmentin: 11250, metformin: 18000 },
  { channel: 'Pharmacies', coartem: 27400, augmentin: 18750, metformin: 42000 },
  { channel: 'Clinics', coartem: 0, augmentin: 0, metformin: 20000 },
];

const EXPIRY_RISK = [
  { month: 'Apr 2025', units: 4200, products: 3 },
  { month: 'May 2025', units: 1800, products: 2 },
  { month: 'Jun 2025', units: 6100, products: 4 },
  { month: 'Jul 2025', units: 2300, products: 2 },
  { month: 'Aug 2025', units: 900, products: 1 },
  { month: 'Sep 2025', units: 3400, products: 3 },
];

const TRACEABILITY_COVERAGE = [
  { name: 'Fully Traced (GS1)', value: 87, fill: '#006B3F' },
  { name: 'Partial', value: 9, fill: '#D4AF37' },
  { name: 'Not Traced', value: 4, fill: '#CE1126' },
];

const MONTHLY_EVENTS_DETAIL = [
  { month: 'Oct', manufacture: 320, import: 180, distribution: 620, dispensed: 120 },
  { month: 'Nov', manufacture: 410, import: 220, distribution: 790, dispensed: 160 },
  { month: 'Dec', manufacture: 280, import: 150, distribution: 740, dispensed: 180 },
  { month: 'Jan', manufacture: 450, import: 290, distribution: 820, dispensed: 160 },
  { month: 'Feb', manufacture: 520, import: 310, distribution: 890, dispensed: 180 },
  { month: 'Mar', manufacture: 580, import: 360, distribution: 1010, dispensed: 190 },
];

const REPORT_TABS = [
  { key: 'traceability', label: 'Traceability Report' },
  { key: 'brand', label: 'Brand Owner Report' },
  { key: 'expiry', label: 'Expiry & Risk Report' },
  { key: 'regulatory', label: 'Regulatory Summary' },
];

export default function Reports() {
  const [tab, setTab] = useState('traceability');
  const [selectedBrand, setSelectedBrand] = useState(BRAND_DISTRIBUTION[0]);

  return (
    <Layout
      title="Reports & Analytics"
      subtitle="Traceability, brand distribution, expiry risk and regulatory reports"
    >
      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {REPORT_TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === key ? 'bg-white text-ppb-green shadow' : 'text-gray-500 hover:text-gray-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ─────────── TRACEABILITY REPORT ─────────── */}
      {tab === 'traceability' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-800">Supply Chain Traceability Report — Q1 2025</h2>
            <button className="flex items-center gap-2 px-3 py-2 bg-ppb-green text-white text-xs font-semibold rounded-lg hover:bg-ppb-green-dark transition-colors">
              <Download className="w-3.5 h-3.5" />Export PDF
            </button>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total SC Events', value: '18,934', icon: TrendingUp, color: 'text-ppb-green' },
              { label: 'Batches Traced', value: '4,521', icon: Package, color: 'text-blue-600' },
              { label: 'Traceability Coverage', value: '87%', icon: Eye, color: 'text-teal-600' },
              { label: 'Counterfeit Detected', value: '3', icon: ShieldAlert, color: 'text-red-600' },
            ].map(kpi => (
              <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
                <kpi.icon className={`w-5 h-5 mx-auto mb-1 ${kpi.color}`} />
                <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{kpi.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Monthly SC events stacked */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-4">Monthly Events by Type</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={MONTHLY_EVENTS_DETAIL}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="manufacture" stackId="a" fill="#1a5276" name="Manufacture" />
                  <Bar dataKey="import"       stackId="a" fill="#2980b9" name="Import" />
                  <Bar dataKey="distribution" stackId="a" fill="#006B3F" name="Distribution" />
                  <Bar dataKey="dispensed"    stackId="a" fill="#D4AF37" name="Dispensed" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Traceability coverage pie */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-4">GS1 Traceability Coverage</h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={TRACEABILITY_COVERAGE} cx="50%" cy="50%" outerRadius={65} dataKey="value" label={({ name, value }) => `${value}%`} labelLine={false} fontSize={10}>
                    {TRACEABILITY_COVERAGE.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 mt-2">
                {TRACEABILITY_COVERAGE.map(e => (
                  <div key={e.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.fill }}></span><span className="text-gray-600">{e.name}</span></div>
                    <span className="font-bold text-gray-800">{e.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Regional heatmap table */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Distribution Heatmap by Region</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 pb-2 pr-4">Region</th>
                    <th className="text-left text-xs font-semibold text-gray-500 pb-2 pr-4">Units Distributed</th>
                    <th className="text-left text-xs font-semibold text-gray-500 pb-2 pr-4">Share</th>
                    <th className="text-left text-xs font-semibold text-gray-500 pb-2">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {PRODUCT_DISTRIBUTION_BY_REGION.map(r => {
                    const total = PRODUCT_DISTRIBUTION_BY_REGION.reduce((a, x) => a + x.units, 0);
                    const pct = Math.round((r.units / total) * 100);
                    return (
                      <tr key={r.region} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2 pr-4 font-medium text-gray-800 flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400" />{r.region}</td>
                        <td className="py-2 pr-4 font-semibold">{r.units.toLocaleString()}</td>
                        <td className="py-2 pr-4 text-gray-500">{pct}%</td>
                        <td className="py-2">
                          <div className="w-32 bg-gray-100 rounded-full h-2">
                            <div className="bg-ppb-green h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────── BRAND OWNER REPORT ─────────── */}
      {tab === 'brand' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-sm font-bold text-gray-800">Brand Owner Distribution Intelligence</h2>
            <button className="flex items-center gap-2 px-3 py-2 bg-ppb-green text-white text-xs font-semibold rounded-lg hover:bg-ppb-green-dark transition-colors">
              <Download className="w-3.5 h-3.5" />Export for Brand Owner
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
            <strong>Brand Owner Access:</strong> Marketing authorisation holders can log in to view where their products are distributed and consumed across Kenya — by region, supply chain node, and channel — without seeing competitor data.
          </div>

          {/* Brand selector */}
          <div className="flex flex-wrap gap-2">
            {BRAND_DISTRIBUTION.map(b => (
              <button key={b.product} onClick={() => setSelectedBrand(b)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${selectedBrand.product === b.product ? 'bg-ppb-green text-white border-ppb-green' : 'bg-white text-gray-600 border-gray-200 hover:border-ppb-green'}`}>
                {b.product}
                <span className="text-xs ml-1 opacity-70">({b.org})</span>
              </button>
            ))}
          </div>

          {selectedBrand && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Regional bar */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">{selectedBrand.product} — Units by Region</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={[
                      { region: 'Nairobi', units: selectedBrand.nairobi },
                      { region: 'Mombasa', units: selectedBrand.mombasa },
                      { region: 'Kisumu', units: selectedBrand.kisumu },
                      { region: 'Nakuru', units: selectedBrand.nakuru },
                      { region: 'Eldoret', units: selectedBrand.eldoret },
                      { region: 'Other', units: selectedBrand.other },
                    ]} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis dataKey="region" type="category" tick={{ fontSize: 11 }} width={60} />
                      <Tooltip />
                      <Bar dataKey="units" fill="#006B3F" radius={[0, 4, 4, 0]} name="Units" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Channel consumption */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Consumption by Supply Chain Channel</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={CHANNEL_CONSUMPTION}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="channel" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="coartem" fill="#006B3F" name="Coartem" />
                      <Bar dataKey="augmentin" fill="#2980b9" name="Augmentin" />
                      <Bar dataKey="metformin" fill="#D4AF37" name="Metformin" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Detail table */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-4">{selectedBrand.product} — Regional Supply Detail</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Region', 'Units Supplied', 'Share of Total', 'Volume'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-500 pb-2 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Nairobi', selectedBrand.nairobi],
                      ['Mombasa', selectedBrand.mombasa],
                      ['Kisumu', selectedBrand.kisumu],
                      ['Nakuru', selectedBrand.nakuru],
                      ['Eldoret', selectedBrand.eldoret],
                      ['Other', selectedBrand.other],
                    ].map(([region, units]) => {
                      const total = selectedBrand.nairobi + selectedBrand.mombasa + selectedBrand.kisumu + selectedBrand.nakuru + selectedBrand.eldoret + selectedBrand.other;
                      const pct = Math.round((units / total) * 100);
                      return (
                        <tr key={region} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-2 pr-4 font-medium text-gray-800">{region}</td>
                          <td className="py-2 pr-4 font-bold text-gray-900">{units.toLocaleString()}</td>
                          <td className="py-2 pr-4 text-gray-500">{pct}%</td>
                          <td className="py-2">
                            <div className="w-32 bg-gray-100 rounded-full h-2">
                              <div className="bg-ppb-green h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────── EXPIRY RISK REPORT ─────────── */}
      {tab === 'expiry' && (
        <div className="space-y-5">
          <h2 className="text-sm font-bold text-gray-800">Expiry Risk & Near-Expiry Batches</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Near-Expiry Units by Month</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={EXPIRY_RISK}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="units" stroke="#CE1126" fill="#fef2f2" strokeWidth={2} name="Units expiring" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm overflow-hidden">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Batches Expiring Within 12 Months</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Product', 'Batch', 'Expiry Date', 'Remaining Qty', 'Current Location', 'Risk'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 pb-2 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BATCHES.filter(b => {
                  const exp = new Date(b.expiryDate);
                  const now = new Date('2025-04-01');
                  const diff = (exp - now) / (1000 * 60 * 60 * 24 * 30);
                  return diff < 12 && b.remainingQty > 0;
                }).map(b => {
                  const product = PRODUCTS.find(p => p.id === b.productId);
                  const org = ORGANIZATIONS.find(o => o.id === b.currentLocation);
                  const exp = new Date(b.expiryDate);
                  const now = new Date('2025-04-01');
                  const months = Math.round((exp - now) / (1000 * 60 * 60 * 24 * 30));
                  const risk = months < 3 ? 'High' : months < 6 ? 'Medium' : 'Low';
                  const riskColors = { High: 'text-red-600 bg-red-50', Medium: 'text-orange-600 bg-orange-50', Low: 'text-yellow-600 bg-yellow-50' };
                  return (
                    <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 pr-4 font-semibold text-gray-900">{product?.brandName}</td>
                      <td className="py-2 pr-4 font-mono text-xs">{b.batchNumber}</td>
                      <td className="py-2 pr-4 text-orange-600 font-semibold">{b.expiryDate}</td>
                      <td className="py-2 pr-4">{b.remainingQty.toLocaleString()}</td>
                      <td className="py-2 pr-4 text-xs text-gray-600">{org?.name}</td>
                      <td className="py-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${riskColors[risk]}`}>{risk} ({months}m)</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────── REGULATORY SUMMARY ─────────── */}
      {tab === 'regulatory' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-800">Regulatory Compliance Summary — April 2025</h2>
            <button className="flex items-center gap-2 px-3 py-2 bg-ppb-green text-white text-xs font-semibold rounded-lg hover:bg-ppb-green-dark transition-colors">
              <Download className="w-3.5 h-3.5" />Export Report
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Products with Valid Reg.', value: '1,248', pct: '96%', color: 'green' },
              { label: 'Batches Fully GS1-Tagged', value: '3,934', pct: '87%', color: 'green' },
              { label: 'eTIMS Compliance Rate', value: '99.7%', pct: null, color: 'blue' },
              { label: 'Open Recall Actions', value: '1', pct: null, color: 'red' },
            ].map(s => (
              <div key={s.label} className={`bg-white rounded-xl border p-4 shadow-sm ${s.color === 'red' ? 'border-red-200' : 'border-gray-200'}`}>
                <div className={`text-2xl font-bold ${s.color === 'green' ? 'text-ppb-green' : s.color === 'red' ? 'text-red-600' : 'text-blue-600'}`}>{s.value}</div>
                {s.pct && <div className="text-xs text-gray-400">Coverage: {s.pct}</div>}
                <div className="text-xs text-gray-600 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Compliance Checklist</h3>
            <div className="space-y-2">
              {[
                { item: 'All imported medicines have valid PPB import permits', status: 'Pass' },
                { item: 'GS1 GTIN-14 registered for all active products', status: 'Pass' },
                { item: 'Batch serialisation (21) implemented for cold-chain products', status: 'Pass' },
                { item: 'eTIMS invoices include batch + GTIN for all pharma transactions', status: 'Pass' },
                { item: 'Recall RECALL-2025-003 recovery >85%', status: 'Pass' },
                { item: 'Zero unresolved counterfeit reports >30 days', status: 'Fail' },
                { item: 'KEMSA e-Ordering integration live', status: 'Pending' },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold ${c.status === 'Pass' ? 'bg-green-500' : c.status === 'Fail' ? 'bg-red-500' : 'bg-yellow-400'}`}>
                    {c.status === 'Pass' ? '✓' : c.status === 'Fail' ? '✗' : '!'}
                  </div>
                  <span className="text-sm text-gray-700 flex-1">{c.item}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.status === 'Pass' ? 'bg-green-100 text-green-700' : c.status === 'Fail' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{c.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
