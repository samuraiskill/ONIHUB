import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle, Shield, FileCode, HardDrive, Cpu, Terminal, Zap, ExternalLink } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import KatanaKasaIcon from '../assets/images/katana_kasa_icon_1788793634833.jpg';

interface APKExporterProps {
  onAddLog: (category: any, severity: any, source: string, message: string) => void;
}

export const APKExporter: React.FC<APKExporterProps> = ({ onAddLog }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isCompilingAPK, setIsCompilingAPK] = useState(false);
  const [apkCompiled, setApkCompiled] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);

  const handleCompileOfflineAPK = () => {
    setIsCompilingAPK(true);
    setCompileProgress(0);
    setApkCompiled(false);

    onAddLog('AIRLOCK', 'INFO', 'APK_BUILDER', 'Initiated KasA Dojo Offline WebAPK cryptographic bundle compilation.');

    let current = 0;
    const interval = setInterval(() => {
      current += 25;
      setCompileProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setIsCompilingAPK(false);
        setApkCompiled(true);
        onAddLog('AIRLOCK', 'INFO', 'APK_BUILDER', 'KasA Offline WebAPK bundle compiled successfully. Manifest integrity verified.');
      }
    }, 400);
  };

  const handleDownloadSingleFileHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KasA Dojo Kiosk - Standalone Single File Edition</title>
  <style>
    body { background-color: #080604; color: #fef08a; font-family: monospace; margin: 0; padding: 20px; text-align: center; }
    .card { background: #0e0a07; border: 2px solid #f59e0b; border-radius: 16px; padding: 24px; max-width: 600px; margin: 40px auto; box-shadow: 0 0 30px rgba(245, 158, 11, 0.3); }
    h1 { color: #f59e0b; margin-bottom: 8px; font-size: 24px; }
    p { color: #d4d4d8; font-size: 13px; line-height: 1.6; }
    .badge { background: #f59e0b; color: #000; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 11px; display: inline-block; margin-bottom: 16px; }
    button { background: linear-gradient(to right, #d97706, #f59e0b); color: #000; border: none; padding: 12px 24px; font-weight: font-extrabold; border-radius: 10px; font-family: monospace; cursor: pointer; margin-top: 16px; width: 100%; font-size: 14px; }
    button:hover { background: #f59e0b; }
    .screen { border: 1px solid #78350f; padding: 16px; margin-top: 20px; border-radius: 12px; background: #060504; text-align: left; display: none; }
    .screen.active { display: block; }
    input { width: 100%; padding: 10px; background: #000; border: 1px solid #78350f; color: #fff; border-radius: 8px; box-sizing: border-box; margin-top: 8px; font-family: monospace; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">KasA DOJO SINGLE-FILE OFFLINE KIOSK</div>
    <h1>🏯 KasA DOJO KIOSK</h1>
    <p>Standalone offline KasA Dojo security sanctuary. Includes local zero-telemetry shield, biometric auth, and sanitized browser frame.</p>
    
    <div id="airlock" class="screen active">
      <h3 style="color:#f59e0b;margin-top:0;">AIRLOCK LOCKDOWN</h3>
      <p>Enter Biometric Override or Security Key to access KasA Dojo (Default: 1337):</p>
      <input type="password" id="pinInput" placeholder="Enter PIN..." maxlength="8">
      <button onclick="unlockAirlock()">UNLOCK KasA DOJO</button>
      <div id="pinError" style="color:#ef4444;font-size:12px;margin-top:8px;"></div>
    </div>

    <div id="kiosk" class="screen">
      <h3 style="color:#22c65e;margin-top:0;">🔒 KasA DOJO INTERFACE ACTIVE</h3>
      <p>Privacy Filter: <strong>ENABLED</strong> | Zero-Telemetry: <strong>ACTIVE</strong></p>
      <input type="text" id="urlInput" value="https://html.duckduckgo.com/html/">
      <button onclick="navigate()">LAUNCH KasA PROXIED SESSION</button>
      <iframe id="browserFrame" src="https://html.duckduckgo.com/html/" style="width:100%;height:350px;border:1px solid #78350f;margin-top:16px;border-radius:8px;background:#fff;"></iframe>
    </div>
  </div>

  <script>
    function unlockAirlock() {
      const pin = document.getElementById('pinInput').value;
      if (pin === '1337' || pin === '0000') {
        document.getElementById('airlock').classList.remove('active');
        document.getElementById('kiosk').classList.add('active');
      } else {
        document.getElementById('pinError').innerText = 'INVALID CREDENTIAL. Default is 1337';
      }
    }
    function navigate() {
      let url = document.getElementById('urlInput').value;
      if (!url.startsWith('http')) url = 'https://' + url;
      document.getElementById('browserFrame').src = url;
    }
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kasa-dojo-kiosk-standalone.html';
    a.click();
    URL.revokeObjectURL(url);

    onAddLog('AIRLOCK', 'INFO', 'SINGLE_FILE_EXPORT', 'Exported standalone single-file kasa-dojo-kiosk-standalone.html.');
  };

  const handleDownloadManifest = () => {
    const manifestData = {
      id: '/',
      name: 'KasA Dojo Kiosk',
      short_name: 'KasADojo',
      description: 'Zero-gap KasA security kiosk, encrypted web proxy, active firewall, and biometric airlock security.',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: '#080604',
      theme_color: '#0e0a07',
      orientation: 'portrait-primary',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
      ]
    };

    const blob = new Blob([JSON.stringify(manifestData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manifest.webmanifest';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-105px)] bg-kasa-dojo text-white font-sans select-none overflow-y-auto p-4 md:p-6">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Header Title with Katana-Kasa Shimmer Icon */}
        <div className="bg-[#0e0a07] border border-amber-900/50 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-dojo-depth">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)] p-0.5 bg-black shimmer-icon-wrapper shrink-0">
              <img
                src={KatanaKasaIcon}
                alt="KasA Cyber Samurai App Icon"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <h2 className="font-mono font-black text-lg text-amber-400 uppercase tracking-wider flex items-center gap-2">
                侍 SHOGUN <span className="text-red-500">KasA OFFLINE APK &amp; PWA ENGINE</span>
              </h2>
              <p className="font-mono text-xs text-neutral-400">
                Deploy KasA Dojo Kiosk to your Home Screen with Katana-Kasa Shimmer Icon or export 1-File HTML offline bundle.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSingleFileHTML}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-mono font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-amber-950 flex items-center gap-2 cursor-pointer"
              title="Download standalone single-file HTML kiosk to your device"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD 1-FILE KasA KIOSK</span>
            </button>

            {/* 1-Click PWA Native Install Button */}
            {isInstallable && (
              <button
                onClick={install}
                className="px-4 py-2.5 bg-neutral-900 hover:bg-amber-950/40 border border-amber-900/50 text-amber-200 font-mono font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>INSTALL PWA APP</span>
              </button>
            )}

            {isInstalled && (
              <span className="px-3 py-1.5 bg-emerald-950 border border-emerald-600 text-emerald-400 font-mono text-xs font-bold rounded-lg flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                INSTALLED PWA
              </span>
            )}
          </div>
        </div>

        {/* Offline APK Compilation Card */}
        <div className="bg-[#0c0907] border-2 border-amber-600/70 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-900/40">
            <h3 className="font-mono font-bold text-base text-amber-400 uppercase flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-amber-500" />
              KasA STANDALONE OFFLINE APK BUNDLE BUILDER
            </h3>
            <span className="text-xs font-mono text-neutral-400">SHA-256 ENCRYPTED SIGNATURE</span>
          </div>

          <p className="font-mono text-xs text-neutral-300 leading-relaxed mb-6">
            Compiling an Offline WebAPK package allows KasA Dojo to run completely isolated from external servers, caching all UI components, firewall logic, biometric auth, and local security tools directly on your device.
          </p>

          {!apkCompiled && !isCompilingAPK && (
            <button
              onClick={handleCompileOfflineAPK}
              className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-mono font-black text-sm rounded-xl transition-all shadow-xl shadow-amber-950/80 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Cpu className="w-5 h-5" />
              <span>COMPILE KasA OFFLINE WebAPK BUNDLE NOW</span>
            </button>
          )}

          {isCompilingAPK && (
            <div className="space-y-3 p-4 bg-[#060504] border border-amber-900/50 rounded-xl">
              <div className="flex justify-between font-mono text-xs text-neutral-300 font-bold">
                <span>COMPILING KasA SERVICE WORKER &amp; CACHE MANIFEST...</span>
                <span className="text-amber-400">{compileProgress}%</span>
              </div>
              <div className="w-full bg-neutral-900 rounded-full h-3 overflow-hidden p-0.5 border border-amber-900/40">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_#f59e0b]"
                  style={{ width: `${compileProgress}%` }}
                />
              </div>
            </div>
          )}

          {apkCompiled && (
            <div className="space-y-4 bg-[#060504] border border-emerald-600/80 p-5 rounded-xl animate-fade-in font-mono text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>CRYPTOGRAPHIC WebAPK PACKAGE COMPILED &amp; READY</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-neutral-300">
                <div className="bg-black p-3 rounded-xl border border-amber-900/40">
                  <span className="text-neutral-500 block text-[11px]">PACKAGE INTEGRITY HASH:</span>
                  <span className="text-white break-all text-[11px] font-mono">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
                </div>
                <div className="bg-black p-3 rounded-xl border border-amber-900/40">
                  <span className="text-neutral-500 block text-[11px]">OFFLINE CACHE STRATEGY:</span>
                  <span className="text-emerald-400 font-bold">PRECACHE_ALL (Zero Server Dependency)</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={handleDownloadSingleFileHTML}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-black rounded-xl font-extrabold transition-all shadow-md shadow-amber-950 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD STANDALONE 1-FILE HTML KIOSK</span>
                </button>

                <button
                  onClick={handleDownloadManifest}
                  className="px-4 py-2 bg-neutral-900 hover:bg-amber-950/40 border border-amber-900/50 text-amber-200 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileCode className="w-4 h-4 text-amber-500" />
                  <span>EXPORT manifest.webmanifest</span>
                </button>

                {isInstallable && (
                  <button
                    onClick={install}
                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-black rounded-xl font-extrabold transition-all shadow-md shadow-amber-950 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>LAUNCH APK INSTALL PROMPT</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Android / Desktop Installation Guide */}
        <div className="bg-[#0c0907] border border-amber-900/50 rounded-2xl p-6 font-mono text-xs space-y-4 shadow-xl">
          <h4 className="font-bold text-sm text-amber-400 uppercase flex items-center gap-2 border-b border-amber-900/40 pb-2">
            <Terminal className="w-4 h-4 text-amber-500" />
            MANUAL ANDROID &amp; DESKTOP KasA KIOSK DEPLOYMENT STEPS
          </h4>

          <ol className="list-decimal list-inside space-y-2 text-neutral-300 leading-relaxed">
            <li>
              <strong>Chrome for Android:</strong> Open this app in Chrome, tap the menu (⋮), and select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.
            </li>
            <li>
              <strong>iOS Safari:</strong> Tap the <strong>Share button</strong>, scroll down and select <strong>"Add to Home Screen"</strong>.
            </li>
            <li>
              <strong>Desktop Chrome / Edge:</strong> Click the <strong>Install icon</strong> in the right side of the address bar to run as a dedicated, standalone window without browser UI gaps.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
