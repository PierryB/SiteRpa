import { NextResponse } from 'next/server';
import { getAccessToken } from '@auth0/nextjs-auth0';

export async function GET() {
  try {
    const { accessToken } = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 });
    }
    return NextResponse.json({ accessToken }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao obter o token de acesso' }, { status: 500 });
  }
}
