import { useEffect, useState } from "react";
import { contatoService } from "./services/api";
import type { Contato } from "./types/contato";
import { Plus, Trash2, Mail, Phone, User, X } from "lucide-react";

export default function App() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para o Drawer e Formulário
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [novoContato, setNovoContato] = useState<Contato>({
    nome: "",
    telefone: "",
    email: ""
  });

  useEffect(() => {
    carregarContatos();
  }, []);

  const carregarContatos = async () => {
    try {
      setLoading(true);
      const dados = await contatoService.listar();
      setContatos(dados);
    } catch (erro) {
      console.error("Erro ao carregar contatos:", erro);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async (id: number | undefined) => {
    if (!id) return;
    if (confirm("Tem certeza que deseja remover este contato?")) {
      try {
        await contatoService.deletar(id);
        setContatos(contatos.filter(c => c.id !== id));
      } catch (erro) {
        alert("Não foi possível deletar o contato.");
      }
    }
  };

  const handleCriarContato = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoContato.nome || !novoContato.telefone || !novoContato.email) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const contatoSalvo = await contatoService.criar(novoContato);
      // Adiciona o novo contato retornado pelo Java (com ID gerado) na lista local
      setContatos([...contatos, contatoSalvo]);
      
      // Reseta o formulário e fecha a gaveta lateral
      setNovoContato({ nome: "", telefone: "", email: "" });
      setIsDrawerOpen(false);
    } catch (erro) {
      alert("Erro ao salvar o contato no backend Java.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans antialiased relative overflow-x-hidden">
      
      {/* HEADER */}
      <header className="border-b border-zinc-900 bg-zinc-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/20">
              A
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight">Agenda Hexagonal</h1>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">API Java Online</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex items-center gap-2 bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium text-sm px-4 h-9 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Novo Contato
          </button>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        
        {/* CARDS DE MÉTRICAS */}
        <div className="flex items-center justify-center w-full">
          <div className="bg-zinc-900 border border-zinc-800/80 p-6 rounded-xl flex items-center justify-between w-full max-w-md">
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Total de Contatos</p>
              <h3 className="text-3xl font-bold tracking-tight mt-1 text-zinc-100">{contatos.length}</h3>
            </div>
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-indigo-400"> 
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* TABELA / LISTAGEM */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-zinc-800 bg-zinc-900/50">
            <h2 className="text-lg font-semibold text-zinc-100">Seus Contatos</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-zinc-500 text-sm">Carregando contatos...</div>
          ) : contatos.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 text-sm">
              Nenhum contato encontrado. Clique em "Novo Contato" para começar.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/40 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    <th className="py-3 px-6">Nome</th>
                    <th className="py-3 px-6">Telefone</th>
                    <th className="py-3 px-6">E-mail</th>
                    <th className="py-3 px-6 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-sm text-zinc-300">
                  {contatos.map((contato) => (
                    <tr key={contato.id} className="hover:bg-zinc-800/30 transition-colors group">
                      <td className="py-4 px-6 font-medium text-zinc-100 flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-300 group-hover:border-indigo-500/50 transition-colors">
                          {contato.nome.charAt(0).toUpperCase()}
                        </div>
                        {contato.nome}
                      </td>
                      <td className="py-4 px-6 text-zinc-400 font-mono text-xs">
                        <span className="inline-flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-zinc-600" />
                          {contato.telefone}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-zinc-400">
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-zinc-600" />
                          {contato.email}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDeletar(contato.id)}
                          className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                          title="Excluir contato"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* 🪙 EFEITO DRAWER SIDEBAR (PAINEL LATERAL FLUTUANTE) */}
      {/* Fundo Escurecido (Overlay) */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Painel da Gaveta */}
      <div className={`fixed right-0 top-0 bottom-0 w-full max-w-md bg-zinc-900 border-l border-zinc-800 p-6 shadow-2xl transition-transform duration-300 ease-in-out z-50 ${
        isDrawerOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">Adicionar Novo Contato</h2>
            <p className="text-xs text-zinc-500">Insira as informações básicas para salvar na arquitetura.</p>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORMULÁRIO */}
        <form onSubmit={handleCriarContato} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Nome Completo</label>
            <input 
              type="text" 
              placeholder="Ex: José da Silva"
              value={novoContato.nome}
              onChange={e => setNovoContato({...novoContato, nome: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 h-10 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Telefone</label>
            <input 
              type="text" 
              placeholder="Ex: 81999999999"
              value={novoContato.telefone}
              onChange={e => setNovoContato({...novoContato, telefone: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 h-10 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">E-mail</label>
            <input 
              type="email" 
              placeholder="Ex: exemplo@email.com"
              value={novoContato.email}
              onChange={e => setNovoContato({...novoContato, email: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 h-10 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="pt-4 flex items-center gap-3 border-t border-zinc-800 mt-6">
            <button 
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="w-full h-10 border border-zinc-800 hover:bg-zinc-800 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 text-zinc-50 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-600/10 cursor-pointer"
            >
              Salvar Contato
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}