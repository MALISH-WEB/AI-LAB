'use client';

import { useState } from 'react';
import { api } from '../lib/api';

export function AdminPanel() {
  const [status, setStatus] = useState('Create instructor assignments and manage users/labs from admin endpoints.');

  const loadUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setStatus(`Loaded ${data.length} users`);
    } catch {
      setStatus('Admin call failed. Requires instructor/admin role token.');
    }
  };

  return (
    <section className="rounded border p-4">
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>
      <button className="mt-3 rounded bg-slate-700 px-4 py-2 text-white" onClick={loadUsers}>
        Load Users
      </button>
      <p className="mt-2 text-sm">{status}</p>
    </section>
  );
}
