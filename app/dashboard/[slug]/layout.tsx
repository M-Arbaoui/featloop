import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import db from '@/lib/db';
import Link from 'next/link';
import { signout } from '@/app/auth/actions';
import { MessageSquare, Code, Settings, ExternalLink, LogOut } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch workspace and verify ownership
  const workspace = await db.workspace.findUnique({
    where: { slug },
  });

  if (!workspace || workspace.ownerId !== user.id) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col selection:bg-zinc-800">
      
      {/* Top Navbar */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-bold tracking-tight bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-lg">
              FL
            </span>
            <span className="text-sm font-semibold text-zinc-200">
              {workspace.name}
            </span>
            <span className="text-[10px] text-zinc-500 bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
              Admin
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href={`/board/${slug}`}
              target="_blank"
              className="text-xs text-zinc-400 hover:text-zinc-200 font-medium transition flex items-center space-x-1 border border-zinc-900 bg-zinc-950 px-3 py-1.5 rounded-lg hover:border-zinc-800"
            >
              <span>View Public Board</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <form action={signout}>
              <button
                type="submit"
                className="text-xs text-zinc-400 hover:text-red-400 font-medium transition flex items-center space-x-1 px-3 py-1.5 rounded-lg hover:bg-red-950/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Panel Layout */}
      <div className="max-w-6xl w-full mx-auto px-4 py-8 flex-1 grid md:grid-cols-4 gap-8">
        
        {/* Left Sidebar */}
        <aside className="md:col-span-1 space-y-1">
          <Link
            href={`/dashboard/${slug}`}
            className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-zinc-900 text-zinc-200 transition"
          >
            <MessageSquare className="w-4 h-4 text-zinc-400" />
            <span>Suggestions</span>
          </Link>
          <Link
            href={`/dashboard/${slug}/widget`}
            className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-zinc-900 text-zinc-200 transition"
          >
            <Code className="w-4 h-4 text-zinc-400" />
            <span>Widget Embed</span>
          </Link>
          <Link
            href={`/dashboard/${slug}/settings`}
            className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-zinc-900 text-zinc-200 transition"
          >
            <Settings className="w-4 h-4 text-zinc-400" />
            <span>Settings</span>
          </Link>
        </aside>

        {/* Content Area */}
        <main className="md:col-span-3">
          {children}
        </main>

      </div>
    </div>
  );
}
