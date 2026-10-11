import { RegisterForm } from "@/components/auth/auth-forms";

export const metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Create your free account</h1>
        <p className="mt-1 text-sm text-ink-500">Includes a complete Goethe A1 mock exam and sample section practice.</p>
      </div>
      <RegisterForm />
    </div>
  );
}
