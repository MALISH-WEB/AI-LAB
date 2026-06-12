'use client';

import { useState } from 'react';
import { api } from '../lib/api';

export function AIAssistant() {
  const [prompt, setPrompt] = useState('How do I verify subnet mismatch issues?');
  const [response, setResponse] = useState('AI hints will appear here.');

  const askAssistant = async () => {
    try {
      const { data } = await api.post('/ai/assist', { prompt, context: 'networking-lab' });
      setResponse(data.text);
    } catch {
      setResponse('AI assistant unavailable. Ensure backend and token are configured.');
    }
  };

  return (
    <section className="rounded border p-4">
      <h2 className="text-xl font-semibold">AI Learning Assistant</h2>
      <textarea className="mt-2 w-full rounded border p-2" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} />
      <button className="mt-2 rounded bg-emerald-600 px-4 py-2 text-white" onClick={askAssistant}>
        Ask AI Tutor
      </button>
      <p className="mt-2 text-sm whitespace-pre-wrap">{response}</p>
    </section>
  );
}
