'use client';

import { useState, FormEvent } from 'react';

export function PasswordGate() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/case-study-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Incorrect password.');
        setLoading(false);
        return;
      }

      // Reload so the request is re-checked by middleware, which will now
      // find the auth cookie and let the real page through.
      window.location.reload();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto text-left">
      <h1 className="text-title-large font-semibold text-foreground mb-2">
        This case study is password protected
      </h1>
      <p className="text-body-medium text-foreground-muted mb-6">
        Enter the password to view this case study.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="w-full px-4 py-3 rounded-[12px] border border-outline bg-surface text-foreground text-body-medium focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {error && <p className="text-red-600 text-label-small">{error}</p>}
        <button
          type="submit"
          disabled={loading || password.length === 0}
          className="w-full px-4 py-3 rounded-[12px] bg-primary text-white text-button-label disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Checking…' : 'Unlock'}
        </button>
      </form>
    </div>
  );
}
