// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
import Link from "next/link";

interface ConfirmedPageProps {
  searchParams?: Promise<{
    status?: string;
  }>;
}

export default async function ConfirmedPage({ searchParams }: ConfirmedPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const isSuccess = resolvedSearchParams?.status === "success";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-3 text-center text-2xl font-semibold">
          {isSuccess ? "Email Confirmed" : "Confirmation Failed"}
        </h1>
        <p className="mb-6 text-center text-sm text-gray-700">
          {isSuccess
            ? "Your email has been confirmed. Go back to the login page and sign in."
            : "This confirmation link is invalid or expired. Please request a new one from sign up."}
        </p>
        <Link
          href="/login"
          className="block w-full rounded-md bg-blue-600 py-2 text-center text-white hover:bg-blue-700"
        >
          Back to login
        </Link>
      </div>
    </main>
  );
}
