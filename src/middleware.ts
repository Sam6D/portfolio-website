import { NextRequest, NextResponse } from 'next/server';
import { CASE_STUDY_AUTH_COOKIE, verifyCaseStudyAuthToken } from '@/lib/caseStudyAuth';

// Case study slugs that require a password. Add future protected slugs
// (and their path) here, and to the `matcher` below.
const PROTECTED_PATHS = ['/case-studies/carv'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const secret = process.env.CASE_STUDY_AUTH_SECRET;

  // Fail closed: without a configured secret we can't verify tokens, so
  // never serve the real page.
  if (!secret) {
    return lockedResponse(request);
  }

  const token = request.cookies.get(CASE_STUDY_AUTH_COOKIE)?.value;
  const isValid = await verifyCaseStudyAuthToken(token, secret);

  if (!isValid) {
    return lockedResponse(request);
  }

  return NextResponse.next();
}

function lockedResponse(request: NextRequest) {
  const response = NextResponse.rewrite(new URL('/case-study-locked', request.url));
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, noimageindex');
  return response;
}

export const config = {
  matcher: ['/case-studies/carv', '/case-studies/carv/:path*'],
};
