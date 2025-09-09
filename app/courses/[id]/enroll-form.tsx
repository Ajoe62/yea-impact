"use client";

import { useState } from 'react';
import { enrollInCourse } from './enroll-actions';

interface EnrollFormProps {
  courseId: string;
}

/**
 * Enrollment form client component. Allows logged‑in users to enroll in a
 * course. It calls a server action which creates a row in the `enrollments`
 * table with a composite unique constraint to prevent duplicate enrolments.
 */
export default function EnrollmentForm({ courseId }: EnrollFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );
  const [error, setError] = useState<string | null>(null);

  async function handleEnroll() {
    setStatus('loading');
    setError(null);
    const formData = new FormData();
    formData.append('courseId', courseId);
    const result = await enrollInCourse(formData);
    if (result?.error) {
      setError(result.error);
      setStatus('error');
    } else {
      setStatus('success');
    }
  }

  return (
    <div className="p-4 mt-4 bg-gray-50 rounded">
      <h3 className="mb-2 text-lg font-semibold text-green-700">Enroll</h3>
      {status === 'success' ? (
        <p className="text-green-600">You are enrolled in this course!</p>
      ) : (
        <>
          {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
          <button
            onClick={handleEnroll}
            disabled={status === 'loading'}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {status === 'loading' ? 'Enrolling...' : 'Enroll in this course'}
          </button>
        </>
      )}
    </div>
  );
}