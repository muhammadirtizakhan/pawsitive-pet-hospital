import { fail } from '@/lib/server/http';

// Any /api/... address that does not exist -> JSON 404 (same as the old Express fallback)
const notFound = () => fail(404, 'Route not found');
export const GET = notFound;
export const POST = notFound;
export const PUT = notFound;
export const PATCH = notFound;
export const DELETE = notFound;
