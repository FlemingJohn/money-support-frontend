import type { TextStreamReader } from "livekit-client";
import type { Speaker } from "@/types/Speaker";
import type { TranscriptSegment } from "@/types/TranscriptSegment";

const segmentIdAttribute = "lk.segment_id";
const finalAttribute = "lk.transcription_final";

export async function readTranscriptStream(reader: TextStreamReader, speaker: Speaker, onSegment: (segment: TranscriptSegment) => void): Promise<void> {
  const attributes = reader.info.attributes ?? {};
  const id = attributes[segmentIdAttribute] ?? reader.info.id;
  const isMarkedFinal = attributes[finalAttribute] === "true";
  let text = "";
  for await (const chunk of reader) {
    text += chunk;
    onSegment({ id, speaker, text, isFinal: isMarkedFinal });
  }
  if (speaker === "agent" && !isMarkedFinal) onSegment({ id, speaker, text, isFinal: true });
}
