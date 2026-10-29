import { Suspense } from 'react';
import { Workspace } from '@/components/workspace';
export function generateStaticParams() { return ['overview','projects','research','competitors','comparisons','swot','monitoring','alerts','copilot','reports','team','billing','integrations','settings','admin'].map(section => ({ section })); }
async function WorkspaceContent({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  return <Workspace section={section} />;
}
export default function WorkspacePage({ params }: { params: Promise<{ section: string }> }) {
  return <Suspense fallback={<div className="full-state">Opening your workspace…</div>}><WorkspaceContent params={params} /></Suspense>;
}
