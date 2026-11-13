import { getFaqs } from "@/faqs/getFaqs";
import { getSettings } from "@/lib/getSettings";
import { TestCallPanel } from "@/test-call/TestCallPanel";

export async function TestCallContent() {
  const [settings, faqs] = await Promise.all([getSettings(), getFaqs()]);
  const faqQuestions = faqs.filter((faq) => faq.isActive).map((faq) => faq.question);

  return <TestCallPanel agent={settings.agent} faqQuestions={faqQuestions} />;
}
