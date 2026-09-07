export type ActiveRoom = 'browser' | 'ai-citadel' | 'firewall' | 'apk-export' | 'audit-logs';

export type SecurityStatus = 'FORTRESS' | 'MONITORING' | 'BREACH_ALERT' | 'AIRLOCK_LOCKED';

export interface SecurityEventLog {
  id: string;
  timestamp: string;
  category: 'AUTHENTICATION' | 'FIREWALL' | 'PROXIED_BROWSER' | 'AI_CORE' | 'PRIVACY_SCREEN' | 'AIRLOCK';
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'BLOCKED';
  source: string;
  message: string;
  ipAddress?: string;
  payloadDetails?: string;
}

export interface FirewallRule {
  id: string;
  ipPattern: string;
  action: 'BLOCK' | 'QUARANTINE' | 'ALLOW';
  protocol: 'ALL' | 'TCP' | 'UDP' | 'ICMP';
  reason: string;
  addedAt: string;
  hitsCount: number;
}

export interface NetworkPacket {
  id: string;
  timestamp: string;
  sourceIP: string;
  destPort: number;
  protocol: 'TCP' | 'UDP' | 'HTTP' | 'HTTPS';
  payloadSummary: string;
  threatScore: number; // 0 to 100
  status: 'CLEARED' | 'SUSPICIOUS' | 'BLOCKED';
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  threatAnalysis?: {
    riskScore: number;
    riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';
    summary: string;
    threatVector?: string;
    mitigation?: string;
    recommendedFirewallRule?: string;
  };
}

export interface AIParameters {
  temperature: number;
  strictness: 'PARANOID' | 'BALANCED' | 'PERMISSIVE';
  customSystemPrompt: string;
  autoBlockHighRisk: boolean;
}
