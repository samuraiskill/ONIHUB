import React from 'react';
import { Shield, Lock, EyeOff, Volume2, VolumeX, Globe, Bot, Flame, Download, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { ActiveRoom, SecurityStatus } from '../types';
import KatanaKasaIcon from '../assets/images/katana_kasa_icon_1788793634833.jpg';

interface NavbarProps {
  activeRoom: ActiveRoom;
  setActiveRoom: (room: ActiveRoom) => void;
  securityStatus: SecurityStatus;
  privacyEnabled: boolean;
  onTogglePrivacy: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onLockAirlock: () => void;
  onTriggerBreachTest: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRoom,
  setActiveRoom,
  securityStatus,
  privacyEnabled,
  onTogglePrivacy,
  isMuted,
  onToggleMute,
  onLockAirlock,
  onTriggerBreachTest,
}) => {
  return (
    <header className="bg-neutral-950 border-b border-amber-900/40 text-white select-none z-50 sticky top-0 shadow-dojo-depth">
      {/* Top KasA Elder Dojo Header */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 border-b border-amber-950/60 bg-[#0c0a08]/95 text-xs">
        <div className="flex items-center gap-3">
          {/* Katana & Kasa App Icon with Gold-Crimson Border */}
          <div className="relative group flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-amber-600/80 shadow-[0_0_20px_rgba(217,119,6,0.5)] p-0.5 bg-black shimmer-icon-wrapper">
              <img
                src={KatanaKasaIcon}
                alt="KasA Dojo Katana & Umbrella Icon"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-base tracking-widest text-amber-400 uppercase flex items-center gap-1.5">
                  傘 KasA <span className="text-red-500 font-extrabold">DOJO KIOSK</span>
                </span>
                <span className="px-2 py-0.5 bg-amber-950/90 border border-amber-700/80 text-amber-300 text-[10px] font-mono font-bold rounded-md">
                  堂 SANCTUARY
                </span>
              </div>
              <p className="text-[10px] font-mono text-neutral-400 hidden sm:block">Elder Japanese Security Citadel • Zero-Leak Process Isolation</p>
            </div>
          </div>

          <div className="h-5 w-px bg-amber-950 hidden md:block" />

          {/* Strict Security Status Indicators */}
          <div className="flex items-center gap-2">
            <span className="text-amber-600/80 font-mono text-[10px] uppercase hidden lg:inline tracking-wider">DOJO PERIMETER:</span>
            {securityStatus === 'FORTRESS' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/80 text-emerald-400 font-mono font-extrabold text-[11px] glow-green">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>無事 SAFE FORTRESS</span>
              </span>
            )}
            {securityStatus === 'MONITORING' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-600 text-emerald-300 font-mono font-bold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>監視 NO INTRUDERS DETECTED</span>
              </span>
            )}
            {securityStatus === 'BREACH_ALERT' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-950 border-2 border-red-500 text-red-400 font-mono font-black text-[11px] glow-red animate-bounce">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                <span>侵入者 INTRUDER BREACH ALERT!</span>
              </span>
            )}
            {securityStatus === 'AIRLOCK_LOCKED' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-900 border border-amber-700/80 text-amber-200 font-mono font-bold text-[11px]">
                <Lock className="w-3.5 h-3.5 text-red-500" />
                <span>封鎖 DOJO AIRLOCK LOCKDOWN</span>
              </span>
            )}
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <button
            onClick={onTogglePrivacy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold border transition-all ${
              privacyEnabled
                ? 'bg-amber-950/90 border-amber-500 text-amber-300 font-bold shadow-[0_0_15px_rgba(217,119,6,0.4)]'
                : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
            }`}
            title="Toggle Polarized Japanese Privacy Shield"
          >
            <EyeOff className="w-3.5 h-3.5 text-amber-400" />
            <span>屏風 PRIVACY: {privacyEnabled ? 'ACTIVE' : 'OFF'}</span>
          </button>

          <button
            onClick={onToggleMute}
            className={`p-1.5 rounded-lg border transition-all ${
              isMuted
                ? 'bg-neutral-900 border-neutral-800 text-neutral-500'
                : 'bg-neutral-900 border-neutral-700 text-amber-400 hover:text-amber-300'
            }`}
            title={isMuted ? 'Unmute Security Sirens' : 'Mute Security Sirens'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onTriggerBreachTest}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-red-950/80 border border-red-700 text-red-300 hover:text-white rounded-lg text-[11px] font-mono font-bold transition-colors"
            title="Simulate Security Alarm & Intruder Breach Test"
          >
            <AlertTriangle className="w-3 h-3 text-red-500" />
            <span className="hidden lg:inline">INTRUDER TEST</span>
          </button>

          <button
            onClick={onLockAirlock}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 active:bg-red-800 text-white font-mono font-bold rounded-lg text-[11px] shadow-md shadow-red-950 transition-all border border-red-500/50"
            title="Trigger Immediate Airlock Lockdown"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>刀 LOCK DOJO</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="flex items-center overflow-x-auto no-scrollbar bg-[#080605] px-3 py-1.5 gap-1.5 border-t border-amber-950/60">
        <button
          onClick={() => setActiveRoom('browser')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold whitespace-nowrap transition-all ${
            activeRoom === 'browser'
              ? 'bg-amber-600 text-black font-extrabold shadow-md shadow-amber-950/60'
              : 'text-neutral-400 hover:text-amber-200 hover:bg-neutral-900/80'
          }`}
        >
          <Globe className="w-4 h-4 text-amber-400" />
          <span>1. 網 DOJO BROWSER</span>
        </button>

        <button
          onClick={() => setActiveRoom('ai-citadel')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold whitespace-nowrap transition-all ${
            activeRoom === 'ai-citadel'
              ? 'bg-amber-600 text-black font-extrabold shadow-md shadow-amber-950/60'
              : 'text-neutral-400 hover:text-amber-200 hover:bg-neutral-900/80'
          }`}
        >
          <Bot className="w-4 h-4 text-amber-400" />
          <span>2. 堂 KasA AI SANCTUARY</span>
        </button>

        <button
          onClick={() => setActiveRoom('firewall')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold whitespace-nowrap transition-all ${
            activeRoom === 'firewall'
              ? 'bg-amber-600 text-black font-extrabold shadow-md shadow-amber-950/60'
              : 'text-neutral-400 hover:text-amber-200 hover:bg-neutral-900/80'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-400" />
          <span>3. 門 TORII FIREWALL &amp; IDS</span>
        </button>

        <button
          onClick={() => setActiveRoom('apk-export')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold whitespace-nowrap transition-all ${
            activeRoom === 'apk-export'
              ? 'bg-amber-600 text-black font-extrabold shadow-md shadow-amber-950/60'
              : 'text-neutral-400 hover:text-amber-200 hover:bg-neutral-900/80'
          }`}
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>4. 笠 OFFLINE SCROLL / APK</span>
        </button>

        <button
          onClick={() => setActiveRoom('audit-logs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold whitespace-nowrap transition-all ${
            activeRoom === 'audit-logs'
              ? 'bg-amber-600 text-black font-extrabold shadow-md shadow-amber-950/60'
              : 'text-neutral-400 hover:text-amber-200 hover:bg-neutral-900/80'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span>5. 録 SECURITY SCROLLS</span>
        </button>
      </nav>
    </header>
  );
};
