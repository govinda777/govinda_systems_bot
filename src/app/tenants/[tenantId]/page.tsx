import Link from 'next/link';

// This page is simplified to avoid the React bug with dynamic params.
// It no longer fetches tenant data but allows the onboarding flow to proceed.
export default function TenantPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold">
          Bem-vindo à nossa plataforma
        </h1>
        <p className="mt-4 text-lg">
          Vamos configurar seu primeiro bot.
        </p>
        <Link
          href="/onboarding"
          className="mt-8 inline-block rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Começar
        </Link>
      </div>
    </main>
  );
}
