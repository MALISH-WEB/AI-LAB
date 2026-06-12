'use client';

import { useState } from 'react';
import { api } from '../lib/api';

export function CompetencyPanel() {
  const [result, setResult] = useState('Submit metrics to compute mastery and level.');

  const evaluate = async () => {
    try {
      const { data } = await api.post('/competency/evaluate', {
        domain: 'networking',
        accuracy: 80,
        completionSpeed: 70,
        conceptUnderstanding: 90
      });
      setResult(`Mastery ${data.mastery}% (${data.level})`);
    } catch {
      setResult('Unable to compute competency. Confirm auth token and backend status.');
    }
  };

  return (
    <section className="rounded border p-4">
      <h2 className="text-xl font-semibold">Competency Tracking</h2>
      <p className="text-sm opacity-80">Beginner → Intermediate → Advanced → Expert</p>
      <button className="mt-3 rounded bg-purple-600 px-4 py-2 text-white" onClick={evaluate}>
        Evaluate Networking Skill
      </button>
      <p className="mt-2 text-sm">{result}</p>
    </section>
  );
}
