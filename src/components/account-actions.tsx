"use client";
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';
export function AccountActions() {
  const params = useSearchParams(); const [message, setMessage] = useState(''); const [pending, setPending] = useState(false);
  const purpose = params.has('verify') ? 'verify' : params.has('reset') ? 'reset' : params.has('invite') ? 'invite' : null;
  if (!purpose) return null;
  return <form className="account-action panel" onSubmit={async e => { e.preventDefault(); const data = new FormData(e.currentTarget); setPending(true); try {
    const path = purpose === 'invite' ? '/organizations/invitations/accept' : purpose === 'reset' ? '/auth/reset-password' : '/auth/verify';
    await api(path, { token: params.get(purpose), ...(purpose === 'reset' ? { password: data.get('password') } : {}) }); setMessage(purpose === 'verify' ? 'Email verified. Open your workspace to start research.' : purpose === 'reset' ? 'Password updated. You can sign in now.' : 'Invitation accepted. Open your workspace.');
  } catch (error) { setMessage(error instanceof Error ? error.message : 'The link could not be used'); } finally { setPending(false); } }}><h2>{purpose === 'verify' ? 'Verify your email' : purpose === 'reset' ? 'Set a new password' : 'Join your team'}</h2>{purpose === 'invite' && <p>Sign in with the invited email address before accepting.</p>}{purpose === 'reset' && <label>New password<input name="password" type="password" required minLength={12} maxLength={128} autoComplete="new-password" /></label>}<button className="primary-button" disabled={pending}>{pending ? 'Working…' : 'Continue'}</button>{message && <p role="status">{message}</p>}</form>;
}
