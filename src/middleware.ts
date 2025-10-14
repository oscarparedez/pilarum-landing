import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const currentPath = req.nextUrl.pathname;

  // Allow access to static assets and the root path
  if (
    currentPath === '/' ||
    currentPath.startsWith('/assets/') ||
    currentPath.startsWith('/_next/') ||
    currentPath.startsWith('/favicon') ||
    currentPath.includes('.')
  ) {
    return NextResponse.next();
  }

  // For any other path, redirect to the landing page
  return NextResponse.redirect(new URL('/', req.url));
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|assets).*)',
  ],
};
