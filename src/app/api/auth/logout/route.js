import { clearCustomerSession } from '@/lib/server/customerSession';
import { ok, fail } from '@/lib/server/http';

export async function POST(request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return fail(403, 'Access denied');
  return clearCustomerSession(ok());
}
