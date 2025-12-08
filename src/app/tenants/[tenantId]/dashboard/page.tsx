export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Seu Dashboard</h1>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Meus Bots</h2>
          <ul>
            <li className="border-b py-3 flex justify-between items-center">
              <span>Meu Primeiro Bot</span>
              <span className="text-sm text-gray-500">Criado agora mesmo</span>
            </li>
            {/* Additional bots will be listed here in the future */}
          </ul>
        </div>
      </div>
    </main>
  );
}
