export class ApiError extends Error { constructor(message: string, public status: number) { super(message); } }
export async function api<T>(path: string, data?: unknown, method = data === undefined ? 'GET' : 'POST'): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, { method, credentials: 'same-origin', cache: 'no-store', signal: AbortSignal.timeout(90_000), headers: { 'content-type': 'application/json' }, ...(data !== undefined ? { body: JSON.stringify(data) } : {}) });
  } catch {
    throw new ApiError(method === 'GET' ? 'The backend may be starting or unavailable. Please try again.' : 'The request could not be confirmed. Check the current state before retrying.', 0);
  }
  const body = await response.json().catch(() => { throw new ApiError('The backend returned an invalid response. Please try again.', response.status); });
  if (!response.ok) throw new ApiError(body.issues?.map((i: { path: string; message: string }) => `${i.path}: ${i.message}`).join('; ') || body.message || 'Request failed', response.status);
  return body as T;
}
export type Me = { id: string; name: string; email: string; emailVerifiedAt: string | null; platformAdmin: boolean; memberships: { role: string; organization: { id: string; name: string; slug: string } }[] };
export type Plan = { id: string; name: string; monthlyPriceCents: number; annualPriceCents: number; monthlyCredits: number; projectLimit: number; seatLimit: number; monitorLimit: number; stripeMonthlyPriceId: string | null; stripeAnnualPriceId: string | null };
export type Org = { id: string; name: string; role: string; credits: number; reservedCredits: number; industry: string | null; website: string | null; timezone: string; subscription: { plan: Plan; status: string } };
export type Run = { id: string; status: string; error: string | null; consumedCredits: number; reservedCredits: number; providerTokens: number; cancelRequested: boolean; createdAt: string; stages: { id: string; name: string; status: string; error: string | null; attempts: number }[] };
export type Finding = { id: string; category: string; claim: string; verification: string; evidence: { id: string; sourceId: string; quotation: string; source: { url: string; title: string } }[] };
export type Report = { id: string; title: string; createdAt: string; projectId: string; runId: string; content?: { executiveSummary: string; limitations: string[]; methodology: { sourceCount: number; promptVersion: string; verification: string; failures: { url: string; reason: string }[] } } };
export type Project = { id: string; name: string; description: string; industry: string | null; targetMarket: string | null; website: string | null; updatedAt: string; _count?: { competitors: number; sources: number; reports: number }; runs: Run[]; competitors?: { id: string; name: string; domain: string; classification: string; description: string }[]; findings?: Finding[]; sources?: { id: string; url: string; title: string; retrievedAt: string; verification: string }[]; reports?: Report[] };
export type Monitor = { id: string; projectId: string; url: string; everyHours: number; enabled: boolean; lastCheckedAt: string | null; runs: { id: string; error: string | null; createdAt: string }[]; changes: { id: string; previousText: string; currentText: string; createdAt: string }[] };
export type Notification = { id: string; title: string; body: string; readAt: string | null; createdAt: string };
export type Member = { id: string; role: string; user: { id: string; name: string; email: string } };
export type Ledger = { id: string; kind: string; amount: number; balanceAfter: number; createdAt: string };
