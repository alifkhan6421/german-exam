import { notFound } from "next/navigation";
import { DISCLAIMER } from "@/components/layout/disclaimer";

const PAGES: Record<string, { title: string; body: { h?: string; p: string }[] }> = {
  privacy: {
    title: "Privacy notice",
    body: [
      { p: "This notice explains how Prüfungsklar processes personal data under the EU General Data Protection Regulation (GDPR). The operator details in the imprint must be completed before launch." },
      { h: "What we process", p: "Account data (email, name, password handled by our authentication provider), exam goals, answers, written texts, voice recordings of speaking tasks and their transcripts, assessment results, subscription and payment status (card data is handled only by Stripe), and technical logs without answer content." },
      { h: "Why", p: "To provide practice exams and feedback (contract, Art. 6(1)(b) GDPR), to bill subscriptions (Art. 6(1)(b), (c)), and — only with your separate consent — to send writing and speaking responses to AI processors for automated feedback (Art. 6(1)(a))." },
      { h: "Voice recordings", p: "Recordings are stored in private storage, accessible only to you and, if you request a human review, to authorised examiners. They are deleted automatically after your chosen retention period (default 90 days) and when you delete your account." },
      { h: "Processors and transfers", p: "Supabase (database, authentication, storage — EU region recommended), Stripe (payments), Anthropic (AI feedback and content generation, only with consent), ElevenLabs (audio generation for exam content and, with consent, speech transcription), Vercel (hosting). Where data leaves the EU, transfers rely on the EU–US Data Privacy Framework or Standard Contractual Clauses. Data processing agreements must be signed with each processor before launch." },
      { h: "Your rights", p: "You can access, export and delete your data from Settings → Privacy, withdraw AI-processing consent at any time, and contact the operator or your data protection authority." },
    ],
  },
  terms: {
    title: "Terms of use",
    body: [
      { p: "Prüfungsklar provides practice materials for German language exams. Practice scores, pass estimates and AI feedback are indicative only and do not predict or replace an official result." },
      { h: "Subscriptions", p: "Paid plans renew automatically until cancelled in the billing portal. Access continues to the end of the paid period. Statutory withdrawal rights for consumers in the EU apply." },
      { h: "Fair use", p: "AI feedback is limited per month as shown on the pricing page. Automated misuse, scraping or sharing of accounts is not permitted." },
      { h: "Content", p: "All exam content on this platform is original and may not be redistributed." },
    ],
  },
  imprint: {
    title: "Imprint",
    body: [{ p: "Operator name, address, contact email, register entry and VAT ID must be added here before launch (§ 5 DDG)." }],
  },
  independence: {
    title: "Independence statement",
    body: [
      { p: DISCLAIMER },
      { p: "Our mock exams are original works written for this platform. We study the publicly documented exam formats to reproduce task types, timing and scoring as closely as possible, but we do not reproduce official test material." },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">{page.title}</h1>
      <div className="mt-6 flex flex-col gap-5 text-ink-700">
        {page.body.map((b, i) => (
          <section key={i}>
            {b.h && <h2 className="mb-1 font-semibold text-ink-900">{b.h}</h2>}
            <p className="leading-relaxed">{b.p}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
