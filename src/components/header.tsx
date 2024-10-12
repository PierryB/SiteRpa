'use client';
import Link from "next/link";
import ThemeSwitch from "./ThemeSwitch";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Header()
{
    const {user} = useUser();

    return (
        <nav className="flex items-center justify-between mx-auto p-4 font-[family-name:var(--font-geist-mono)]" style={{userSelect: 'none'}}>
            <div className="flex items-center gap-8 font-bold">
                <Link href="/" className="p-3 rounded-md transition-all duration-200"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--foreground)';
                        e.currentTarget.style.color = 'var(--background)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--background)';
                        e.currentTarget.style.color = 'var(--foreground)';
                    }}>
                    Início
                </Link>
        
                <Link href="/rpa" className="p-3 rounded-md transition-all duration-200"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--foreground)';
                        e.currentTarget.style.color = 'var(--background)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--background)';
                        e.currentTarget.style.color = 'var(--foreground)';
                    }}>
                    Automações
                </Link>
        
                <Link href="/processamentos" className="p-3 rounded-md transition-all duration-200"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--foreground)';
                        e.currentTarget.style.color = 'var(--background)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--background)';
                        e.currentTarget.style.color = 'var(--foreground)';
                    }}>
                    Processamentos
                </Link>
            </div>
        
            <div className="flex items-center gap-8">
                {user ? (
                    <Link href="/api/auth/logout" className="font-bold bg-rose-600 p-3 rounded text-white shadow-md hover:bg-rose-700 hover:cursor-pointer">
                        Sair
                    </Link>
                ) : (
                    <Link href="/api/auth/login" className="font-bold bg-indigo-600 p-3 rounded text-white shadow-md hover:bg-indigo-700 hover:cursor-pointer">
                        Entrar
                    </Link>
                )}
                {user ? (
                    <div className="font-bold bg-yellow-600 p-3 rounded text-white shadow-md hover:bg-yellow-700">
                        Usuário: {user.name}
                    </div>
                ) : (
                    <Link href="/api/auth/signup" className="font-bold bg-green-600 p-3 rounded text-white shadow-md hover:bg-green-700 hover:cursor-pointer">
                        Registrar
                    </Link>
                )}
                <ThemeSwitch />
            </div>
        </nav>
    )
}