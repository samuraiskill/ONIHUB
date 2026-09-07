import React from 'react';
import { Shield, EyeOff, Lock, Scan, Check } from 'lucide-react';

interface PrivacyScreenOverlayProps {
  enabled: boolean;
  onToggle: () => void;
  privacyMode: 'scanlines' | 'polarized' | 'max_tint';
  setPrivacyMode: (mode: 'scanlines' | 'polarized' | 'max_tint') => void;
}

export const PrivacyScreenOverlay: React.FC<PrivacyScreenOverlayProps> = ({
  enabled,
  onToggle,
  privacyMode,
  setPrivacyMode,
}) => {
  if (!enabled) return null;

  return (
    <>
      {/* Visual Filter Overlays */}
      {privacyMode === 'scanlines' && (
        <div 
          className="fixed inset-0 pointer-events-none z-[9990] opacity-40 mix-blend-overlay"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.8),
              rgba(0, 0, 0, 0.8) 1px,
              transparent 1px,
              transparent 3px
            )`
          }}
        />
      )}

      {privacyMode === 'polarized' && (
        <div 
          className="fixed inset-0 pointer-events-none z-[9990] backdrop-blur-[1px] bg-black/35 opacity-90 contrast-125"
          style={{
            boxShadow: 'inset 0 0 150px rgba(239, 68, 68, 0.25)'
          }}
        />
      )}

      {privacyMode === 'max_tint' && (
        <div 
          className="fixed inset-0 pointer-events-none z-[9990] bg-black/60 backdrop-brightness-75 contrast-150"
          style={{
            backgroundImage: `radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.85) 90%)`
          }}
        />
      )}

      {/* Floating Status Badge & Control Drawer */}
      <div className="fixed bottom-4 right-4 z-[9995] flex items-center gap-2 bg-neutral-900/95 border border-red-600/60 text-white rounded-lg px-3 py-2 text-xs shadow-2xl shadow-red-950/50 backdrop-blur-md">
        <div className="flex items-center gap-2 pr-2 border-r border-neutral-700">
          <EyeOff className="w-4 h-4 text-red-500 animate-pulse" />
          <span className="font-mono font-bold tracking-wider text-red-400 uppercase">PRIVACY SHIELD ACTIVE</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPrivacyMode('scanlines')}
            className={`px-2 py-1 rounded font-mono text-[11px] transition-all ${
              privacyMode === 'scanlines'
                ? 'bg-red-600 text-white font-bold'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            SCANLINES
          </button>
          <button
            onClick={() => setPrivacyMode('polarized')}
            className={`px-2 py-1 rounded font-mono text-[11px] transition-all ${
              privacyMode === 'polarized'
                ? 'bg-red-600 text-white font-bold'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            POLARIZED
          </button>
          <button
            onClick={() => setPrivacyMode('max_tint')}
            className={`px-2 py-1 rounded font-mono text-[11px] transition-all ${
              privacyMode === 'max_tint'
                ? 'bg-red-600 text-white font-bold'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            MAX TINT
          </button>
        </div>

        <button
          onClick={onToggle}
          className="ml-2 px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded text-[11px] font-mono transition-colors"
          title="Disable Privacy Overlay"
        >
          DISABLE
        </button>
      </div>
    </>
  );
};
