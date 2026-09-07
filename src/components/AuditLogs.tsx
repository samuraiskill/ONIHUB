import React, { useState } from 'react';
import { FileText, Download, Filter, ShieldAlert, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { SecurityEventLog } from '../types';

interface AuditLogsProps {
  logs: SecurityEventLog[];
  onClearLogs: () => void;
}

export const AuditLogs: React.FC<AuditLogsProps> = ({ logs, onClearLogs }) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredLogs = logs.filter((log) => {
    if (filterCategory === 'ALL') return true;
    return log.category === filterCategory;
  });

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kasa-dojo-security-scrolls-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-105px)] bg-kasa-dojo text-white font-sans select-none overflow-y-auto p-4 md:p-6">
      <div className="max-w-5xl mx-auto w-full space-y-4">
        {/* Header Bar */}
        <div className="bg-[#0e0a07] border border-amber-900/50 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-dojo-depth">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-950 border border-amber-600/60 rounded-xl text-amber-400 shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-mono font-black text-base text-amber-400 uppercase tracking-wider flex items-center gap-2">
                巻 KasA SECURITY SCROLLS <span className="text-red-500">&amp; AUDIT LOGS</span>
              </h2>
              <p className="font-mono text-xs text-neutral-400">
                Immutable KasA Dojo event stream tracking biometric logins, firewall drops, and proxy activity.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-mono font-extrabold text-xs rounded-xl transition-all shadow-md shadow-amber-950 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>EXPORT SCROLLS</span>
            </button>

            <button
              onClick={onClearLogs}
              className="px-3.5 py-2 bg-neutral-900 hover:bg-red-950/40 border border-amber-900/50 text-neutral-400 hover:text-red-400 rounded-xl font-mono text-xs transition-colors cursor-pointer"
              title="Clear Event Stream"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-[#0c0907] border border-amber-900/50 rounded-xl p-3 flex items-center gap-2 overflow-x-auto no-scrollbar font-mono text-xs shadow-lg">
          <span className="text-amber-500 font-bold uppercase flex items-center gap-1 whitespace-nowrap">
            <Filter className="w-3.5 h-3.5 text-amber-500" />
            FILTER CATEGORY:
          </span>
          {['ALL', 'AUTHENTICATION', 'FIREWALL', 'PROXIED_BROWSER', 'AI_CORE', 'AIRLOCK', 'TELEMETRY'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                filterCategory === cat
                  ? 'bg-amber-600 text-black font-extrabold shadow-sm'
                  : 'bg-black text-neutral-400 hover:text-white border border-amber-900/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Logs Table / Stream */}
        <div className="bg-[#0c0907] border border-amber-900/50 rounded-2xl overflow-hidden font-mono text-xs shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-amber-900/40 bg-black text-neutral-400 text-[11px] uppercase">
                  <th className="py-2.5 px-3">TIMESTAMP</th>
                  <th className="py-2.5 px-3">SEVERITY</th>
                  <th className="py-2.5 px-3">CATEGORY</th>
                  <th className="py-2.5 px-3">SOURCE</th>
                  <th className="py-2.5 px-3">MESSAGE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-950/40">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-amber-950/20 transition-colors">
                    <td className="py-2.5 px-3 text-neutral-400 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {log.severity === 'BLOCKED' && (
                        <span className="px-2 py-0.5 bg-red-950 border border-red-600 text-red-400 font-extrabold rounded-md text-[10px]">
                          BLOCKED
                        </span>
                      )}
                      {log.severity === 'WARNING' && (
                        <span className="px-2 py-0.5 bg-amber-950 border border-amber-600 text-amber-400 font-bold rounded-md text-[10px]">
                          WARNING
                        </span>
                      )}
                      {log.severity === 'INFO' && (
                        <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-700 text-neutral-300 font-bold rounded-md text-[10px]">
                          INFO
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-amber-400 font-bold whitespace-nowrap">{log.category}</td>
                    <td className="py-2.5 px-3 text-white font-bold whitespace-nowrap">{log.source}</td>
                    <td className="py-2.5 px-3 text-neutral-200">{log.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
