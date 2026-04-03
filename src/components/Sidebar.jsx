import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Package, GitBranch, AlertTriangle,
  FileText, Pill, Receipt, BarChart3, ChevronRight,
  Shield, Activity
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/products', label: 'Product Registry', icon: Package },
  { to: '/supply-chain', label: 'Supply Chain', icon: GitBranch },
  { to: '/batches', label: 'Batch Management', icon: Pill },
  { to: '/recalls', label: 'Recalls', icon: AlertTriangle },
  { to: '/prescriptions', label: 'e-Prescriptions', icon: FileText },
  { to: '/ehealth', label: 'e-Health Integration', icon: Activity },
  { to: '/etims', label: 'eTIMS Integration', icon: Receipt },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-ppb-green flex flex-col flex-shrink-0">
      {/* Logo / Header */}
      <div className="px-5 py-5 border-b border-green-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-ppb-green" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">Kenya PPB</div>
            <div className="text-green-300 text-xs leading-tight">PharmaTrack System</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
              ${isActive
                ? 'bg-white text-ppb-green shadow'
                : 'text-green-100 hover:bg-green-700 hover:text-white'}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-green-700">
        <div className="text-green-400 text-xs leading-relaxed">
          <div className="font-semibold text-green-300">Pharmacy & Poisons Board</div>
          <div>© 2025 Government of Kenya</div>
          <div className="mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block"></span>
            System Online
          </div>
        </div>
      </div>
    </aside>
  );
}
