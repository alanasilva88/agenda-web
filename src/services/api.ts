import type { Contato } from "../types/contato";

const BASE_URL = import.meta.env.VITE_API_URL;

export const contatoService = {
  // Buscar todos os contatos
  listar: async (): Promise<Contato[]> => {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error("Erro ao buscar contatos");
    return response.json();
  },

  // Criar um novo contato
  criar: async (contato: Contato): Promise<Contato> => {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contato),
    });
    if (!response.ok) throw new Error("Erro ao criar contato");
    return response.json();
  },

  // Deletar um contato por ID
  deletar: async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar contato");
  }
};