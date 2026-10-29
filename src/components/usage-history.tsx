"use client";
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
export function UsageHistory({base}:{base:string}){
  const usage=useQuery({queryKey:['usage-events',base],queryFn:()=>api<{id:string;category:string;units:number;createdAt:string}[]>(`${base}/usage/events`)});
  const metrics=useQuery({queryKey:['usage-metrics',base],queryFn:()=>api<{id:string;period:string;name:string;value:string}[]>(`${base}/usage/metrics`)});
  return <section className="panel"><div className="panel-heading"><div><h2>Consumption by activity</h2><p>Completed product usage, separate from credit grants and temporary reservations.</p></div></div>{(usage.error||metrics.error)&&<p className="notice error">{usage.error?.message||metrics.error?.message}</p>}{metrics.data?.length?<div className="comparison-selectors">{metrics.data.map(row=><span className="subtle-tag" key={row.id}>{new Date(row.period).toLocaleDateString()} · {Number(row.value)} credits consumed</span>)}</div>:<p className="settings-help">No consumption in the past 30 days.</p>}<div className="table-scroll"><table><thead><tr><th>Activity</th><th>Credits consumed</th><th>Time</th></tr></thead><tbody>{usage.data?.map(row=><tr key={row.id}><td>{row.category}</td><td>{row.units}</td><td>{new Date(row.createdAt).toLocaleString()}</td></tr>)}</tbody></table></div></section>;
}
