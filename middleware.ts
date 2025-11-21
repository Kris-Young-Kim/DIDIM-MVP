import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/check(.*)', 
  '/result(.*)',
  '/report(.*)',
  '/admin(.*)'
]);

const isTestRoute = createRouteMatcher(['/auth-test', '/storage-test']);

export default clerkMiddleware(async (auth, req) => {
  // 프로덕션 환경에서 테스트 페이지 접근 차단
  if (isTestRoute(req) && process.env.NODE_ENV === 'production') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 보호된 라우트 인증 확인
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
