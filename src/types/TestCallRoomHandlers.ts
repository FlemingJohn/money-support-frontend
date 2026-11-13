import type { TranscriptSegment } from "@/types/TranscriptSegment";

export interface TestCallRoomHandlers {
  onEnded: () => void;
  onVolume: (volume: number) => void;
  onSegment: (segment: TranscriptSegment) => void;
}
