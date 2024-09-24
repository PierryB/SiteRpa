'use client';
import Link from "next/link";
import ThemeSwitch from "./ThemeSwitch";
import { useUser } from "@auth0/nextjs-auth0/client";
// import { useRouter } from "next/navigation";

export default function Header()
{
    const {user} = useUser();
    // const router = useRouter();

    // if (user)
    // {
    //     router.push('/rpa')
    // }

    return (
        <nav className="flex items-center justify-between mx-auto p-5 font-[family-name:var(--font-geist-mono)]">
            
            <div className="flex items-center gap-8">
                <Link href="/">Início</Link>
                <Link href="/rpa">Automações</Link>
                <Link href="/processamentos">Processamentos</Link>
            </div>

            <div className="flex items-center gap-8">
                {user ?
                    <Link href="/api/auth/logout" className="font-bold bg-rose-600 p-3 rounded text-white shadow-md hover:bg-rose-700 hover:cursor-pointer">Sair</Link> :
                    <Link href="/api/auth/login" className="font-bold bg-indigo-600 p-3 rounded text-white shadow-md hover:bg-indigo-700 hover:cursor-pointer">Entrar</Link>
                } 
                {user ?
                    <div className="font-bold bg-yellow-600 p-3 rounded text-white shadow-md">Usuário: {user.name}</div> :
                    <Link href="/api/auth/signup" className="font-bold bg-green-600 p-3 rounded text-white shadow-md hover:bg-green-700 hover:cursor-pointer">Registrar</Link>
                }
                <ThemeSwitch></ThemeSwitch>
            </div>
        </nav>
    )
}