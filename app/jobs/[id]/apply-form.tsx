// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
"use client";

import { useState } from 'react';
import { applyForJob } from './apply-actions';

interface ApplicationFormProps {
  jobId: string;
}

/**
 * Job application form. Allows a user to submit a CV URL and any notes.
 * Calls a server action to create a row in the `applications` table.
 */
export default function ApplicationForm({ jobId }: ApplicationFormProps) {
  const [cvUrl, setCvUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setError(null);
    const formData = new FormData();
    formData.append('jobId', jobId);
    formData.append('cvUrl', cvUrl);
    formData.append('notes', notes);
    const result = await applyForJob(formData);
    if (result?.error) {
      setError(result.error);
      setStatus('error');
    } else {
      setStatus('success');
      setCvUrl('');
      setNotes('');
    }
  }

  return (
    <div className="p-4 bg-gray-50 rounded">
      <h3 className="mb-2 text-lg font-semibold text-green-700">Apply for this job</h3>
      {status === 'success' ? (
        <p className="text-green-600">Application submitted successfully!</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cvUrl" className="block mb-1 text-sm font-medium">
              CV / Resume URL
            </label>
            <input
              id="cvUrl"
              type="url"
              required
              value={cvUrl}
              onChange={(e) => setCvUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label htmlFor="notes" className="block mb-1 text-sm font-medium">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows={4}
            ></textarea>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {status === 'loading' ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      )}
    </div>
  );
}