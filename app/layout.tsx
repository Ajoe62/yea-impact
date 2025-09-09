import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'YEA Foundation',
  description: 'Empowering African youths through mindset reorientation, skills training, mentorship and industry connections.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/yea_logo.png" 
                alt="YEA Foundation Logo" 
                width={140} 
                height={40} 
                className="object-contain" 
                priority
              />
            </Link>
            <nav className="space-x-4 text-sm">
              <Link href="/programs" className="hover:underline">
                Programs
              </Link>
              <Link href="/courses" className="hover:underline">
                Courses
              </Link>
              <Link href="/mentorship" className="hover:underline">
                Mentorship
              </Link>
              <Link href="/events" className="hover:underline">
                Events
              </Link>
              <Link href="/jobs" className="hover:underline">
                Jobs
              </Link>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="bg-gray-100 py-4 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} YEA Foundation. All rights reserved.
        </footer>
      </body>
    </html>
  );
}