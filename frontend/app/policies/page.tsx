import Link from 'next/link';

export default function Page() {
  return (
    <main className="min-h-screen text-white px-6 py-16" style={{ backgroundColor: '#0F1115' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Policies</h1>
        <p className="text-sm" style={{ color: '#A1A8B3' }}>
          Policies page placeholder. This route is active and can be expanded with policy templates and controls.
        </p>
        <div className="mt-6">
          <Link href="/" className="text-sm hover:underline" style={{ color: '#2F6BFF' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
