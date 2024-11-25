'use client'
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';

type Tarefa = {
  id: string;
  status: string;
  mensagem: string;
  opcao: string;
  dataHora: string;
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
          const userEmail = user.email ? user.email : '';
          const url = `${process.env.NEXT_PUBLIC_API_URL}/minhas-tarefas`;

          const tarefasResponse = await fetch(url, {
            headers: {
              'Content-Type': 'application/json',
              'Email': userEmail,
            },
          });

          if (!tarefasResponse.ok) {
            throw new Error('Erro ao buscar as tarefas.');
          }

          const tarefasData = await tarefasResponse.json();
          setTarefas(tarefasData);
        } catch (error) {
          console.error('Erro ao buscar as tarefas:', error);
        } finally {
          setLoadingTarefas(false);
        }
      }
    };
    fetchTarefas();
  }, [user]);

  const formatDataHora = (dataHora: string) => {
    try {
      const [data, hora] = dataHora.split(', ');

      const dataParts = data.split('/');
      let day, month, year;

      if (dataParts.length === 3) {
        if (parseInt(dataParts[0], 10) <= 12 && parseInt(dataParts[1], 10) <= 31) {
          month = dataParts[0];
          day = dataParts[1];
          year = dataParts[2];
        } else {
          day = dataParts[0];
          month = dataParts[1];
          year = dataParts[2];
        }
      } else {
        throw new Error('Formato de data inválido');
      }

      const [time, period] = hora.split(' ');
      let [hours, minutes, seconds] = time.split(':');

      if (period && (period.toUpperCase() === 'PM' && parseInt(hours, 10) < 12)) {
        hours = (parseInt(hours, 10) + 12).toString();
      } else if (period && period.toUpperCase() === 'AM' && parseInt(hours, 10) === 12) {
        hours = '00';
      }

      const formattedDateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hours}:${minutes}:${seconds}`;
      const dateObj = new Date(formattedDateString);

      if (isNaN(dateObj.getTime())) {
        throw new Error('Data inválida');
      }

      return {
        data: dateObj.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
        hora: dateObj.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      };
    } catch (error) {
      return { data: 'Data inválida', hora: 'Hora inválida' };
    }
  };

  const handleView = async (id: string) => {
    if (!id) {
      alert('ID da execução não encontrado.');
      return;
    }
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/status/${id}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Email': user?.email || '',
        },
      });
  
      if (response.ok) {
        const contentType = response.headers.get('Content-Type');
        const contentDisposition = response.headers.get('Content-Disposition');
        const fileName = contentDisposition
          ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
          : `arquivo_${Date.now()}`;
  
        if (contentType === 'application/pdf' || contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          const blob = await response.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = fileName || `arquivo_${Date.now()}`;
          link.click();
        } else {
          const data = await response.json();
          alert(`${data.mensagem}`);
        }
      } else {
        alert('Erro ao abrir a execução.');
      }
    } catch (error) {
      console.error('Erro ao abrir a execução:', error);
      alert('Erro inesperado ao abrir a execução.');
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Você tem certeza que deseja excluir esta execução?');
    if (!confirmDelete) return;
  
    if (!id || id === 'undefined') {
      alert('ID da execução não é válido.');
      return;
    }
  
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/excluir/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Email': user?.email || '',
        },
      });
  
      if (response.ok) {
        setTarefas(tarefas.filter(tarefa => tarefa.id !== id));
      } else {
        alert('Erro ao excluir a execução.');
      }
    } catch (error) {
      console.error('Erro ao excluir a execução:', error);
    }
  };

  if (isLoading || loadingTarefas) {
    return <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-mono)]">Carregando...</div>;
  }

  if (error) {
    return <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-mono)]">Erro: {error.message}</div>;
  }

  if (user) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-20 font-[family-name:var(--font-geist-mono)]">
        <h1 className="flex flex-col text-3xl gap-8 row-start-4 sm:items-start">
          Processamentos
        </h1>

        <div className="flex flex-col p-8 text-xl row-start-5 items-center justify-center">
          {tarefas.length === 0 ? (
            <p>Você não tem tarefas pendentes...</p>
          ) : (
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">Nome da Execução</th>
                  <th className="border border-gray-300 p-2">Data</th>
                  <th className="border border-gray-300 p-2">Hora</th>
                  <th className="border border-gray-300 p-2">Status</th>
                  <th className="border border-gray-300 p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {tarefas.map((tarefa) => {
                  const { data, hora } = formatDataHora(tarefa.dataHora);
                  console.log(tarefa.dataHora);
                  console.log(data + "|||" + hora);
                  return (
                    <tr key={tarefa.id} className="text-center">
                      <td className="border border-gray-300 p-2">{tarefa.opcao}</td>
                      <td className="border border-gray-300 p-2">{data}</td>
                      <td className="border border-gray-300 p-2">{hora}</td>
                      <td className="border border-gray-300 p-2">{tarefa.status}</td>
                      <td className="border border-gray-300 p-2">
                        <button 
                          className="mr-2 bg-blue-500 text-white px-4 py-1 rounded"
                          onClick={() => handleView(tarefa.id)}
                        >
                          Abrir
                        </button>
                        <button 
                          className="bg-red-500 text-white px-4 py-1 rounded"
                          onClick={() => handleDelete(tarefa.id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  return null;
}
