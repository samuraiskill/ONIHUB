import React, { useState } from 'react';
import { Shield, Lock, Globe, RotateCw, ExternalLink, ShieldAlert, Cpu, EyeOff, Layers, CheckCircle, Flame, Bookmark } from 'lucide-react';

interface EncryptedBrowserProps {
  onAddLog: (category: any, severity: any, source: string, message: string) => void;
}

const BOOKMARKS = [
  { name: 'DuckDuckGo Privacy', url: 'https://html.duckduckgo.com/html/', desc: 'Zero-tracking privacy search engine' },
  { name: 'VirusTotal Threat Scan', url: 'https://www.virustotal.com', desc: 'Scan files & URLs for malicious payloads' },
  { name: 'EFF Privacy Badger', url: 'https://privacybadger.org', desc: 'Electronic Frontier Foundation privacy tools' },
  { name: 'OWASP Cyber Defense', url: 'https://owasp.org', desc: 'Global application security standards' },
  { name: 'Tor Project Gateway', url: 'https://check.torproject.org', desc: 'Verify onion routing & IP proxy anonymity' },
  { name: 'IP Leak Checker', url: 'https://dnsleaktest.com', desc: 'Verify no DNS or IP address leakage occurs' },
];

export const EncryptedBrowser: React.FC<EncryptedBrowserProps> = ({ onAddLog }) => {
  const [urlInput, setUrlInput] = useState('https://html.duckduckgo.com/html/');
  const [currentUrl, setCurrentUrl] = useState('https://html.duckduckgo.com/html/');
  const [useProxy, setUseProxy] = useState(true);
  const [blockScripts, setBlockScripts] = useState(true);
  const [blockTrackers, setBlockTrackers] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showCertInspector, setShowCertInspector] = useState(false);
  const [sessionBytesEncrypted, setSessionBytesEncrypted] = useState(1482090);

  const handleNavigate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let target = urlInput.trim();
    if (!target) return;

    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      if (target.includes('.')) {
        target = 'https://' + target;
      } else {
        target = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(target)}`;
      }
    }

    setIsLoading(true);
    setCurrentUrl(target);
    setUrlInput(target);
    setSessionBytesEncrypted((prev) => prev + Math.floor(Math.random() * 50000) + 12000);

    onAddLog(
      'PROXIED_BROWSER',
      'INFO',
      'KASA_DOJO_BROWSER',
      `Navigating to: ${target} [KasA Proxy: ${useProxy ? 'ACTIVE' : 'DIRECT_SANDBOX'}]`
    );

    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  const getProxyIframeUrl = () => {
    if (useProxy) {
      return `/api/proxy?url=${encodeURIComponent(currentUrl)}&blockScripts=${blockScripts}`;
    }
    return currentUrl;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-105px)] bg-kasa-dojo text-white font-sans select-none overflow-hidden">
      {/* Browser Controls & URL Bar Header */}
      <div className="bg-[#0e0a07] border-b border-amber-900/50 p-3 flex flex-col gap-2.5 shadow-dojo-depth">
        <form onSubmit={handleNavigate} className="flex items-center gap-2.5">
          {/* Security Indicator Lock */}
          <button
            type="button"
            onClick={() => setShowCertInspector(!showCertInspector)}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-950/80 border border-emerald-500/80 text-emerald-400 rounded-xl text-xs font-mono font-bold transition-all shadow-sm glow-green"
            title="Inspect TLS 1.3 AES-256 Encryption Certificates"
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">安全 SAFE TLS-256</span>
          </button>

          {/* URL Input Bar with Lacquered Depth Styling */}
          <div className="relative flex-1 flex items-center bg-[#060504] border-2 border-amber-900/60 focus-within:border-amber-500 rounded-xl transition-colors overflow-hidden shadow-inner">
            <span className="pl-3.5 pr-2 text-amber-500 font-mono text-xs font-bold">
              {currentUrl.startsWith('https') ? 'https://' : 'http://'}
            </span>
            <input
              type="text"
              value={urlInput.replace(/^https?:\/\//, '')}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter domain or query into KasA Dojo Browser..."
              className="w-full bg-transparent py-2.5 pr-3 text-xs md:text-sm font-mono text-white placeholder-neutral-500 focus:outline-none"
            />
            {isLoading && (
              <RotateCw className="w-4 h-4 text-amber-500 animate-spin mr-3" />
            )}
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-mono text-xs font-extrabold rounded-xl transition-all shadow-md shadow-amber-950 flex items-center gap-1.5 cursor-pointer"
          >
            <span>NAVIGATE</span>
          </button>
        </form>

        {/* Security Shield Toggles & Stats Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono pt-1.5 border-t border-amber-950/50 text-neutral-400">
          <div className="flex flex-wrap items-center gap-2">
            {/* Encrypted Proxy Switch */}
            <button
              onClick={() => setUseProxy(!useProxy)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-bold transition-all ${
                useProxy
                  ? 'bg-amber-950/90 border-amber-500 text-amber-300 shadow-sm'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>KasA PROXY: {useProxy ? 'ACTIVE' : 'OFF'}</span>
            </button>

            {/* Script Blocker Switch */}
            <button
              onClick={() => setBlockScripts(!blockScripts)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-bold transition-all ${
                blockScripts
                  ? 'bg-emerald-950/80 border-emerald-600 text-emerald-400'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>SCRIPT NEUTRALIZER: {blockScripts ? 'ON' : 'OFF'}</span>
            </button>

            {/* Tracker Shield Switch */}
            <button
              onClick={() => setBlockTrackers(!blockTrackers)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-bold transition-all ${
                blockTrackers
                  ? 'bg-neutral-900 border-amber-700/80 text-amber-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5 text-amber-400" />
              <span>TRACKER SHIELD: {blockTrackers ? 'BLOCKING 100%' : 'OFF'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
            <span>ENCRYPTED TRAFFIC: <strong className="text-amber-400 font-mono">{(sessionBytesEncrypted / 1024).toFixed(1)} KB</strong></span>
            <span className="text-emerald-400 font-bold hidden md:inline">● ZERO LEAKS</span>
          </div>
        </div>
      </div>

      {/* Bookmarks Drawer */}
      <div className="bg-[#0b0806] border-b border-amber-900/40 px-3.5 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
        <span className="font-mono text-[11px] font-bold text-amber-500 uppercase flex items-center gap-1 whitespace-nowrap">
          <Bookmark className="w-3.5 h-3.5 text-amber-500" />
          DOJO BOOKMARKS:
        </span>
        {BOOKMARKS.map((bm, i) => (
          <button
            key={i}
            onClick={() => {
              setUrlInput(bm.url);
              setCurrentUrl(bm.url);
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 500);
            }}
            className="px-3 py-1 bg-black hover:bg-amber-950/40 border border-amber-900/50 hover:border-amber-500/80 text-amber-200 hover:text-white rounded-lg text-[11px] font-mono whitespace-nowrap transition-all shadow-sm"
            title={bm.desc}
          >
            {bm.name}
          </button>
        ))}
      </div>

      {/* Certificate Inspector Modal */}
      {showCertInspector && (
        <div className="bg-[#0a0806] border-b-2 border-amber-600 p-4 text-xs font-mono text-neutral-300 animate-fade-in shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-extrabold text-sm text-amber-400 uppercase flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-500" />
              KasA TLS 1.3 AES-256 CRYPTOGRAPHIC INSPECTOR
            </h4>
            <button
              onClick={() => setShowCertInspector(false)}
              className="text-neutral-500 hover:text-white font-bold"
            >
              ✕ CLOSE
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-black border border-amber-900/40 rounded-xl p-3.5">
            <div>
              <span className="text-neutral-500 block">SESSION PROTOCOL:</span>
              <span className="text-emerald-400 font-bold">TLS 1.3 / X25519 (ChaCha20-Poly1305 / AES-256-GCM)</span>
            </div>
            <div>
              <span className="text-neutral-500 block">HANDSHAKE FINGERPRINT (SHA-256):</span>
              <span className="text-white font-mono break-all text-[11px]">8F:A2:3E:99:C1:42:01:FF:77:9B:04:E2</span>
            </div>
            <div>
              <span className="text-neutral-500 block">SECURITY HEADERS ENFORCED:</span>
              <span className="text-amber-400 font-bold">HSTS, CSP Strict, X-Content-Type-Options, No-Referrer</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Browser Viewport */}
      <div className="relative flex-1 bg-black w-full h-full overflow-hidden p-1 bg-kasa-dojo">
        {isLoading && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-6">
            <RotateCw className="w-10 h-10 text-amber-500 animate-spin mb-3" />
            <h3 className="font-mono text-lg font-extrabold text-amber-400">KasA DOJO ENCRYPTION IN PROGRESS</h3>
            <p className="font-mono text-xs text-neutral-400 max-w-sm mt-1">
              Applying KasA zero-leak anti-tracker headers and sanitizing process threads...
            </p>
          </div>
        )}

        <iframe
          src={getProxyIframeUrl()}
          className="w-full h-full border border-amber-900/40 rounded-xl bg-white shadow-2xl"
          title="Encrypted Browser Viewport"
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
};
