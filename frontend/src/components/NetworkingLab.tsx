'use client';

import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface Scenario {
  id: string;
  title: string;
  objective: string;
  expectedActions: string[];
}

export function NetworkingLab() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState('');
  const [action, setAction] = useState('');
  const [feedback, setFeedback] = useState('Select scenario and run action.');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get<Scenario[]>('/simulation/networking/scenarios');
        setScenarios(data);
        if (data[0]) setSelectedScenario(data[0].id);
      } catch {
        setFeedback('Unable to load scenarios. Please login first.');
      }
    };
    load();
  }, []);

  const execute = async () => {
    if (!selectedScenario || !action) return;
    try {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        setFeedback('Start a session from backend API first to execute simulation.');
        return;
      }
      const { data } = await api.post('/simulation/networking/execute', { sessionId, scenarioId: selectedScenario, action });
      setFeedback(`${data.result.feedback} Progress: ${data.progressPercent}%`);
    } catch {
      setFeedback('Execution failed. Check action and authorization token.');
    }
  };

  return (
    <section className="rounded border p-4">
      <h2 className="text-xl font-semibold">Networking Lab (MVP)</h2>
      <p className="text-sm opacity-80">Scenario 1-3 with real-time validation workflow.</p>
      <div className="mt-3">
        <label className="block text-sm font-medium">Scenario</label>
        <select className="w-full rounded border p-2" value={selectedScenario} onChange={(e) => setSelectedScenario(e.target.value)}>
          {scenarios.map((scenario) => (
            <option key={scenario.id} value={scenario.id}>
              {scenario.title}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-3">
        <label className="block text-sm font-medium">Action</label>
        <input
          className="w-full rounded border p-2"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="e.g. set-ip"
        />
      </div>
      <button className="mt-3 rounded bg-blue-600 px-4 py-2 text-white" onClick={execute}>
        Execute Action
      </button>
      <p className="mt-3 text-sm">{feedback}</p>
    </section>
  );
}
