import Head from 'next/head';
import { TeamSearchInput } from '@/components/TeamSearchInput';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Football Team Search</title>
        <meta name="description" content="Search for football team information" />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-4xl font-bold mb-8">Football Team Search</h1>

        {/* Render the TeamSearchInput component */}
        <TeamSearchInput />
      </main>
    </div>
  );
}
