import type { Speaker } from "@/types/Speaker";

export interface TranscriptSegment {
  id: string;
  speaker: Speaker;
  text: string;
  isFinal: boolean;
}
