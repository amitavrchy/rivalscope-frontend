"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Radar, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

const schema = z.object({ email: z.email(), password: z.string().min(12, 'Use at least 12 characters').max(128), name: z.string().optional(), organizationName: z.string().optional() });
export function AuthPanel({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter(); const [error, setError] = useState(''); const [message, setMessage] = useState('');
  const [challenge, setChallenge] = useState('');
  const google = useQuery({ queryKey: ['google-status'], queryFn: () => api<{ configured: boolean }>('/auth/google/status') });
  useEffect(() => { const value = new URLSearchParams(window.location.hash.slice(1)).get('mfa'); if (value) { queueMicrotask(() => setChallenge(value)); window.history.replaceState(null, '', window.location.pathname); } if (new URLSearchParams(window.location.search).get('google') === 'failed') queueMicrotask(() => setError('Google sign-in could not be completed. Existing password accounts must connect Google in Settings first.')); }, []);
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });
  const submit = form.handleSubmit(async data => {
    setError(''); try { const result = await api<{ mfaRequired?: boolean; challenge?: string }>(`/auth/${mode}`, mode === 'register' ? data : { email: data.email, password: data.password }); if (result.mfaRequired && result.challenge) { setChallenge(result.challenge); return; } router.push('/workspace/overview'); router.refresh(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to sign in'); }
  });
  if (challenge) return <main className="full-state"><form className="auth-form" onSubmit={async e => { e.preventDefault(); const data = new FormData(e.currentTarget); setError(''); try { await api('/auth/mfa', { challenge, code: data.get('code') }); router.push('/workspace/overview'); router.refresh(); } catch (e) { setError(e instanceof Error ? e.message : 'Verification failed'); } }}><h2>Verify your sign-in</h2><p>Enter a six-digit authenticator code or an unused recovery code.</p><label>Verification code<input name="code" autoComplete="one-time-code" required minLength={6} maxLength={80} autoFocus /></label><button className="primary-button">Verify & sign in</button><button type="button" className="text-button" onClick={() => setChallenge('')}>Start again</button>{error && <p className="error" role="alert">{error}</p>}</form></main>;
  return <main className="auth-layout"><div className="auth-story"><Link href="/" className="brand"><Radar /> RivalScope<span>AI</span></Link><div><span className="eyebrow">A CLEARER COMPETITIVE EDGE</span><h1>Your next move.<br /><em>Backed by evidence.</em></h1><p>Bring public sources, competitive insights, and your team’s decisions into one focused workspace.</p><div className="auth-proof"><ShieldCheck /> Your research stays in your workspace.</div></div><small>Intelligence with a source. Strategy with conviction.</small></div><div className="auth-form-wrap"><form onSubmit={submit} className="auth-form"><span className="eyebrow">WELCOME TO RIVALSCOPE</span><h2>{mode === 'register' ? 'Build your advantage.' : 'Welcome back.'}</h2><p>{mode === 'register' ? 'Create your workspace and start asking better questions.' : 'Your competitive landscape is waiting.'}</p>
    {mode === 'register' && <><label>Your name<input {...form.register('name')} required minLength={2} maxLength={80} autoComplete="name" /></label><label>Workspace name<input {...form.register('organizationName')} required minLength={2} maxLength={100} placeholder="Acme intelligence" /></label></>}
    <label>Work email<input {...form.register('email')} type="email" required autoComplete="email" placeholder="you@company.com" /></label><label>Password<input {...form.register('password')} type="password" required autoComplete={mode === 'register' ? 'new-password' : 'current-password'} placeholder="At least 12 characters" /></label>
    {Object.values(form.formState.errors).map((e, i) => <p key={i} className="error" role="alert">{e.message}</p>)}{error && <p className="error" role="alert">{error}</p>}{message && <p role="status">{message}</p>}
    <Button type="submit" className="primary-button" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? 'Connecting…' : mode === 'register' ? 'Create workspace' : 'Sign in'}<ArrowRight size={16} /></Button>
    {mode === 'login' && <button type="button" className="text-button" onClick={async () => { setError(''); try { const response = await api<{ message: string }>('/auth/forgot-password', { email: form.getValues('email') }); setMessage(response.message); } catch (e) { setError(e instanceof Error ? e.message : 'Enter your email first'); } }}>Forgot your password?</button>}
    {mode === 'login' && google.data?.configured && <a className="secondary-button" href="/api/auth/google/start">Continue with Google</a>}<p className="auth-switch">{mode === 'login' ? 'New to RivalScope?' : 'Already have a workspace?'} <Link href={mode === 'login' ? '/register' : '/login'}>{mode === 'login' ? 'Create an account' : 'Sign in'}</Link></p>
  </form></div></main>;
}
