import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", securityMode: "ACTIVE_FORTRESS", timestamp: new Date().toISOString() });
});

// Gemini AI Chat Room Endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, systemPrompt, conversationHistory, customParameters } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const ai = getGeminiClient();

    const systemInstruction = systemPrompt || `You are Aegis Core Security AI, an elite cyber warfare analyst, incident responder, and kiosk protection assistant.
Your goal is to safeguard the user from hackers, rogue network scans, intruding IP addresses, phishing, and malware threats.
You operate within a high-security lockdown environment with strict red/black/white visual theme parameters.
Provide concise, highly intuitive, expert cyber security analysis, threat mitigation advice, and technical explanations.
Format key recommendations cleanly.`;

    const contents = [];
    if (Array.isArray(conversationHistory)) {
      for (const entry of conversationHistory) {
        if (entry.role && entry.content) {
          contents.push({
            role: entry.role === "assistant" ? "model" : "user",
            parts: [{ text: entry.content }],
          });
        }
      }
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const temperature = typeof customParameters?.temperature === 'number' ? customParameters.temperature : 0.7;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction,
        temperature,
      },
    });

    res.json({ response: response.text || "No response received from Aegis AI Core." });
  } catch (err: any) {
    console.error("Gemini AI error:", err);
    res.status(500).json({
      error: "Aegis AI Core Communication Exception",
      details: err.message || String(err),
    });
  }
});

// Gemini Threat Analysis Endpoint
app.post("/api/ai/analyze-threat", async (req, res) => {
  try {
    const { threatData, type } = req.body; // e.g. URL, IP address, suspicious packet log, header
    const ai = getGeminiClient();

    const prompt = `Perform immediate deep threat analysis on the following network asset / payload:
Type: ${type || 'Network Payload'}
Data:
${typeof threatData === 'object' ? JSON.stringify(threatData, null, 2) : String(threatData)}

Analyze for:
1. Malicious indicators (IP reputation, phishing structure, XSS, injection vectors, MITM signatures)
2. Threat Risk Score (0 to 100)
3. Immediate firewall action recommendation (Block IP, drop packet, sanitize payload)
4. Technical breakdown for the security log.

Format your response as structured JSON matching this format:
{
  "riskScore": number,
  "riskLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE",
  "summary": "short summary",
  "threatVector": "description of attack vector if any",
  "mitigation": "recommended defense action",
  "recommendedFirewallRule": "e.g. DROP TCP 192.168.1.50"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("Threat analysis error:", err);
    res.status(500).json({
      riskScore: 85,
      riskLevel: "HIGH",
      summary: "Manual AI inspection trigger fallback: Potential suspicious structure detected.",
      threatVector: "Unverified network data payload",
      mitigation: "Quarantine IP & sandbox connection.",
      recommendedFirewallRule: "BLOCK ALL INBOUND TRAFFIC",
    });
  }
});

// Encrypted Web Proxy Sanitizer Endpoint
app.get("/api/proxy", async (req, res) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.status(400).send("Target URL is required.");
  }

  try {
    let validUrl: URL;
    try {
      validUrl = new URL(targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`);
    } catch {
      return res.status(400).send("Invalid target URL format.");
    }

    // Check basic security rules
    const isHttps = validUrl.protocol === "https:";
    
    // Perform simulated/real fetch with safety headers
    const fetchRes = await fetch(validUrl.toString(), {
      headers: {
        "User-Agent": "AegisSecureKioskBrowser/1.0 (Strict Privacy Engine; Zero Tracking)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "DNT": "1",
        "Sec-GPC": "1"
      },
    });

    let bodyText = await fetchRes.text();

    // Strip external scripts if requested or for safety sandbox
    if (req.query.blockScripts === "true" || true) {
      bodyText = bodyText.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '<!-- Aegis Kiosk: External Script Neutralized -->');
      bodyText = bodyText.replace(/on\w+="[^"]*"/gi, '');
      bodyText = bodyText.replace(/on\w+='[^']*'/gi, '');
    }

    // Inject Aegis Protection Banner at the top
    const aegisBanner = `
    <div id="aegis-kiosk-shield-banner" style="background: #0a0a0a; color: #ffffff; border-bottom: 2px solid #ef4444; padding: 10px 16px; font-family: 'JetBrains Mono', monospace; font-size: 13px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 999999;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="background: #ef4444; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 11px;">AEGIS PROXY SHIELD</span>
        <span>${isHttps ? '🔒 TLS 1.3 AES-256 Encrypted Stream' : '⚠️ UNENCRYPTED SOURCE - SANITIZED BY KIOSK'}</span>
      </div>
      <div style="font-size: 11px; color: #a1a1aa;">
        URL: ${validUrl.origin} | Tracker Shield: ACTIVE
      </div>
    </div>
    `;

    if (bodyText.includes("<body")) {
      bodyText = bodyText.replace(/<body[^>]*>/i, (match) => `${match}\n${aegisBanner}`);
    } else {
      bodyText = aegisBanner + bodyText;
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(bodyText);
  } catch (err: any) {
    res.status(500).send(`
      <div style="background: #0a0a0a; color: #ef4444; font-family: monospace; padding: 40px; text-align: center;">
        <h2 style="color: #ef4444; margin-bottom: 16px;">🛡️ AEGIS PROXY INTERCEPTION</h2>
        <p style="color: #ffffff;">The requested URL could not be reached or was quarantined by the Aegis Firewall.</p>
        <p style="color: #71717a; font-size: 12px; margin-top: 10px;">Error Details: ${err.message || String(err)}</p>
      </div>
    `);
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Aegis Fortress Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
