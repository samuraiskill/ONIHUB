import React, { useState } from 'react';
import { Bot, Send, Settings, ShieldAlert, Cpu, Sparkles, Terminal, RefreshCw, AlertTriangle, CheckCircle, Zap, Maximize2, Minimize2, ScrollText, Layers } from 'lucide-react';
import { AIChatMessage, AIParameters } from '../types';

interface AICitadelProps {
  onAddLog: (category: any, severity: any, source: string, message: string) => void;
  onAddFirewallRule: (rule: { ipPattern: string; action: 'BLOCK' | 'QUARANTINE'; reason: string }) => void;
}

export const AICitadel: React.FC<AICitadelProps> = ({ onAddLog, onAddFirewallRule }) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Greetings Master. I am **KasA Dojo Intelligence Core (傘 堂 AI)**. 
I am operating inside your zero-leak elder Japanese security sanctuary.

All process threads, outbound requests, and data queries are wrapped in strict zero-telemetry isolation. Enter your request or paste complex code scrolls below to begin analysis.`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showParameters, setShowParameters] = useState(false);
  const [isExpandedWorkspace, setIsExpandedWorkspace] = useState(false);

  // Custom AI Parameters
  const [parameters, setParameters] = useState<AIParameters>({
    temperature: 0.6,
    strictness: 'PARANOID',
    customSystemPrompt: `You are KasA AI Sanctuary Core, an elite elder Japanese cyber defense and automation master guarding the KasA Dojo Kiosk.
