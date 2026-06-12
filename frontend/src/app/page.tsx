'use client';

import { useEffect, useState } from 'react';
import { AIAssistant } from '../components/AIAssistant';
import { NetworkingLab } from '../components/NetworkingLab';
import { CompetencyPanel } from '../components/CompetencyPanel';
import { AdminPanel } from '../components/AdminPanel';
import { api, setAccessToken } from '../lib/api';
import { registerServiceWorker } from '../lib/offline-sync';

export default function HomePage() {
  const [status, setStatus] = useState('Not authenticated');

  useEffect(() => {
    registerServiceWorker().catch(() => undefined);
  }, []);

  const quickLogin = async () => {
    try {
      const email = `student-${Date.now()}@example.com`;
      const register = await api.post('/auth/register', {
        email,
        name: 'Student',
        password: 'Password123!',
        role: 'student'
      });
      setAccessToken(register.data.accessToken);
      setStatus(`Authenticated as ${register.data.user.email}`);
    } catch {
      setStatus('Authentication failed. Verify backend is running.');
    }
  };

  return (
    <main className="container">
      <h1>AI-Powered Unified Virtual Lab Ecosystem</h1>
      <p>Role-aware dashboard with networking simulation, AI tutor, competency tracking, and admin controls.</p>
      <button className="rounded bg-blue-600 px-4 py-2 text-white" onClick={quickLogin}>Quick Student Login</button>
      <p className="text-sm">{status}</p>
      <div className="grid">
        <NetworkingLab />
        <AIAssistant />
        <CompetencyPanel />
        <AdminPanel />
      </div>
    </main>
  );
}
