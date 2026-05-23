import Link from 'next/link';
import { signup } from '@/app/auth/actions';

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;
  const message = params.message;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-50 px-4">
      <div className="w-full max-w-md space-y-8 bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl">
        <div className="flex flex-col space-y-2 text-center">
          <Link href="/" className="text-2xl font-bold tracking-tight bg-gradient-to-r from-zinc-50 to-zinc-400 bg-clip-text text-transparent hover:opacity-90 transition">
            FeatLoop
          </Link>
          <h1 className="text-xl font-semibold tracking-tight mt-4">Create your account</h1>
          <p className="text-sm text-zinc-400">
            Start collecting user feedback and roadmapping in minutes.
          </p>
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-900 text-red-200 text-xs px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-emerald-950/50 border border-emerald-900 text-emerald-200 text-xs px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        <form action={signup} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-400" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Steve Jobs"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-400" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-400" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200 font-medium py-2 rounded-lg text-sm transition"
          >
            Create Account
          </button>
        </form>

        <div className="text-center text-xs text-zinc-500">
          Already have an account?{' '}
          <Link href="/login" className="text-zinc-400 hover:text-zinc-200 underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
