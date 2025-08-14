import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routePermissions } from './constants/permissions-route-map';

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value;
  const permissionsCookie = req.cookies.get('permissions')?.value;
  const currentPath = req.nextUrl.pathname;

  // Rutas públicas que no requieren autenticación
  const publicPaths = ['/auth/login', '/401'];
  if (publicPaths.includes(currentPath)) {
    return NextResponse.next();
  }

  // Si no hay token, redirigir a login
  if (!accessToken) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Parsear permisos desde la cookie
  let userPermissions: number[] = [];
  if (permissionsCookie) {
    try {
      userPermissions = JSON.parse(permissionsCookie);
    } catch {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  // --- 🔹 Normalizar ruta para rutas dinámicas ---
  let normalizedPath = currentPath.replace(/\/\d+(?=\/|$)/g, '');

  // Determinar si la ruta requiere permiso específico
  let matchedRoute = Object.keys(routePermissions)
    .sort((a, b) => b.length - a.length) // prioriza coincidencias largas
    .find((route) => normalizedPath === route || normalizedPath.startsWith(`${route}/`));

  console.log('matchedRoute', matchedRoute, 'normalizedPath', normalizedPath);
  if (matchedRoute) {
    const requiredPermission = routePermissions[matchedRoute];
    if (!userPermissions.includes(requiredPermission)) {
      return NextResponse.redirect(new URL('/401', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/oficina/:path*', '/proyectos/:path*', '/maquinaria/:path*'],
};
