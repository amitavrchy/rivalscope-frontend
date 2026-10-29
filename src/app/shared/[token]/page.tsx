import { Suspense } from 'react';
import { SharedReport } from '@/components/shared-report';
export const instant = false;
export default function SharedPage() { return <Suspense fallback={<div className="full-state">Opening report…</div>}><SharedReport /></Suspense>; }
