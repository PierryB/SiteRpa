'use client'
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useEffect } from 'react';

export default function Execucao() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      alert("Você precisa estar logado para acessar essa página!");
      router.push('/');
    }
  }, [user, isLoading, router]);

  
}