import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { CASE_STUDY_AUTH_COOKIE, verifyCaseStudyAuthToken } from '@/lib/caseStudyAuth';

// Media for the password-protected Carv case study lives outside `public/`
// on purpose: files under `public/` are served statically regardless of
// this route, which would bypass the password check entirely.
const MEDIA_ROOT = path.join(process.cwd(), 'protected-media', 'carv');

const CONTENT_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const secret = process.env.CASE_STUDY_AUTH_SECRET;
  const token = request.cookies.get(CASE_STUDY_AUTH_COOKIE)?.value;

  if (!secret || !(await verifyCaseStudyAuthToken(token, secret))) {
    return new NextResponse(null, { status: 404 });
  }

  const { path: segments } = await params;
  const requestedPath = path.join(MEDIA_ROOT, ...segments);
  const relative = path.relative(MEDIA_ROOT, requestedPath);

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const file = await readFile(requestedPath);
    const contentType = CONTENT_TYPES[path.extname(requestedPath).toLowerCase()] ?? 'application/octet-stream';

    return new NextResponse(new Uint8Array(file), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, no-store',
        'X-Robots-Tag': 'noindex, nofollow, noarchive, noimageindex',
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
