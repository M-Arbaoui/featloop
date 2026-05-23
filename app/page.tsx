import Link from 'next/link';
import { ArrowRight, MessageSquare, Map, Zap, Code, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-zinc-800 selection:text-zinc-100 overflow-x-hidden relative">
      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.08)_0,transparent_60%)] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-zinc-900 sticky top-0 bg-zinc-950/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-zinc-50 to-zinc-400 bg-clip-text text-transparent">
              FeatLoop
            </span>
          </div>

          <nav className="flex items-center space-x-4">
            {user ? (
              <Link
                href="/dashboard"
                className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-zinc-400 hover:text-zinc-200 text-xs font-medium transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 text-xs font-semibold px-4 py-2 rounded-lg transition flex items-center space-x-1"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center pt-24 pb-16 px-4 space-y-8 relative">
        <div className="inline-flex items-center space-x-2 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1 text-xs text-zinc-400">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span>FeatLoop is in Public Beta</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-zinc-50 to-zinc-400 bg-clip-text text-transparent leading-[1.1]">
          Collect feedback.<br />
          Build what your users love.
        </h1>

        <p className="text-lg text-zinc-400 max-w-xl mx-auto font-light leading-relaxed">
          A lightweight, beautiful, and premium feedback board and public roadmap tool designed for indie hackers and modern product teams. Setup in under 2 minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href={user ? '/dashboard' : '/signup'}
            className="w-full sm:w-auto bg-zinc-100 text-zinc-900 hover:bg-zinc-200 font-semibold px-6 py-3 rounded-lg text-sm transition flex items-center justify-center space-x-2 shadow-[0_1px_15px_rgba(255,255,255,0.15)]"
          >
            <span>Start Building for Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900/50 font-semibold px-6 py-3 rounded-lg text-sm transition flex items-center justify-center"
          >
            Explore Features
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20 border-t border-zinc-900">
        <div className="text-center space-y-2 mb-16">
          <h2 className="text-2xl font-semibold tracking-tight">Simple. Focused. Premium.</h2>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            No enterprise bloat. Just the tools you need to close the loop on product feedback.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4 hover:border-zinc-700 transition">
            <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold">Feedback Boards</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Create a public board where users can submit feature requests, report bugs, and vote on what matters.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4 hover:border-zinc-700 transition">
            <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <Map className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold">Interactive Roadmaps</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Show users what is Planned, In Progress, or Released. Keep everyone aligned and reduce duplicate request tickets.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4 hover:border-zinc-700 transition">
            <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold">Embeddable Widget</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Paste a single script tag into your website. Let users share feedback directly inside your app without leaving.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-5xl mx-auto px-4 py-20 border-t border-zinc-900">
        <div className="text-center space-y-2 mb-16">
          <h2 className="text-2xl font-semibold tracking-tight">Fair, Developer-Friendly Pricing</h2>
          <p className="text-sm text-zinc-500">
            Start collecting feedback for free. Upgrade as you scale.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Developer Starter</h3>
                <p className="text-xs text-zinc-500 mt-1">Perfect for new launches and side projects.</p>
              </div>
              <div className="text-3xl font-bold">$0</div>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                  <span>1 Public Feedback Board</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                  <span>Up to 20 feedback submissions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                  <span>Planned/In Progress/Released Roadmap</span>
                </li>
              </ul>
            </div>
            <Link
              href={user ? '/dashboard' : '/signup'}
              className="w-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-100 font-medium py-2 rounded-lg text-xs transition text-center block"
            >
              Get Started
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-zinc-900 border border-zinc-200/20 p-8 rounded-2xl space-y-6 flex flex-col justify-between relative">
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-zinc-100 text-zinc-950 text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full">
              Recommended
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Pro Creator</h3>
                <p className="text-xs text-zinc-500 mt-1">For active founders who need custom widget embedding.</p>
              </div>
              <div className="text-3xl font-bold">$9<span className="text-sm font-normal text-zinc-500"> / mo</span></div>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-zinc-100 rounded-full" />
                  <span>Unlimited Feedback Boards</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-zinc-100 rounded-full" />
                  <span>Unlimited feedback submissions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-zinc-100 rounded-full" />
                  <span>Embeddable feedback widget</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-zinc-100 rounded-full" />
                  <span>Custom branding and configurations</span>
                </li>
              </ul>
            </div>
            <Link
              href={user ? '/dashboard' : '/signup'}
              className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold py-2 rounded-lg text-xs transition text-center block"
            >
              Go Pro
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 bg-zinc-950 text-zinc-600 text-xs">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} FeatLoop. All rights reserved.</div>
          <div className="flex space-x-4">
            <Link href="/login" className="hover:text-zinc-400">Privacy</Link>
            <Link href="/login" className="hover:text-zinc-400">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
