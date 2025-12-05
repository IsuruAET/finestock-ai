import { ensureDBConnection } from "./dbMiddleware";
import { protect } from "./authMiddleware";

/**
 * Common middleware combinations for routes
 */
export const protectedRoute = [ensureDBConnection, protect];
export const publicRoute = [ensureDBConnection];
