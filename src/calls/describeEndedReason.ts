const descriptions: Record<string, string> = {
  callerHungUp: "Caller",
  agentEndedCall: "Agent",
  handedOff: "Agent, after handing off",
  silenceTimeout: "Silence",
  timeLimit: "Longest call time reached",
  error: "Error",
};

export function describeEndedReason(endedReason: string | null): string {
  if (!endedReason) return "—";
  return descriptions[endedReason] ?? endedReason.replaceAll("-", " ");
}
