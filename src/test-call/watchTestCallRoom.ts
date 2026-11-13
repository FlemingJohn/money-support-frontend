import { type Room, RoomEvent, Track } from "livekit-client";
import { readTranscriptStream } from "@/test-call/readTranscriptStream";
import type { TestCallRoomHandlers } from "@/types/TestCallRoomHandlers";

const transcriptionTopic = "lk.transcription";

export function watchTestCallRoom(room: Room, handlers: TestCallRoomHandlers): void {
  room.on(RoomEvent.Disconnected, handlers.onEnded);
  room.on(RoomEvent.TrackSubscribed, (track) => {
    if (track.kind === Track.Kind.Audio) document.body.appendChild(track.attach());
  });
  room.on(RoomEvent.TrackUnsubscribed, (track) => track.detach().forEach((element) => element.remove()));
  room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
    const agentLevels = speakers.filter((speaker) => speaker.isAgent).map((speaker) => speaker.audioLevel);
    handlers.onVolume(Math.max(0, ...agentLevels));
  });
  room.registerTextStreamHandler(transcriptionTopic, (reader, participantInfo) => {
    const speaker = participantInfo.identity === room.localParticipant.identity ? "caller" : "agent";
    void readTranscriptStream(reader, speaker, handlers.onSegment);
  });
}
