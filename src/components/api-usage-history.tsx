"use client";
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
export function ApiUsageHistory({ base }: { base: string }) {
  const usage = useQuery({ queryKey: ['api-usage', base], queryFn: () => api<{id:string;apiKeyId:string;endpoint:string;createdAt:string}[]>(`${base}/api-usage`) });
  return <section className="panel"><div className="panel-heading"><div><h2>Customer API usage</h2><p>The latest 100 authorized requests. Each key is limited to 60 requests per minute.</p></div></div>{usage.error && <p className="notice error">{usage.error.message}</p>}{usage.data?.length ? <div className="table-scroll"><table><thead><tr><th>Time</th><th>Key ID</th><th>Scope</th></tr></thead><tbody>{usage.data.map(row=><tr key={row.id}><td>{new Date(row.createdAt).toLocaleString()}</td><td>{row.apiKeyId}</td><td>{row.endpoint}</td></tr>)}</tbody></table></div>:<p className="settings-help">No customer API requests recorded yet.</p>}</section>;
}
