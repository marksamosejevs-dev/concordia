import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminSession } from "./tokens";

/** Admin check for route handlers and server components (signed, httpOnly session cookie). */
export async function isAdmin(): Promise<boolean> {
  try { return verifyAdminSession((await cookies()).get(ADMIN_COOKIE)?.value); } catch { return false; }
}
