'use client'
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';

type Tarefa = {
  id: string;
  status: string;
  mensagem: string;
};

export default function Processamentos() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loadingTarefas, setLoadingTarefas] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      alert("Você precisa estar logado para acessar essa página!");
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchTarefas = async () => {
      if (user) {
        try {
          const response = await fetch('/api/auth/me');
          const data = await response.json();
          const accessToken = data.token;
          const url = `${process.env.NEXT_PUBLIC_API_URL}/minhas-tarefas`;

          const tarefasResponse = await fetch(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (!tarefasResponse.ok) {
            throw new Error('Erro ao buscar as tarefas');
          }

          const tarefasData = await tarefasResponse.json();
          setTarefas(tarefasData);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingTarefas(false);
        }
      }
    };
    fetchTarefas();
  }, [user]);

  if (isLoading || loadingTarefas) {
    return <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-mono)]">Carregando...</div>;
  } else if (error) {
    return <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-mono)]">Erro: {error.message}</div>;
  }

  if (user) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-20 font-[family-name:var(--font-geist-mono)]" style={{ userSelect: 'none' }}>
          <h1 className="flex flex-col text-3xl gap-8 row-start-4 sm:items-start">
            Processamentos
          </h1>

          <div className="flex flex-col p-8 text-xl row-start-5 items-center justify-center">
            {tarefas.length === 0 ? (
              <p>Você não tem tarefas pendentes...</p>
            ) : (
              <ul>
                {tarefas.map((tarefa) => (
                  <li key={tarefa.id}>
                    Tarefa {tarefa.id}: {tarefa.status} - {tarefa.mensagem}
                  </li>
                ))}
              </ul>
            )}
          </div>
      </div>
    );
  }

  return null;
}
