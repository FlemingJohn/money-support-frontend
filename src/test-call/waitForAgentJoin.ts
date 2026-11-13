import { type Room, RoomEvent } from "livekit-client";

export function waitForAgentJoin(room: Room, timeoutMilliseconds: number): Promise<number | null> {
  const hasAgent = () => [...room.remoteParticipants.values()].some((participant) => participant.isAgent);
  if (hasAgent()) return Promise.resolve(Date.now());
  return new Promise((resolve) => {
    const timer = window.setTimeout(() => finish(null), timeoutMilliseconds);
    const handleJoin = () => {
      if (hasAgent()) finish(Date.now());
    };
    function finish(joinedAt: number | null) {
      window.clearTimeout(timer);
      room.off(RoomEvent.ParticipantConnected, handleJoin);
      resolve(joinedAt);
    }
    room.on(RoomEvent.ParticipantConnected, handleJoin);
  });
}
