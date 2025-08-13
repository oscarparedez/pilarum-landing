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
      userPermissions = [
        0, 1, 2, 20, 21, 22, 23, 40, 41, 42, 43, 60, 70, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
        91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 200, 201, 202, 220, 221, 222, 223, 224, 225, 226,
        227, 228, 229, 240, 241, 242, 243, 250, 251, 252, 253, 260, 261, 262, 263, 270, 271, 272,
        273, 280, 281, 282, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 310,
        311, 312, 320, 330, 331, 332, 333, 340, 341, 342, 343, 400, 401, 402,
      ];
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

  console.log("matchedRoute", matchedRoute, "normalizedPath", normalizedPath);
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
