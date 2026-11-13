"use client";

import { useEffect, useRef, useState } from "react";
import { Room } from "livekit-client";
import { checkMicrophoneAccess } from "@/lib/checkMicrophoneAccess";
import { getTestCallToken } from "@/lib/getTestCallToken";
import { readCallErrorMessage } from "@/lib/readCallErrorMessage";
import { addTranscriptSegment } from "@/test-call/addTranscriptSegment";
import { waitForAgentJoin } from "@/test-call/waitForAgentJoin";
import { watchTestCallRoom } from "@/test-call/watchTestCallRoom";
import type { LiveLine } from "@/types/LiveLine";
import type { TestCall } from "@/types/TestCall";
import type { TestCallStatus } from "@/types/TestCallStatus";

const agentJoinTimeoutMilliseconds = 20_000;
const agentMissingMessage = "The voice agent did not join the call. Check the voice worker is running, then try again.";

export function useTestCall(): TestCall {
  const roomRef = useRef<Room | null>(null);
  const startedAtRef = useRef(0);
  const [status, setStatus] = useState<TestCallStatus>("idle");
  const [lines, setLines] = useState<LiveLine[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (status !== "live") return;
    const timer = window.setInterval(() => setSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000)), 500);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => () => void roomRef.current?.disconnect(), []);

  async function start() {
    setStatus("connecting");
    setLines([]);
    setSeconds(0);
    setErrorMessage("");
    const microphoneProblem = await checkMicrophoneAccess();
    if (microphoneProblem) return showFailure(microphoneProblem);
    await endPreviousCall();
    await joinRoom().catch(fail);
  }

  async function joinRoom() {
    const testCallToken = await getTestCallToken();
    const room = makeRoom();
    await room.connect(testCallToken.serverUrl, testCallToken.token);
    await room.localParticipant.setMicrophoneEnabled(true);
    const joinedAt = await waitForAgentJoin(room, agentJoinTimeoutMilliseconds);
    if (joinedAt === null) return showFailure(agentMissingMessage);
    startedAtRef.current = joinedAt;
    setIsMuted(false);
    setStatus("live");
  }

  function makeRoom(): Room {
    const room = new Room();
    watchTestCallRoom(room, {
      onEnded: () => setStatus((current) => (current === "failed" ? current : "ended")),
      onVolume: setVolume,
      onSegment: (segment) => setLines((current) => addTranscriptSegment(current, segment, (Date.now() - startedAtRef.current) / 1000)),
    });
    roomRef.current = room;
    return room;
  }

  async function endPreviousCall() {
    const previous = roomRef.current;
    roomRef.current = null;
    previous?.removeAllListeners();
    await previous?.disconnect().catch(() => undefined);
  }

  function fail(error: unknown) {
    console.error("Test call failed", error);
    showFailure(readCallErrorMessage(error));
  }

  function showFailure(message: string) {
    setStatus("failed");
    setErrorMessage(message);
    void roomRef.current?.disconnect();
  }

  async function toggleMute() {
    const room = roomRef.current;
    if (!room) return;
    await room.localParticipant.setMicrophoneEnabled(isMuted);
    setIsMuted(!isMuted);
  }

  return { status, lines, isMuted, volume, seconds, errorMessage, start, stop: async () => roomRef.current?.disconnect(), toggleMute };
}
