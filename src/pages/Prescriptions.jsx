import { useState } from 'react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import { PRESCRIPTIONS, PRODUCTS, BATCHES, ORGANIZATIONS } from '../data/mockData';
import {
  FileText, User, Stethoscope, Building, Calendar,
  QrCode, CheckCircle, AlertTriangle, X, Search, Pill,
  Clock, ArrowRight, ShieldCheck
} from 'lucide-react';

function PrescriptionModal({ rx, onClose }) {
  const facility = ORGANIZATIONS.find(o => o.id === rx.facilityId);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-teal-50 border-b border-teal-100 sticky top-0 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900">{rx.id}</div>
              <div className="text-xs text-teal-600">{rx.prescriptionDate} · {facility?.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={rx.status} />
            <button onClick={onClose} className="p-2 hover:bg-teal-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Patient & Doctor */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase"><User className="w-3 h-3" />Patient</div>
              <div className="font-bold text-gray-900">{rx.patientName}</div>
              <div className="text-xs text-gray-500">ID: {rx.patientIdNo}</div>
              <div className="text-xs text-gray-400 mt-1 font-mono">{rx.patientId}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase"><Stethoscope className="w-3 h-3" />Prescribing Clinician</div>
              <div className="font-bold text-gray-900">{rx.doctorName}</div>
              <div className="text-xs text-gray-400 font-mono">{rx.doctorId}</div>
              <div className="text-xs text-gray-500 mt-1">{facility?.name}</div>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase mb-1"><Stethoscope className="w-3 h-3" />Diagnosis</div>
            <div className="font-semibold text-gray-900">{rx.diagnosis}</div>
            <div className="font-mono text-xs text-blue-600 mt-0.5">ICD-10: {rx.icdCode}</div>
          </div>

          {/* Prescribed Items */}
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Prescribed Medicines</div>
            {rx.items.map((item, i) => {
              const product = PRODUCTS.find(p => p.id === item.productId);
              const batch = BATCHES.find(b => b.id === item.batchId);
              const dispOrg = ORGANIZATIONS.find(o => o.id === item.dispensedBy);
              const isRecalled = batch?.status === 'Recalled';
              return (
                <div key={i} className={`bg-white border rounded-xl p-4 mb-3 ${isRecalled ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                  {isRecalled && (
                    <div className="flex items-center gap-2 text-xs text-red-700 bg-red-100 rounded-lg px-3 py-2 mb-3">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <strong>RECALL ALERT:</strong> This batch has been recalled. Do not dispense.
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Pill className="w-4 h-4 text-teal-600" />
                      <div>
                        <div className="font-bold text-gray-900">{product?.brandName}</div>
                        <div className="text-xs text-gray-500">{product?.genericName} {product?.strength}</div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-semibold">{item.quantity} {item.unit}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {item.batchNumber ? (
                      <>
                        <div className="bg-orange-50 border border-orange-100 rounded-lg p-2">
                          <div className="text-orange-500 font-bold flex items-center gap-1"><QrCode className="w-3 h-3" />Batch Dispensed</div>
                          <div className="font-mono text-gray-800">{item.batchNumber}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <div className="text-gray-400 font-bold">Dispensed By</div>
                          <div className="text-gray-800">{dispOrg?.name || '—'}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <div className="text-gray-400 font-bold">Dispensed Date</div>
                          <div className="text-gray-800">{item.dispensedDate}</div>
                        </div>
                        <div className="bg-green-50 border border-green-100 rounded-lg p-2">
                          <div className="text-green-600 font-bold flex items-center gap-1"><ShieldCheck className="w-3 h-3" />PPB Verified</div>
                          <div className="text-green-700">Batch on traceability ledger</div>
                        </div>
                      </>
                    ) : (
                      <div className="col-span-2 bg-yellow-50 rounded-lg p-2 text-yellow-700">Awaiting dispensing</div>
                    )}
                    {item.notes && (
                      <div className="col-span-2 text-red-700 font-semibold">{item.notes}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Prescriptions() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('prescriptions');
  const [selected, setSelected] = useState(null);

  const filtered = PRESCRIPTIONS.filter(rx => {
    const q = search.toLowerCase();
    return !q || rx.id.toLowerCase().includes(q) || rx.patientName.toLowerCase().includes(q) ||
      rx.doctorName.toLowerCase().includes(q);
  });

  return (
    <Layout
      title="e-Prescriptions"
      subtitle="Digital prescriptions linked to PPB batch traceability — integrated with e-Health systems"
    >
      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl w-fit">
        {[['prescriptions', 'Prescriptions'], ['workflow', 'e-Health Workflow']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === key ? 'bg-white text-ppb-green shadow' : 'text-gray-500 hover:text-gray-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'prescriptions' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-5">
            {[
              { label: 'Total This Month', value: '5,672', color: 'text-teal-700' },
              { label: 'Dispensed', value: '5,401', color: 'text-green-700' },
              { label: 'Pending', value: '271', color: 'text-yellow-700' },
              { label: 'Flagged (Recall)', value: '12', color: 'text-red-700' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by Rx ID, patient, doctor…"
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ppb-green"
              />
            </div>
          </div>

          {/* Prescriptions list */}
          <div className="space-y-3">
            {filtered.map(rx => {
              const facility = ORGANIZATIONS.find(o => o.id === rx.facilityId);
              const hasRecalledItem = rx.items.some(item => {
                const b = BATCHES.find(ba => ba.id === item.batchId);
                return b?.status === 'Recalled';
              });
              return (
                <div key={rx.id} className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow cursor-pointer ${hasRecalledItem ? 'border-red-300' : 'border-gray-200'}`}
                  onClick={() => setSelected(rx)}>
                  <div className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                      <div className="flex items-center gap-3">
                        {hasRecalledItem && <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{rx.id}</div>
                          <div className="text-xs text-gray-400">{rx.prescriptionDate}</div>
                        </div>
                      </div>
                      <StatusBadge status={rx.status} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-600"><User className="w-3 h-3 text-gray-400" />{rx.patientName}</div>
                      <div className="flex items-center gap-1.5 text-gray-600"><Stethoscope className="w-3 h-3 text-gray-400" />{rx.doctorName}</div>
                      <div className="flex items-center gap-1.5 text-gray-600"><Building className="w-3 h-3 text-gray-400" />{facility?.name}</div>
                      <div className="flex items-center gap-1.5 text-gray-600"><Pill className="w-3 h-3 text-gray-400" />{rx.items.length} item{rx.items.length > 1 ? 's' : ''}</div>
                    </div>
                    {/* Batch chips */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {rx.items.map((item, i) => {
                        const product = PRODUCTS.find(p => p.id === item.productId);
                        const b = BATCHES.find(ba => ba.id === item.batchId);
                        const isRecalled = b?.status === 'Recalled';
                        return (
                          <span key={i} className={`text-xs rounded-lg px-2 py-1 flex items-center gap-1 ${isRecalled ? 'bg-red-100 text-red-700 border border-red-200' : item.batchNumber ? 'bg-orange-50 text-orange-700 border border-orange-100' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
                            <QrCode className="w-3 h-3" />
                            {product?.brandName}
                            {item.batchNumber ? <span className="font-mono font-semibold">· {item.batchNumber}</span> : <span className="italic text-gray-400">no batch</span>}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === 'workflow' && (
        <div className="space-y-5">
          {/* Workflow diagram */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-800 mb-5">e-Prescription & e-Health Integration Flow</h3>
            <div className="space-y-4">
              {[
                { step: '1', actor: 'Clinician (e-Health System)', action: 'Writes digital prescription with ICD-10 diagnosis code. Prescriptions signed with digital certificate.', icon: Stethoscope, color: 'bg-blue-100 text-blue-700 border-blue-200', actors: 'Doctor / NHIF Provider' },
                { step: '2', actor: 'e-Health / HIS', action: 'Prescription transmitted to NHIF e-Health hub. Patient identity verified via Huduma Number / NHIF ID.', icon: ShieldCheck, color: 'bg-purple-100 text-purple-700 border-purple-200', actors: 'MOH e-Health / NHIF' },
                { step: '3', actor: 'Pharmacy / Dispensary', action: 'Pharmacist scans GS1 barcode on pack. System matches GTIN + batch to active prescription. Batch recorded on PPB ledger.', icon: QrCode, color: 'bg-orange-100 text-orange-700 border-orange-200', actors: 'Pharmacist' },
                { step: '4', actor: 'PPB PharmaTrack', action: 'Dispensing event recorded. Batch inventory updated. Recall check performed against batch. eTIMS invoice generated.', icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-200', actors: 'PPB System' },
                { step: '5', actor: 'Patient / NHIF', action: 'Patient receives medicines. NHIF claim automatically submitted with batch proof. End-to-end traceability complete.', icon: User, color: 'bg-teal-100 text-teal-700 border-teal-200', actors: 'Patient / NHIF' },
              ].map((s, i, arr) => (
                <div key={s.step} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${s.color}`}>
                      <s.icon className="w-4 h-4" />
                    </div>
                    {i < arr.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 my-1 min-h-4"></div>}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 text-sm">{s.actor}</span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{s.actors}</span>
                    </div>
                    <p className="text-sm text-gray-600">{s.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Systems */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Connected e-Health Systems</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { name: 'DHIS2 (MOH)', desc: 'Health facility reporting', status: 'Connected', color: 'border-green-200 bg-green-50' },
                { name: 'NHIF e-Claims', desc: 'Insurance claim integration', status: 'Connected', color: 'border-green-200 bg-green-50' },
                { name: 'KenyaEMR / OpenMRS', desc: 'Electronic medical records', status: 'Connected', color: 'border-green-200 bg-green-50' },
                { name: 'eCitizen / Huduma', desc: 'Patient identity verification', status: 'Connected', color: 'border-green-200 bg-green-50' },
                { name: 'KRA eTIMS', desc: 'Fiscal invoice validation', status: 'Connected', color: 'border-green-200 bg-green-50' },
                { name: 'KEMSA e-Ordering', desc: 'Public sector procurement', status: 'Pending', color: 'border-yellow-200 bg-yellow-50' },
              ].map(sys => (
                <div key={sys.name} className={`rounded-xl border p-4 ${sys.color}`}>
                  <div className="font-bold text-gray-900 text-sm">{sys.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{sys.desc}</div>
                  <div className="mt-2"><StatusBadge status={sys.status} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selected && <PrescriptionModal rx={selected} onClose={() => setSelected(null)} />}
    </Layout>
  );
}
