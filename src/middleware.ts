import { NextRequest, NextResponse } from 'next/server';
import { GetTenant } from './application/getTenant';
import { MockTenantRepository } from './infrastructure/mockTenantRepository';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  const hostname = new URL(`http://${host}`).hostname;
  const subdomain = hostname.split('.')[0];

  const tenantRepository = new MockTenantRepository();
  const getTenant = new GetTenant(tenantRepository);
  const tenant = await getTenant.execute(subdomain);

  const tenantId = tenant ? tenant.id : 'not-found';

  // Preserve the original path while rewriting to the tenant-specific route.
  // Example: /onboarding -> /tenants/cliente1/onboarding
  const originalPath = url.pathname;
  url.pathname = `/tenants/${tenantId}${originalPath}`;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
