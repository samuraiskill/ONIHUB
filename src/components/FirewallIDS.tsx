import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Flame, Radio, Ban, Plus, Trash2, AlertOctagon, Activity, Volume2, VolumeX, Lock } from 'lucide-react';
import { FirewallRule, NetworkPacket } from '../types';
import { audioEngine } from '../utils/audioAlarm';

interface FirewallIDSProps {
  firewallRules: FirewallRule[];
  onAddRule: (rule: { ipPattern: string; action: 'BLOCK' | 'QUARANTINE'; reason: string }) => void;
  onRemoveRule: (id: string) => void;
  onAddLog: (category: any, severity: any, source: string, message: string) => void;
  onTriggerAirlock: () => void;
}

export const FirewallIDS: React.FC<FirewallIDSProps> = ({
  firewallRules,
  onAddRule,
  onRemoveRule,
  onAddLog,
  onTriggerAirlock,
}) => {
  const [newIpInput, setNewIpInput] = useState('');
  const [newReasonInput, setNewReasonInput] = useState('');
  const [isSirenActive, setIsSirenActive] = useState(false);

  // Telemetry Blocker & Full System Scan States
  const [isTelemetryBlocked, setIsTelemetryBlocked] = useState(true);
  const [isScanningSystem, setIsScanningSystem] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [scanResults, setScanResults] = useState<Array<{ label: string; status: 'SAFE' | 'BLOCKED' | 'PASS' }>>([
    { label: 'TELEMETRY BEACONS & OUTBOUND TRACKERS', status: 'BLOCKED' },
    { label: 'MEMORY PROCESS ISOLATE & KasA SHIELD', status: 'SAFE' },
    { label: 'ENCRYPTED TLS 1.3 PROXY TUNNEL', status: 'PASS' },
    { label: 'LOCAL BROWSER SANDBOX & ZERO-LEAK STORAGE', status: 'SAFE' },
  ]);

  const handleRunSystemScan = () => {
    setIsScanningSystem(true);
    setScanStep('INITIATING KasA DOJO FULL SYSTEM INTEGRITY & TELEMETRY SCAN...');
    onAddLog('SECURITY_SCAN', 'INFO', 'SYSTEM_DIAGNOSTICS', 'Started KasA full system deep scan & telemetry audit.');

    const steps = [
      'Scanning local process memory & JS isolation...',
      'Auditing network sockets & proxy headers...',
      'Inspecting browser storage for rogue telemetry trackers...',
      'Verifying Zero-Telemetry KasA Shield and airlock barriers...',
      'FULL DOJO SCAN COMPLETE: 0 TELEMETRY THREATS DETECTED.',
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setScanStep(steps[i]);
        i++;
      } else {
        clearInterval(interval);
        setIsScanningSystem(false);
        setScanResults([
          { label: 'TELEMETRY BEACONS & OUTBOUND TRACKERS', status: 'BLOCKED' },
          { label: 'MEMORY PROCESS ISOLATE & KasA SHIELD', status: 'SAFE' },
          { label: 'ENCRYPTED TLS 1.3 PROXY TUNNEL', status: 'PASS' },
          { label: 'LOCAL BROWSER SANDBOX & ZERO-LEAK STORAGE', status: 'SAFE' },
          { label: 'SYSTEM INTEGRITY DEEP AUDIT', status: 'SAFE' },
        ]);
        onAddLog('SECURITY_SCAN', 'INFO', 'SYSTEM_DIAGNOSTICS', 'Full system scan completed. All telemetry blocked.');
      }
    }, 800);
  };

  // Live Packet Monitor Simulation Stream
  const [packets, setPackets] = useState<NetworkPacket[]>([
    {
      id: 'p-1',
      timestamp: new Date().toLocaleTimeString(),
      sourceIP: '185.220.101.5',
      destPort: 443,
      protocol: 'HTTPS',
      payloadSummary: 'TLS Handshake [ChaCha20-Poly1305] Cleared',
      threatScore: 5,
      status: 'CLEARED',
    },
    {
      id: 'p-2',
      timestamp: new Date().toLocaleTimeString(),
      sourceIP: '192.168.1.104',
      destPort: 22,
      protocol: 'TCP',
      payloadSummary: 'SSH Auth Probe - KasA Proxy Active',
      threatScore: 25,
      status: 'CLEARED',
    },
    {
      id: 'p-3',
      timestamp: new Date().toLocaleTimeString(),
      sourceIP: '45.142.214.18',
      destPort: 8080,
      protocol: 'HTTP',
      payloadSummary: 'Rogue Port Scan: SYN Stealth Probe Blocked',
      threatScore: 92,
      status: 'BLOCKED',
    },
  ]);

  // Simulate incoming live background traffic every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const suspiciousIPs = ['185.220.101.88', '45.154.255.12', '198.51.100.42', '103.21.244.1', '192.168.1.50'];
      const randomIP = suspiciousIPs[Math.floor(Math.random() * suspiciousIPs.length)];
      const ports = [80, 443, 22, 3389, 8080, 9050];
      const randomPort = ports[Math.floor(Math.random() * ports.length)];
      const isHighThreat = Math.random() < 0.35;

      const newPacket: NetworkPacket = {
        id: 'p-' + Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        sourceIP: randomIP,
        destPort: randomPort,
        protocol: randomPort === 443 ? 'HTTPS' : 'TCP',
        payloadSummary: isHighThreat
          ? `Rogue probe on port ${randomPort} - Payload Neutralized`
          : `KasA Proxy Handshake - Sanitized Route`,
        threatScore: isHighThreat ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 20),
        status: isHighThreat ? 'BLOCKED' : 'CLEARED',
      };

      setPackets((prev) => [newPacket, ...prev.slice(0, 19)]);

      if (isHighThreat) {
        onAddLog('FIREWALL', 'BLOCKED', 'ACTIVE_TORII_GATE', `AUTO-BLOCKED Intrusion Attempt from ${randomIP}:${randomPort}`);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleManualAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIpInput.trim()) return;

    onAddRule({
      ipPattern: newIpInput.trim(),
      action: 'BLOCK',
      reason: newReasonInput.trim() || 'Manual KasA Admin Block',
    });

    onAddLog('FIREWALL', 'WARNING', 'FIREWALL_ADMIN', `Added Rule: BLOCK ${newIpInput.trim()}`);
    setNewIpInput('');
    setNewReasonInput('');
  };

  const handleToggleSiren = () => {
    if (isSirenActive) {
      audioEngine.stopAlarm();
      setIsSirenActive(false);
    } else {
      audioEngine.startBreachAlarm();
      setIsSirenActive(true);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-105px)] bg-kasa-dojo text-white font-sans select-none overflow-y-auto">
      {/* Firewall Header & Intrusion Siren Controls */}
      <div className="bg-[#0e0a07] border-b border-amber-900/50 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-dojo-depth">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-950 border border-amber-600/60 rounded-xl text-amber-400 shadow-md">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-mono font-extrabold text-sm tracking-wider uppercase text-amber-400 flex items-center gap-2">
              門 KasA TORII <span className="text-red-500">FIREWALL &amp; IDS SHIELD</span>
            </h2>
            <p className="text-[11px] font-mono text-neutral-400">Automated Threat Mitigation • Torii Gate Rogue IP Drop • Traffic Telemetry</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Siren Alarm Toggle */}
          <button
            onClick={handleToggleSiren}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
              isSirenActive
                ? 'bg-red-600 text-white animate-bounce shadow-lg shadow-red-900'
                : 'bg-neutral-900 hover:bg-neutral-800 border border-amber-900/50 text-neutral-300'
            }`}
          >
            {isSirenActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            <span>SIREN ALARM: {isSirenActive ? 'ACTIVE' : 'READY'}</span>
          </button>

          {/* Emergency Airlock Lock */}
          <button
            onClick={onTriggerAirlock}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-300 hover:text-white rounded-xl font-mono text-xs font-bold transition-all shadow-md"
          >
            <Lock className="w-4 h-4 text-red-500" />
            <span>FORCE DOJO AIRLOCK</span>
          </button>
        </div>
      </div>

      {/* Telemetry Blocker & Full System Deep Scanner Panel */}
      <div className="mx-4 mt-4 bg-[#0c0907] border-2 border-amber-600/60 rounded-2xl p-4 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-900/40 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-950 border border-amber-500 rounded-xl text-amber-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-mono font-black text-sm text-amber-400 uppercase tracking-wider flex items-center gap-2">
                侍 SHOGUN <span className="text-red-500">TELEMETRY BLOCKER &amp; DEEP SCANNER</span>
              </h3>
              <p className="font-mono text-[11px] text-neutral-400">
                Zero-Leak Isolation Protocol • Outbound Telemetry Suppression • Dojo Diagnostics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Telemetry Shield Toggle */}
            <button
              onClick={() => {
                const next = !isTelemetryBlocked;
                setIsTelemetryBlocked(next);
                onAddLog('TELEMETRY', next ? 'BLOCKED' : 'WARNING', 'TELEMETRY_SHIELD', `Telemetry Blocker set to ${next ? 'STRICT BLOCK' : 'PASSIVE'}`);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                isTelemetryBlocked
                  ? 'bg-emerald-950 border border-emerald-500 text-emerald-400 glow-green'
                  : 'bg-red-950 border border-red-600 text-red-400 glow-red'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>TELEMETRY SHIELD: {isTelemetryBlocked ? '遮蔽 STRICT ACTIVE (SAFE)' : 'PASSTHROUGH'}</span>
            </button>

            {/* Run Full System Scan Button */}
            <button
              onClick={handleRunSystemScan}
              disabled={isScanningSystem}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-mono font-extrabold text-xs rounded-xl transition-all shadow-md shadow-amber-950 cursor-pointer"
            >
              <Activity className={`w-4 h-4 ${isScanningSystem ? 'animate-spin' : ''}`} />
              <span>{isScanningSystem ? 'SCANNING SYSTEM...' : 'RUN FULL DOJO DEEP SCAN'}</span>
            </button>
          </div>
        </div>

        {/* Scan Progress or Active Status */}
        {isScanningSystem && (
          <div className="bg-black border border-amber-800 p-3 rounded-xl font-mono text-xs text-amber-400 animate-pulse mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>{scanStep}</span>
          </div>
        )}

        {/* System Scan Audit Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {scanResults.map((item, idx) => (
            <div key={idx} className="bg-[#060504] border border-amber-900/40 p-2.5 rounded-xl flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-300 text-[11px] truncate mr-2">{item.label}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-extrabold shrink-0 ${
                  item.status === 'BLOCKED' || item.status === 'SAFE' || item.status === 'PASS'
                    ? 'bg-emerald-950 border border-emerald-500 text-emerald-400 glow-green'
                    : 'bg-red-950 border border-red-500 text-red-400'
                }`}
              >
                {item.status === 'BLOCKED' ? 'BLOCKED / SAFE' : 'PASSED / SAFE'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Firewall Rules Management */}
        <div className="lg:col-span-1 bg-[#0c0907] border border-amber-900/50 rounded-2xl p-4 flex flex-col shadow-xl">
          <h3 className="font-mono font-bold text-sm text-amber-400 uppercase flex items-center gap-2 mb-3 border-b border-amber-900/40 pb-2">
            <Ban className="w-4 h-4 text-red-500" />
            BLOCKED IP RULESET ({firewallRules.length})
          </h3>

          {/* Add Rule Form */}
          <form onSubmit={handleManualAddRule} className="space-y-2.5 mb-4">
            <div>
              <label className="text-[11px] font-mono text-neutral-400 block mb-1">TARGET IP / RANGE:</label>
              <input
                type="text"
                value={newIpInput}
                onChange={(e) => setNewIpInput(e.target.value)}
                placeholder="e.g. 185.220.101.44 or 45.142.0.0/16"
                className="w-full bg-[#060504] border border-amber-900/50 focus:border-amber-500 rounded-xl px-3 py-2 font-mono text-xs text-white placeholder-neutral-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-neutral-400 block mb-1">REASON / NOTE:</label>
              <input
                type="text"
                value={newReasonInput}
                onChange={(e) => setNewReasonInput(e.target.value)}
                placeholder="e.g. Hostile Port Scanner"
                className="w-full bg-[#060504] border border-amber-900/50 focus:border-amber-500 rounded-xl px-3 py-2 font-mono text-xs text-white placeholder-neutral-600 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-mono font-extrabold text-xs rounded-xl transition-all shadow-md shadow-amber-950 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>INJECT TORII BLOCK RULE</span>
            </button>
          </form>

          {/* Rules List */}
          <div className="flex-1 overflow-y-auto space-y-2 max-h-80 pr-1">
            {firewallRules.map((rule) => (
              <div
                key={rule.id}
                className="bg-[#060504] border border-amber-900/40 p-3 rounded-xl flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-amber-400">{rule.ipPattern}</span>
                    <span className="px-1.5 py-0.2 bg-red-950 border border-red-700 text-red-400 font-bold text-[10px] rounded">
                      {rule.action}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{rule.reason}</p>
                </div>
                <button
                  onClick={() => onRemoveRule(rule.id)}
                  className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-900 rounded-lg transition-colors"
                  title="Remove Firewall Rule"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Live Network Packet Inspector */}
        <div className="lg:col-span-2 bg-[#0c0907] border border-amber-900/50 rounded-2xl p-4 flex flex-col shadow-xl">
          <div className="flex items-center justify-between mb-3 border-b border-amber-900/40 pb-2">
            <h3 className="font-mono font-bold text-sm text-amber-400 uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
              REAL-TIME NETWORK PACKET STREAM
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              INSPECTION ACTIVE
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-amber-900/40 text-neutral-400 text-[11px] uppercase">
                  <th className="py-2 px-2">TIMESTAMP</th>
                  <th className="py-2 px-2">SOURCE IP</th>
                  <th className="py-2 px-2">PORT</th>
                  <th className="py-2 px-2">PAYLOAD SUMMARY</th>
                  <th className="py-2 px-2">THREAT SCORE</th>
                  <th className="py-2 px-2">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-950/40">
                {packets.map((pkt) => (
                  <tr key={pkt.id} className="hover:bg-amber-950/20 transition-colors">
                    <td className="py-2.5 px-2 text-neutral-400 whitespace-nowrap">{pkt.timestamp}</td>
                    <td className="py-2.5 px-2 text-white font-bold whitespace-nowrap">{pkt.sourceIP}</td>
                    <td className="py-2.5 px-2 text-amber-400 font-bold">{pkt.destPort}</td>
                    <td className="py-2.5 px-2 text-neutral-300 max-w-xs truncate">{pkt.payloadSummary}</td>
                    <td className="py-2.5 px-2">
                      <span
                        className={`font-mono font-black ${
                          pkt.threatScore > 50 ? 'text-red-500 animate-pulse' : 'text-emerald-400'
                        }`}
                      >
                        {pkt.threatScore > 50 ? `侵入者 ${pkt.threatScore}/100` : `安全 ${pkt.threatScore}/100`}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      {pkt.status === 'BLOCKED' ? (
                        <span className="px-2 py-0.5 bg-red-950 border border-red-500 text-red-400 font-black rounded-md text-[10px] glow-red">
                          INTRUDER BLOCKED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-600 text-emerald-400 font-extrabold rounded-md text-[10px] glow-green">
                          SAFE / CLEARED
                        </span>
                      )}
                    </td>
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
