import type { LiveLine } from "@/types/LiveLine";
import type { TranscriptSegment } from "@/types/TranscriptSegment";

export function addTranscriptSegment(lines: LiveLine[], segment: TranscriptSegment, secondsFromStart: number): LiveLine[] {
  const lastLine = lines.at(-1);
  if (lastLine?.speaker === segment.speaker) {
    return [...lines.slice(0, -1), continueLine(lastLine, segment)];
  }
  const finalText = segment.isFinal ? segment.text : "";
  return [...lines, { id: lines.length, segmentId: segment.id, speaker: segment.speaker, text: segment.text, finalText, secondsFromStart, isFinal: segment.isFinal }];
}

function continueLine(line: LiveLine, segment: TranscriptSegment): LiveLine {
  if (line.segmentId === segment.id && line.isFinal) return line;
  const text = joinText(line.finalText, segment.text);
  return { ...line, segmentId: segment.id, text, finalText: segment.isFinal ? text : line.finalText, isFinal: segment.isFinal };
}

function joinText(start: string, end: string): string {
  return [start, end].filter((part) => part.trim() !== "").join(" ");
}
