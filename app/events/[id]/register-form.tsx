"use client";

import { useState } from 'react';
import { registerForEvent } from './register-actions';

interface RegistrationFormProps {
  eventId: string;
}

/**
 * Registration form client component for event sign‑ups.  Calls a
 * server action to insert a row into `event_registrations` with a unique
 * token and sets `checked_in` to false. Shows success or error messages.
 */
export default function RegistrationForm({ eventId }: RegistrationFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );
  const [error, setError] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  async function handleRegister() {
    setStatus('loading');
    setError(null);
    const formData = new FormData();
    formData.append('eventId', eventId);
    const result = await registerForEvent(formData);
    if (result?.error) {
      setError(result.error);
      setStatus('error');
    } else {
      setQrUrl(result.qrUrl || null);
      setStatus('success');
    }
  }
  return (
    <div className="p-4 bg-gray-50 rounded">
      <h3 className="mb-2 text-lg font-semibold text-green-700">Register</h3>
      {status === 'success' ? (
        <div className="space-y-2">
          <p className="text-green-600">You have successfully registered!</p>
          {qrUrl && (
            <div>
              <p className="text-sm text-gray-600">
                Please save or screenshot this QR code. You will need it to
                check in at the event.
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="Event QR code" className="w-40 h-40" />
            </div>
          )}
        </div>
      ) : (
        <>
          {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
          <button
            onClick={handleRegister}
            disabled={status === 'loading'}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {status === 'loading' ? 'Registering...' : 'Register for this event'}
          </button>
        </>
      )}
    </div>
  );
}