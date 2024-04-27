export { default } from 'next-auth/middleware'
export const config = {
  matcher: ['/e-dashboard/:path*', '/dashboard'],
}