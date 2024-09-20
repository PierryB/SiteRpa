'use client'
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useEffect } from 'react';

export default function Processamentos() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      alert("Você precisa estar logado para acessar essa página!");
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">Carregando...</div>;
  }

  if (user) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center justify-center sm:items-start text-4xl font-[family-name:var(--font-geist-mono)]">
          Bem vindo à página de Processamentos
        </main>
      </div>
    );
  }

  return null;
}
