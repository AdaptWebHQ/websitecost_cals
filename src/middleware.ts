/**
 * Next.js Middleware — Route Protection
 *
 * This file registers the proxy routing logic as the active Next.js middleware.
 * Without this file, all route guards in proxy.ts are dead code and have no effect.
 */
export { proxy as middleware, config } from './proxy';
