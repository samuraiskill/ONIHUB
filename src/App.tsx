import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PrivacyScreenOverlay } from './components/PrivacyScreenOverlay';
import { AirlockLockdown } from './components/AirlockLockdown';
import { EncryptedBrowser } from './components/EncryptedBrowser';
import { AICitadel } from './components/AICitadel';
import { FirewallIDS } from './components/FirewallIDS';
import { APKExporter } from './components/APKExporter';
import { AuditLogs } from './components/AuditLogs';
import { ActiveRoom, SecurityStatus, SecurityEventLog, FirewallRule } from './types';
import { audioEngine } from './utils/audioAlarm';

export default function App() {
  const [activeRoom, setActiveRoom] = useState<ActiveRoom>('browser');
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>('FORTRESS');
  const [privacyEnabled, setPrivacyEnabled] = useState(false);
  const [privacyMode, setPrivacyMode] = useState<'scanlines' | 'polarized' | 'max_tint'>('polarized');
  const [isMuted, setIsMuted] = useState(false);
  const [isAirlockLocked, setIsAirlockLocked] = useState(false);

  // Security Firewall Rules
  const [firewallRules, setFirewallRules] = useState<FirewallRule[]>([
    {
      id: 'f-1',
      ipPattern: '185.220.101.44',
      action: 'BLOCK',
      protocol: 'ALL',
      reason: 'Automated Threat Intelligence: Rogue Tor Exit Node Scanner',
      addedAt: new Date().toLocaleTimeString(),
      hitsCount: 14,
    },
    {
      id: 'f-2',
      ipPattern: '45.142.214.0/24',
      action: 'BLOCK',
      protocol: 'TCP',
      reason: 'Known Phishing & Man-In-The-Middle Injection Subnet',
      addedAt: new Date().toLocaleTimeString(),
      hitsCount: 8,
    },
  ]);

  // Centralized Security Audit Logs
  const [logs, setLogs] = useState<SecurityEventLog[]>([
    {
      id: 'l-1',
      timestamp: new Date().toLocaleTimeString(),
      category: 'AIRLOCK',
      severity: 'INFO',
      source: 'SYSTEM_BOOT',
      message: 'Aegis Security Kiosk initialized in FORTRESS lockdown state.',
    },
    {
      id: 'l-2',
      timestamp: new Date().toLocaleTimeString(),
      category: 'FIREWALL',
      severity: 'BLOCKED',
      source: 'ACTIVE_IDS',
      message: 'Automated firewall blocked port scan from IP 185.220.101.44:8080.',
    },
    {
      id: 'l-3',
      timestamp: new Date().toLocaleTimeString(),
      category: 'AUTHENTICATION',
      severity: 'INFO',
      source: 'BIOMETRIC_PASSKEY',
      message: 'Primary user identity verified via WebAuthn Biometric sensor.',
    },
  ]);

  const addLog = (
    category: SecurityEventLog['category'],
    severity: SecurityEventLog['severity'],
    source: string,
    message: string
  ) => {
    const newLog: SecurityEventLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      category,
      severity,
      source,
      message,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleAddFirewallRule = (rule: { ipPattern: string; action: 'BLOCK' | 'QUARANTINE'; reason: string }) => {
    const newRule: FirewallRule = {
      id: 'f-' + Date.now(),
      ipPattern: rule.ipPattern,
      action: rule.action,
      protocol: 'ALL',
      reason: rule.reason,
      addedAt: new Date().toLocaleTimeString(),
      hitsCount: 0,
    };
    setFirewallRules((prev) => [newRule, ...prev]);
  };

  const handleRemoveFirewallRule = (id: string) => {
    setFirewallRules((prev) => prev.filter((r) => r.id !== id));
    addLog('FIREWALL', 'INFO', 'RULE_REMOVED', `Firewall rule ${id} purged.`);
  };

  const handleLockAirlock = () => {
    audioEngine.playScanBeep(350, 0.2);
    setIsAirlockLocked(true);
    setSecurityStatus('AIRLOCK_LOCKED');
    addLog('AIRLOCK', 'WARNING', 'MANUAL_LOCK', 'Manual Airlock Lockdown triggered by user.');
  };

  const handleUnlockAirlock = (method: 'BIOMETRIC' | 'PASSCODE') => {
    setIsAirlockLocked(false);
    setSecurityStatus('FORTRESS');
    addLog('AUTHENTICATION', 'INFO', method, `Airlock Lockdown disengaged via ${method}.`);
  };

  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioEngine.setMuted(newMuted);
  };

  const handleTriggerBreachTest = () => {
    setSecurityStatus('BREACH_ALERT');
    audioEngine.startBreachAlarm();
    addLog('AIRLOCK', 'CRITICAL', 'BREACH_SIMULATION', 'SECURITY ALARM TEST TRIGGERED! Intrusion alert active.');

    setTimeout(() => {
      audioEngine.stopAlarm();
      setSecurityStatus('FORTRESS');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col antialiased select-none">
      {/* Top Navbar */}
      <Navbar
        activeRoom={activeRoom}
        setActiveRoom={setActiveRoom}
        securityStatus={securityStatus}
        privacyEnabled={privacyEnabled}
        onTogglePrivacy={() => setPrivacyEnabled(!privacyEnabled)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onLockAirlock={handleLockAirlock}
        onTriggerBreachTest={handleTriggerBreachTest}
      />

      {/* Main Room Views */}
      <main className="flex-1 relative overflow-hidden bg-black">
        {activeRoom === 'browser' && <EncryptedBrowser onAddLog={addLog} />}
        {activeRoom === 'ai-citadel' && (
          <AICitadel onAddLog={addLog} onAddFirewallRule={handleAddFirewallRule} />
        )}
        {activeRoom === 'firewall' && (
          <FirewallIDS
            firewallRules={firewallRules}
            onAddRule={handleAddFirewallRule}
            onRemoveRule={handleRemoveFirewallRule}
            onAddLog={addLog}
            onTriggerAirlock={handleLockAirlock}
          />
        )}
        {activeRoom === 'apk-export' && <APKExporter onAddLog={addLog} />}
        {activeRoom === 'audit-logs' && (
          <AuditLogs logs={logs} onClearLogs={() => setLogs([])} />
        )}
      </main>

      {/* Privacy Screen Overlay Filter */}
      <PrivacyScreenOverlay
        enabled={privacyEnabled}
        onToggle={() => setPrivacyEnabled(false)}
        privacyMode={privacyMode}
        setPrivacyMode={setPrivacyMode}
      />

      {/* Airlock Lockdown Biometric Modal */}
      <AirlockLockdown
        isLocked={isAirlockLocked}
        onUnlock={handleUnlockAirlock}
        onAddLog={addLog}
      />
    </div>
  );
}
