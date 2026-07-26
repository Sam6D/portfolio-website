import { NextRequest, NextResponse } from 'next/server';
import { CASE_STUDY_AUTH_COOKIE, createCaseStudyAuthToken } from '@/lib/caseStudyAuth';

export const runtime = 'edge';

const THIRTY_DAYS_MS = 1000 * 60 * 60 * 24 * 30;

export async function POST(request: NextRequest) {
  const secret = process.env.CASE_STUDY_AUTH_SECRET;
  const expectedPassword = process.env.CARV_CASE_STUDY_PASSWORD;

  if (!secret || !expectedPassword) {
    return NextResponse.json(
      { error: 'Password protection is not configured.' },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === 'string' ? body.password : '';

  if (password !== expectedPassword) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  const token = await createCaseStudyAuthToken(secret, THIRTY_DAYS_MS);
  const response = NextResponse.json({ success: true });
  response.cookies.set(CASE_STUDY_AUTH_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: THIRTY_DAYS_MS / 1000,
  });

  return response;
}
