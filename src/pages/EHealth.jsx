import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import { Activity, Database, Wifi, ShieldCheck, RefreshCw, ArrowRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const INTEGRATIONS = [
  {
    system: 'MOH DHIS2',
    description: 'Aggregate medicine consumption data pushed to DHIS2 dashboards for national health planning and supply forecasting.',
    endpoint: 'https://dhis2.health.go.ke/api/pharmatrack',
    status: 'Connected',
    lastSync: '2025-04-03 06:00',
    dataPoints: ['Consumption by facility', 'Stock levels', 'Expiry alerts', 'Cold chain status'],
  },
  {
    system: 'KenyaEMR / OpenMRS',
    description: 'Bi-directional integration: prescriptions pull from OpenMRS, dispensing events push batch traceability back to the EMR.',
    endpoint: 'https://emr.kenyahmis.org/openmrs/ws/rest/v1',
    status: 'Connected',
    lastSync: '2025-04-03 07:15',
    dataPoints: ['Patient prescriptions', 'Dispensing records', 'Medication history', 'Batch linkage'],
  },
  {
    system: 'NHIF e-Claims',
    description: 'Claims submitted automatically include batch number and GTIN as proof of dispensing, reducing fraud and overprescribing.',
    endpoint: 'https://eclaims.nhif.or.ke/api/v2',
    status: 'Connected',
    lastSync: '2025-04-03 07:30',
    dataPoints: ['Claim submission with batch proof', 'Reimbursement validation', 'Fraud detection'],
  },
  {
    system: 'eCitizen / Huduma Namba',
    description: 'Patient identity verification via national ID. Links prescriptions to a verified individual to prevent prescription fraud.',
    endpoint: 'https://api.ecitizen.go.ke/identity/v1',
    status: 'Connected',
    lastSync: '2025-04-03 07:00',
    dataPoints: ['Identity verification', 'Huduma Namba lookup', 'Biometric confirmation (future)'],
  },
  {
    system: 'KRA eTIMS',
    description: 'All pharmaceutical transactions generate eTIMS invoices with batch numbers, creating a combined fiscal and regulatory trail.',
    endpoint: 'https://etims-api.kra.go.ke/v1/invoices',
    status: 'Connected',
    lastSync: '2025-04-03 07:45',
    dataPoints: ['Invoice validation', 'Batch number in fiscal record', 'VAT traceability'],
  },
  {
    system: 'KEMSA e-Ordering',
    description: 'Integration with Kenya Medical Supplies Agency for public sector procurement tracking from KEMSA to facilities.',
    endpoint: 'https://ordering.kemsa.go.ke/api',
    status: 'Pending',
    lastSync: 'Not synced',
    dataPoints: ['Purchase orders', 'Delivery confirmation', 'Public sector batch tracking'],
  },
];

const API_EVENTS = [
  { time: '07:45:12', system: 'KRA eTIMS', event: 'Invoice KRA-ETI-2025-040301 validated', type: 'success' },
  { time: '07:30:08', system: 'NHIF e-Claims', event: 'Claim CLM-2025-5821 submitted with batch A241105', type: 'success' },
  { time: '07:15:45', system: 'KenyaEMR', event: 'Prescription RX-2025-001004 synced from KNH', type: 'success' },
  { time: '07:00:22', system: 'eCitizen', event: 'Patient PT-KE-001005 identity verified', type: 'success' },
  { time: '06:50:01', system: 'KenyaEMR', event: 'Dispensing event for RX-2025-001002 pushed back', type: 'success' },
  { time: '06:32:19', system: 'KEMSA e-Ordering', event: 'Connection timeout — retrying', type: 'warning' },
  { time: '06:00:00', system: 'MOH DHIS2', event: 'Daily consumption data batch synced (1,248 records)', type: 'success' },
];

export default function EHealth() {
  return (
    <Layout
      title="e-Health Integration"
      subtitle="PPB PharmaTrack connections to Kenya's digital health ecosystem"
    >
      {/* Architecture overview */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-5">
        <h3 className="text-sm font-bold text-gray-800 mb-4">Integration Architecture</h3>
        <div className="flex flex-wrap items-center justify-center gap-3 py-2">
          {/* Center: PPB */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-ppb-green rounded-2xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <div className="mt-2 text-xs font-bold text-ppb-green text-center">PPB<br/>PharmaTrack</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {INTEGRATIONS.map(intg => (
              <div key={intg.system} className={`rounded-xl border px-3 py-2 text-center flex flex-col items-center gap-1 ${intg.status === 'Connected' ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
                <div className={`w-2 h-2 rounded-full ${intg.status === 'Connected' ? 'bg-green-500' : 'bg-yellow-400'}`}></div>
                <div className="text-xs font-bold text-gray-800">{intg.system}</div>
                <StatusBadge status={intg.status} size="xs" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Integration cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {INTEGRATIONS.map(intg => (
          <div key={intg.system} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className={`px-5 py-3 border-b flex items-center justify-between ${intg.status === 'Connected' ? 'bg-green-50 border-green-100' : 'bg-yellow-50 border-yellow-100'}`}>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-gray-600" />
                <span className="font-bold text-gray-900 text-sm">{intg.system}</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={intg.status} size="xs" />
                {intg.status === 'Connected' && <RefreshCw className="w-3 h-3 text-green-600" />}
              </div>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-gray-600 mb-3">{intg.description}</p>
              <div className="font-mono text-xs text-gray-400 bg-gray-50 rounded px-2 py-1 mb-3 truncate">{intg.endpoint}</div>
              <div className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                <Clock className="w-3 h-3" />Last sync: {intg.lastSync}
              </div>
              <div className="flex flex-wrap gap-1">
                {intg.dataPoints.map(dp => (
                  <span key={dp} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{dp}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live API log */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-ppb-green" />
            <span className="font-bold text-sm text-gray-800">Live Integration Events</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block"></span>
            Live
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {API_EVENTS.map((evt, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-2.5 hover:bg-gray-50">
              <span className="font-mono text-xs text-gray-400 flex-shrink-0">{evt.time}</span>
              {evt.type === 'success'
                ? <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                : <AlertCircle className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />}
              <span className="text-xs font-semibold text-gray-500 w-28 flex-shrink-0">{evt.system}</span>
              <span className="text-xs text-gray-700 flex-1">{evt.event}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
