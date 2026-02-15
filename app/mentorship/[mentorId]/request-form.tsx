"use client";

import { useState } from 'react';
import { requestMentorship } from './request-actions';

interface RequestFormProps {
  mentorId: string;
}

/**
 * Mentorship request form. Allows the user to submit a note to the
 * mentor. Calls a server action that inserts into `mentor_requests` with
 * a unique constraint on (mentee_id, mentor_id).
 */
export default function RequestForm({ mentorId }: RequestFormProps) {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setError(null);
    const formData = new FormData();
    formData.append('mentorId', mentorId);
    formData.append('message', message);
    const result = await requestMentorship(formData);
    if (result?.error) {
      setError(result.error);
      setStatus('error');
    } else {
      setStatus('success');
      setMessage('');
    }
  }
  return (
    <div className="p-4 bg-gray-50 rounded">
      <h3 className="mb-2 text-lg font-semibold text-green-700">Request Mentorship</h3>
      {status === 'success' ? (
        <p className="text-green-600">Request submitted successfully!</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="message" className="block mb-1 text-sm font-medium">
              Message to mentor (optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
            {status === 'loading' ? 'Requesting...' : 'Send Request'}
          </button>
        </form>
      )}
    </div>
  );
}