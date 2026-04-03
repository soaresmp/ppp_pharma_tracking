import { Bell, Search, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Header({ title, subtitle }) {
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search batch, GTIN, product…"
            className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-ppb-green focus:border-transparent"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative p-2 text-gray-500 hover:text-ppb-green hover:bg-green-50 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          {showNotif && (
            <div className="absolute right-0 top-10 w-72 bg-white shadow-xl border border-gray-200 rounded-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 font-semibold text-sm text-gray-800">Alerts</div>
              {[
                { text: 'Recall RECALL-2025-003 — Metformin batch in progress', color: 'bg-red-500', time: '2h ago' },
                { text: '3 counterfeit alerts detected in Nairobi region', color: 'bg-orange-500', time: '5h ago' },
                { text: '8 import permits pending PPB clearance', color: 'bg-yellow-500', time: '1d ago' },
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50">
                  <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.color}`}></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 leading-snug">{n.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2 text-center">
                <button className="text-xs text-ppb-green font-medium hover:underline">View all alerts</button>
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors">
          <div className="w-7 h-7 bg-ppb-green rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="text-left hidden md:block">
            <div className="text-xs font-semibold text-gray-800">PPB Inspector</div>
            <div className="text-xs text-gray-400">Regulatory Officer</div>
          </div>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </button>
      </div>
    </header>
  );
}
