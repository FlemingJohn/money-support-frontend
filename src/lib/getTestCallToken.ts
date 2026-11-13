import { sendToBackend } from "@/lib/sendToBackend";
import type { TestCallToken } from "@/types/TestCallToken";

export function getTestCallToken(): Promise<TestCallToken> {
  return sendToBackend<TestCallToken>("POST", "/test-calls");
}
