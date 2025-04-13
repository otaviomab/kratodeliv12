import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          Cardápio Digital Krato
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Plataforma completa para gerenciamento de cardápios digitais e pedidos online.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Link 
            href="/cardapio/restaurante-demo" 
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Visualizar Cardápio</h2>
            <p className="text-gray-600">Veja como os clientes visualizam seu cardápio digital</p>
          </Link>
          
          <Link 
            href="/admin/login" 
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Área Administrativa</h2>
            <p className="text-gray-600">Acesse o painel administrativo para gerenciar seu cardápio</p>
          </Link>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            © {new Date().getFullYear()} Cardápio Digital Krato. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </main>
  );
}
