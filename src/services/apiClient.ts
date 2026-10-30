import API_BASE_URL from "../globals/apiConfig";

/**
 * The only place that calls fetch() for the API.
 *
 * Pages don't use this file directly. They use:
 *   - useCrud()        for writes (create, update, delete) and one-off reads
 *   - useDataFetcher() for reads that should be cached and refreshed (lists, details)
 *
 * The sign-in token lives in an HttpOnly cookie that the browser sends by itself
 * (`credentials: "include"`), so there is no token to store or attach in JavaScript.
 */

/** Fired when the API says we are not signed in (401). AuthContext listens and signs the user out. */
export const SESSION_EXPIRED_EVENT = "auth:session-expired";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Every request ends as one of these, success or failure, so callers only check `result.ok`.
 *
 * The API answers in two shapes (see the API's ResponseTrait):
 *   success: { success: { message, data } }
 *   failure: { error: { message } }   or Laravel's validation error: { message, errors: { field: [...] } }
 */
export type ApiResult<T = unknown> = {
  ok: boolean;
  /** HTTP status code, or 0 when the server could not be reached. */
  status: number;
  message: string;
  data: T | null;
  /** Validation messages per field (status 422), e.g. { code: ["The code has already been taken."] }. */
  errors: Record<string, string[]> | null;
};

/** Thrown by useDataFetcher (SWR needs a thrown error to know a read failed). */
export class ApiError extends Error {
  status: number;

  constructor(result: ApiResult) {
    super(result.message);
    this.status = result.status;
  }
}

export async function apiRequest<T = unknown>(method: HttpMethod, path: string, body?: unknown): Promise<ApiResult<T>> {
  let response: Response;
  try {
    response = await fetch(API_BASE_URL + path, {
      method,
      credentials: "include", // send the sign-in cookie
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    return { ok: false, status: 0, message: "Unable to reach the server.", data: null, errors: null };
  }

  const json = await response.json().catch(() => null);

  if (response.ok) {
    return {
      ok: true,
      status: response.status,
      message: json?.success?.message ?? "",
      data: json?.success?.data ?? null,
      errors: null,
    };
  }

  // Signed out (or the token expired). The login request itself is skipped: a wrong password is
  // a normal answer there, not an expired session.
  if (response.status === 401 && !path.startsWith("auth/")) {
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  }

  const errors: Record<string, string[]> | null = json?.errors ?? null;
  return {
    ok: false,
    status: response.status,
    // Validation messages are joined with "|": showToast shows each one as a bullet.
    message: json?.error?.message || (errors ? Object.values(errors).flat().join("|") : json?.message) || "Something went wrong.",
    data: null,
    errors,
  };
}
