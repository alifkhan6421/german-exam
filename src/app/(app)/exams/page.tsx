import { ProviderCards } from "@/components/catalogue/provider-cards";
import { PageHeader } from "@/components/ui/page-header";

export const metadata = { title: "Exams" };

export default function ExamsPage() {
  return (
    <>
      <PageHeader title="Choose a provider" description="Goethe and telc exams have different formats, timing and scoring. Pick the exam you are registered for." />
      <ProviderCards />
    </>
  );
}
