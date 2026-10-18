import { fail } from '@/lib/server/http';

// Product writes belong to the authenticated dashboard application.
const dashboardOnly = () => fail(405, 'Manage products through the admin dashboard');
export const PUT = dashboardOnly;
export const DELETE = dashboardOnly;