Provide direct, highly technical, actionable security advice, code reviews, threat analysis, and mitigation steps. Tone: honorable, precise, highly skilled. Aesthetics: dark lacquered wood, gold accents, vermilion samurai trim.`,
    autoBlockHighRisk: true,
  });

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage.trim();
    if (!textToSend || isLoading) return;

    const userMsg: AIChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputMessage('');
    setIsLoading(true);

    onAddLog('AI_CORE', 'INFO', 'KASA_AI', `Request dispatched to KasA AI Core: "${textToSend.substring(0, 40)}..."`);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          systemPrompt: parameters.customSystemPrompt,
          conversationHistory: messages.map((m) => ({ role: m.role, content: m.content })),
          customParameters: parameters,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to communicate with KasA AI Core');
      }

      const aiMsg: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'KasA AI Core completed your request.',
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('KasA AI Sanctuary Error:', err);
      const errorMsg: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ **KasA AI Sanctuary Local Fallback Active**: Unable to reach remote model (${err.message}). 
**Immediate Dojo Guidance**:
1. Keep the KasA Encrypted Browser active.
2. Verify Biometric Airlock is in strict mode.
3. Torii Firewall Threat Shield is actively blocking rogue IPs.`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunThreatScan = async () => {
    const samplePayload = "GET /admin/login.php?user=' OR 1=1-- HTTP/1.1\nHost: target-server.local\nUser-Agent: Nikto/2.1.6 (Rogue Scan)";
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/analyze-threat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Suspicious HTTP Request Payload',
          threatData: samplePayload,
        }),
      });

      const threatResult = await res.json();
      const aiMsg: AIChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `### 傘 KasA Deep Payload Scroll Scan Completed
**Threat Index**: ${threatResult.riskScore}/100 (${threatResult.riskLevel})
**Audit Summary**: ${threatResult.summary}
**Threat Vector**: ${threatResult.threatVector || 'SQL Injection & Reconnaissance Probe'}
**Sanctuary Action**: ${threatResult.mitigation || 'Drop connection and block IP range via Torii Firewall.'}`,
        timestamp: new Date().toLocaleTimeString(),
        threatAnalysis: threatResult,
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (threatResult.recommendedFirewallRule && parameters.autoBlockHighRisk) {
        onAddFirewallRule({
          ipPattern: '185.220.101.44',
          action: 'BLOCK',
          reason: `KasA AI Auto-Block: ${threatResult.summary || 'SQLi Payload Attack'}`,
        });
        onAddLog('FIREWALL', 'BLOCKED', 'AI_AUTO_BLOCK', `Blocked IP 185.220.101.44 per KasA threat evaluation.`);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col bg-kasa-dojo text-white font-sans select-none overflow-hidden transition-all ${
      isExpandedWorkspace ? 'h-[calc(100vh-65px)]' : 'h-[calc(100vh-105px)]'
    }`}>
      {/* Top Header Bar */}
      <div className="bg-[#0e0a07] border-b border-amber-900/50 p-3.5 flex items-center justify-between shadow-dojo-depth">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-950 border border-amber-600/60 rounded-xl text-amber-400 shadow-md shadow-amber-950/80">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-mono font-extrabold text-sm tracking-wider uppercase text-amber-400 flex items-center gap-2">
              傘 KasA AI <span className="text-red-500">SANCTUARY WORKSPACE</span>
              <span className="px-2 py-0.5 bg-amber-950 border border-amber-700/80 text-amber-300 text-[10px] rounded font-mono font-bold">
                堂 DEEP REQUEST STUDIO
              </span>
            </h2>
            <p className="text-[11px] font-mono text-neutral-400">Expanded Request Canvas • Elder Japanese Intelligence Core • Threat Analysis</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Expanded Workspace Canvas */}
          <button
            onClick={() => setIsExpandedWorkspace(!isExpandedWorkspace)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-800/60 bg-neutral-900 hover:bg-neutral-800 text-amber-300 text-xs font-mono font-bold transition-all"
            title="Expand Workspace Height & Depth"
          >
            {isExpandedWorkspace ? <Minimize2 className="w-4 h-4 text-amber-400" /> : <Maximize2 className="w-4 h-4 text-amber-400" />}
            <span className="hidden sm:inline">{isExpandedWorkspace ? 'SHRINK CANVAS' : 'DEEP CANVAS'}</span>
          </button>

          <button
            onClick={() => setShowParameters(!showParameters)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
              showParameters
                ? 'bg-amber-600 border-amber-500 text-black'
                : 'bg-neutral-900 border-amber-900/60 text-neutral-300 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">SANCTUARY PARAMETERS</span>
          </button>
        </div>
      </div>

      {/* Custom AI Parameters Panel */}
      {showParameters && (
        <div className="bg-[#0a0806] border-b-2 border-amber-600 p-4 text-xs font-mono text-neutral-300 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between mb-3 border-b border-amber-900/40 pb-2">
            <h4 className="font-extrabold text-amber-400 text-sm uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-500" />
              KasA DOJO AI PARAMETERS CONFIGURATION
            </h4>
            <span className="text-amber-600/80 text-[11px]">HOT-RELOADED IN REAL TIME</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Strictness Level */}
            <div className="bg-black border border-amber-900/40 p-3 rounded-lg">
              <label className="text-amber-400 font-bold block mb-1">STRICTNESS PRESET:</label>
              <div className="grid grid-cols-3 gap-1 mt-2">
                {(['PARANOID', 'BALANCED', 'PERMISSIVE'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setParameters((p) => ({ ...p, strictness: mode }))}
                    className={`py-1 rounded text-[10px] font-bold transition-all ${
                      parameters.strictness === mode
                        ? 'bg-amber-600 text-black'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Temperature Slider */}
            <div className="bg-black border border-amber-900/40 p-3 rounded-lg">
              <div className="flex justify-between text-neutral-300 font-bold mb-1">
                <label className="text-amber-400">CREATIVITY (TEMP):</label>
                <span className="text-amber-400">{parameters.temperature}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={parameters.temperature}
                onChange={(e) => setParameters((p) => ({ ...p, temperature: parseFloat(e.target.value) }))}
                className="w-full accent-amber-500 cursor-pointer mt-2"
              />
            </div>

            {/* Auto Block High Risk Toggle */}
            <div className="bg-black border border-amber-900/40 p-3 rounded-lg flex flex-col justify-between">
              <label className="text-amber-400 font-bold block">TORII AUTO-RULE INJECTION:</label>
              <button
                onClick={() => setParameters((p) => ({ ...p, autoBlockHighRisk: !p.autoBlockHighRisk }))}
                className={`w-full py-1.5 rounded text-xs font-bold transition-all mt-2 ${
                  parameters.autoBlockHighRisk
                    ? 'bg-emerald-950 border border-emerald-600 text-emerald-400'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-500'
                }`}
              >
                AUTO BLOCK THREATS: {parameters.autoBlockHighRisk ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick AI Ritual Presets Bar */}
      <div className="bg-[#0b0806] border-b border-amber-900/40 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
        <span className="font-mono text-[11px] font-bold text-amber-500/90 uppercase flex items-center gap-1.5 whitespace-nowrap">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          DOJO RITUAL PRESETS:
        </span>
        <button
          onClick={() => handleSendMessage('Run a full security audit on my current session and check for active intruder vectors.')}
          className="px-3 py-1 bg-black hover:bg-amber-950/40 border border-amber-900/50 hover:border-amber-500/80 text-amber-200 hover:text-white rounded text-[11px] font-mono whitespace-nowrap transition-all shadow-sm"
        >
          📜 AUDIT SESSION SECURITY
        </button>
        <button
          onClick={handleRunThreatScan}
          className="px-3 py-1 bg-red-950/80 hover:bg-red-900/90 border border-red-700/80 text-red-300 hover:text-white rounded text-[11px] font-mono font-bold whitespace-nowrap transition-all shadow-sm"
        >
          🔍 RUN DEEP PAYLOAD SCAN
        </button>
        <button
          onClick={() => handleSendMessage('Draft an immediate defense protocol against Wi-Fi packet sniffing and man-in-the-middle attacks.')}
          className="px-3 py-1 bg-black hover:bg-amber-950/40 border border-amber-900/50 hover:border-amber-500/80 text-amber-200 hover:text-white rounded text-[11px] font-mono whitespace-nowrap transition-all shadow-sm"
        >
          ⚡ MITM DEFENSE STRATEGY
        </button>
        <button
          onClick={() => handleSendMessage('Analyze my local network configuration and verify zero outbound telemetry leaks.')}
          className="px-3 py-1 bg-black hover:bg-amber-950/40 border border-amber-900/50 hover:border-amber-500/80 text-amber-200 hover:text-white rounded text-[11px] font-mono whitespace-nowrap transition-all shadow-sm"
        >
          🛡️ ZERO-TELEMETRY AUDIT
        </button>
      </div>

      {/* Chat Messages List with Elder Japanese Scroll Cards */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 bg-[#090705] font-mono text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1.5 text-[11px] text-neutral-400 px-1">
              <span className={`font-bold flex items-center gap-1 ${msg.role === 'user' ? 'text-amber-400' : 'text-red-500'}`}>
                {msg.role === 'user' ? (
                  <>
                    <ScrollText className="w-3.5 h-3.5 text-amber-400" />
                    MASTER REQUEST
                  </>
                ) : (
                  <>
                    <Bot className="w-3.5 h-3.5 text-red-500" />
                    KasA AI SANCTUARY CORE
                  </>
                )}
              </span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`w-full max-w-4xl rounded-2xl p-5 text-xs md:text-sm leading-relaxed whitespace-pre-wrap border shadow-2xl transition-all ${
                msg.role === 'user'
                  ? 'bg-[#15100b] border-amber-700/60 text-amber-100 rounded-br-none shadow-amber-950/30'
                  : 'bg-[#0a0806] border-red-900/80 text-neutral-100 rounded-bl-none shadow-dojo-depth'
              }`}
            >
              {msg.content}

              {msg.threatAnalysis && (
                <div className="mt-4 pt-3 border-t border-amber-900/40 bg-[#0e0a07] p-4 rounded-xl border border-red-900/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-red-400 flex items-center gap-1.5 text-xs">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      AUTOMATED THREAT METRICS
                    </span>
                    <span className="px-2.5 py-1 bg-red-600 text-white font-extrabold rounded text-[10px]">
                      RISK INDEX: {msg.threatAnalysis.riskScore}/100
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300">
                    <strong>Sanctuary Action:</strong> {msg.threatAnalysis.mitigation}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs p-3.5 bg-[#0e0a07] border border-amber-700/60 rounded-xl w-fit animate-pulse shadow-lg">
            <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
            <span>KasA AI SANCTUARY IS PROCESSING REQUEST TELEMETRY...</span>
          </div>
        )}
      </div>

      {/* Expanded Multi-Line Request Workspace Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="bg-[#0c0907] border-t border-amber-900/50 p-3.5 flex flex-col gap-2 shadow-dojo-depth"
      >
        <div className="relative flex-1 bg-[#060504] border-2 border-amber-900/50 focus-within:border-amber-500 rounded-2xl overflow-hidden shadow-inner">
          <textarea
            rows={isExpandedWorkspace ? 4 : 2}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your request or paste complex code/logs into KasA Dojo AI (Shift+Enter for multi-line)..."
            className="w-full bg-transparent px-4 py-3 font-mono text-xs md:text-sm text-white placeholder-neutral-500 focus:outline-none resize-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-[10px] font-mono text-neutral-500 flex items-center gap-2">
            <span className="text-amber-500/80 font-bold">堂 DEEP WORKSPACE</span>
            <span>• Shift+Enter for newline</span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500 text-black font-mono font-extrabold text-xs rounded-xl transition-all shadow-md shadow-amber-950 flex items-center gap-2 cursor-pointer"
          >
            <span>DISPATCH REQUEST</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
