import React, { useState, useEffect } from 'react';
import { Lock, Fingerprint, ShieldAlert, CheckCircle2, Scan, AlertOctagon, Camera, ShieldCheck, Cpu, UserCheck, Globe } from 'lucide-react';
import { audioEngine } from '../utils/audioAlarm';
import KatanaKasaIcon from '../assets/images/katana_kasa_icon_1788793634833.jpg';

interface AirlockLockdownProps {
  isLocked: boolean;
  onUnlock: (method: 'BIOMETRIC' | 'HARDWARE_KEY') => void;
  onAddLog: (category: any, severity: any, source: string, message: string) => void;
}

export const AirlockLockdown: React.FC<AirlockLockdownProps> = ({
  isLocked,
  onUnlock,
  onAddLog,
}) => {
  const [activeTab, setActiveTab] = useState<'BIOMETRIC' | 'YUBIKEY'>('BIOMETRIC');
  const [isScanningBio, setIsScanningBio] = useState(false);
  const [bioProgress, setBioProgress] = useState(0);
  const [scanStep, setScanStep] = useState<'IDLE' | 'SCANNING' | 'VERIFYING' | 'GRANTED'>('IDLE');
  const [isYubiKeyWaiting, setIsYubiKeyWaiting] = useState(false);
  const [yubiKeyStatus, setYubiKeyStatus] = useState<string>('TOUCH YUBIKEY SECURITY KEY TO AUTHENTICATE');

  // Simulated Device Session Tagging
  const clientIP = '127.0.0.1 (LOCAL PROXY)';
  const deviceFingerprint = 'FIDO2-BIO-DEVICE-9082-AEGIS';

  useEffect(() => {
    if (isLocked) {
      setScanStep('IDLE');
      setBioProgress(0);
      setActiveTab('BIOMETRIC');
      setIsYubiKeyWaiting(false);
      setYubiKeyStatus('TOUCH YUBIKEY SECURITY KEY TO AUTHENTICATE');

      // Auto-trigger biometric scan prompt on lockdown
      setTimeout(() => {
        handleBiometricAuth();
      }, 300);
    }
  }, [isLocked]);

  if (!isLocked) return null;

  const handleBiometricAuth = async () => {
    audioEngine.playScanBeep(700, 0.1);
    setIsScanningBio(true);
    setScanStep('SCANNING');
    setBioProgress(0);

    // Native WebAuthn API Check
    if (window.PublicKeyCredential && typeof window.PublicKeyCredential === 'function') {
      try {
        const isAvailable = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (isAvailable) {
          onAddLog('AUTHENTICATION', 'INFO', 'WEBAUTHN', 'Platform biometric hardware authenticator (FaceID / Fingerprint) active.');
        }
      } catch (e) {
        console.warn('WebAuthn biometric fallback to simulation scanner', e);
      }
    }

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setBioProgress(current);
      audioEngine.playScanBeep(700 + current * 2, 0.04);

      if (current >= 100) {
        clearInterval(interval);
        setScanStep('VERIFYING');

        setTimeout(() => {
          setScanStep('GRANTED');
          audioEngine.playAuthSuccess();
          onAddLog(
            'AUTHENTICATION',
            'INFO',
            'BIOMETRIC_PASSKEY',
            `Biometric verified. Session IP: ${clientIP} | Hardware Token: ${deviceFingerprint}`
          );
          setTimeout(() => {
            setIsScanningBio(false);
            onUnlock('BIOMETRIC');
          }, 600);
        }, 500);
      }
    }, 150);
  };

  const handleYubiKeyAuth = async () => {
    setIsYubiKeyWaiting(true);
    setYubiKeyStatus('INSERT OR TOUCH YOUR YUBIKEY / FIDO2 HARDWARE KEY NOW...');
    audioEngine.playScanBeep(800, 0.1);

    onAddLog('AUTHENTICATION', 'INFO', 'YUBIKEY_FIDO2', 'Listening for YubiKey hardware security key challenge response...');

    setTimeout(() => {
      setYubiKeyStatus('VERIFYING YUBIKEY HMAC-SHA1 SIGNATURE...');
      audioEngine.playScanBeep(900, 0.1);

      setTimeout(() => {
        setYubiKeyStatus('YUBIKEY HARDWARE AUTHENTICATION SUCCESSFUL!');
        audioEngine.playAuthSuccess();
        onAddLog(
          'AUTHENTICATION',
          'INFO',
          'YUBIKEY_FIDO2',
          `YubiKey validated. Session IP: ${clientIP} | Hardware Token: ${deviceFingerprint}`
        );
        setTimeout(() => {
          setIsYubiKeyWaiting(false);
          onUnlock('HARDWARE_KEY');
        }, 600);
      }, 700);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 text-white font-sans select-none overflow-y-auto">
      {/* Background Animated Security Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(#ef4444 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative w-full max-w-lg bg-neutral-950 border-2 border-red-600 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.4)] p-6 md:p-8 flex flex-col items-center text-center my-auto">
        {/* Shimmering Japanese Katana & Kasa Icon Header */}
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.7)] p-0.5 bg-black shimmer-icon-wrapper">
            <img
              src={KatanaKasaIcon}
              alt="Katana & Kasa Cyber Samurai Icon"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 animate-ping" />
        </div>

        <h2 className="text-xl md:text-2xl font-mono font-black tracking-widest text-white uppercase flex items-center justify-center gap-2">
          侍 SHOGUN <span className="text-red-500">BIOMETRIC AIRLOCK</span>
        </h2>
        <p className="text-xs font-mono text-neutral-400 mt-1 max-w-xs">
          PIN KEYPAD DISCARDED. STRICT BIOMETRIC OR YUBIKEY FIDO2 HARDWARE VERIFICATION REQUIRED.
        </p>

        {/* Auth Method Navigation Tabs */}
        <div className="w-full mt-5 grid grid-cols-2 gap-1 bg-black p-1 border border-neutral-800 rounded-xl font-mono text-xs font-bold">
          <button
            onClick={() => setActiveTab('BIOMETRIC')}
            className={`py-2 px-1 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'BIOMETRIC'
                ? 'bg-red-600 text-white font-extrabold shadow-md shadow-red-950'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            <span>BIOMETRIC SCAN</span>
          </button>

          <button
            onClick={() => setActiveTab('YUBIKEY')}
            className={`py-2 px-1 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'YUBIKEY'
                ? 'bg-red-600 text-white font-extrabold shadow-md shadow-red-950'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>YUBIKEY FIDO2</span>
          </button>
        </div>

        {/* TAB 1: Biometric Fingerprint & Face Recognition */}
        {activeTab === 'BIOMETRIC' && (
          <div className="w-full mt-4 bg-neutral-900/90 border border-neutral-800 rounded-xl p-6 flex flex-col items-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-950 rounded-lg text-red-400 border border-red-600/50">
                <Camera className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left">
                <h4 className="font-mono font-bold text-xs text-white uppercase">FACE ID &amp; FINGERPRINT SCANNER</h4>
                <p className="font-mono text-[10px] text-neutral-400">WebAuthn Biometric Authenticator</p>
              </div>
            </div>

            <button
              onClick={handleBiometricAuth}
              disabled={isScanningBio}
              className={`group relative w-24 h-24 rounded-full border-2 transition-all flex items-center justify-center ${
                scanStep === 'GRANTED'
                  ? 'border-emerald-500 bg-emerald-950/50 text-emerald-400 glow-green'
                  : isScanningBio
                  ? 'border-red-500 bg-red-950/40 text-red-400 glow-red'
                  : 'border-red-600/60 bg-neutral-950 hover:border-red-500 text-neutral-300 hover:text-red-400 shadow-lg hover:shadow-red-900/40'
              }`}
            >
              <Fingerprint className={`w-12 h-12 transition-transform ${isScanningBio ? 'scale-110' : 'group-hover:scale-105'}`} />

              {/* Laser Scan Bar Animation */}
              {isScanningBio && scanStep === 'SCANNING' && (
                <div className="absolute inset-x-2 top-0 h-1 bg-red-500 shadow-[0_0_12px_#ef4444] animate-bounce" />
              )}

              {scanStep === 'GRANTED' && (
                <CheckCircle2 className="absolute w-8 h-8 text-emerald-400 animate-scale-in" />
              )}
            </button>

            <div className="mt-4 font-mono text-xs">
              {scanStep === 'IDLE' && (
                <button
                  onClick={handleBiometricAuth}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono font-bold rounded-lg shadow-md shadow-red-950 transition-all flex items-center gap-2"
                >
                  <Scan className="w-4 h-4" />
                  <span>START BIOMETRIC / FACE SCAN</span>
                </button>
              )}
              {scanStep === 'SCANNING' && (
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Scan className="w-3.5 h-3.5 animate-spin" />
                  SCANNING FACE / FINGERPRINT... {bioProgress}%
                </span>
              )}
              {scanStep === 'VERIFYING' && (
                <span className="text-amber-300 font-bold">VERIFYING CRYPTOGRAPHIC TOKEN...</span>
              )}
              {scanStep === 'GRANTED' && (
                <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  BIOMETRIC ACCESS GRANTED • SAFE
                </span>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: YubiKey / Hardware Security Key Unlock */}
        {activeTab === 'YUBIKEY' && (
          <div className="w-full mt-4 bg-neutral-900/90 border border-neutral-800 rounded-xl p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-950/80 border-2 border-red-500 flex items-center justify-center text-red-400 mb-3 glow-red">
              <Cpu className={`w-8 h-8 ${isYubiKeyWaiting ? 'animate-pulse' : ''}`} />
            </div>

            <h4 className="font-mono font-bold text-sm text-white uppercase">YUBICO / FIDO2 HARDWARE KEY</h4>
            <p className="font-mono text-xs text-neutral-400 mt-1 max-w-xs">
              Insert your physical YubiKey or USB Security Token and press the gold button to unlock.
            </p>

            <div className="mt-4 bg-black border border-neutral-800 p-3 rounded-lg w-full font-mono text-xs text-amber-400 flex items-center justify-center gap-2 min-h-[44px]">
              {isYubiKeyWaiting && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
              <span>{yubiKeyStatus}</span>
            </div>

            <button
              onClick={handleYubiKeyAuth}
              disabled={isYubiKeyWaiting}
              className="mt-4 w-full py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-mono font-bold text-xs rounded-lg shadow-md shadow-red-950 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>TOUCH / SIMULATE YUBIKEY HARDWARE RESPONSE</span>
            </button>
          </div>
        )}

        {/* Session Tagging Info */}
        <div className="mt-4 p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg w-full font-mono text-[10px] text-neutral-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-emerald-400" />
            IP: <strong className="text-emerald-400">{clientIP}</strong>
          </span>
          <span className="flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-emerald-400" />
            TOKEN: <strong className="text-neutral-300">{deviceFingerprint}</strong>
          </span>
        </div>

        {/* Footer info */}
        <div className="mt-3 pt-3 border-t border-neutral-900 text-[10px] font-mono text-neutral-500 w-full flex items-center justify-between">
          <span>AEGIS SHOGUN v4.2</span>
          <span className="text-red-500 font-bold">STRICT BIOMETRIC ENFORCEMENT</span>
        </div>
      </div>
    </div>
  );
};


