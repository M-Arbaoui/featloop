import { headers } from 'next/headers';
import db from '@/lib/db';
import { notFound } from 'next/navigation';
import { Terminal, Copy } from 'lucide-react';
import React from 'react';

interface WidgetDashboardPageProps {
  params: Promise<{ slug: string }>;
}

export default async function WidgetDashboardPage({ params }: WidgetDashboardPageProps) {
  const { slug } = await params;

  const workspace = await db.workspace.findUnique({
    where: { slug },
  });

  if (!workspace) {
    notFound();
  }

  // Get current host to make the copy-paste script tag absolute and correct
  const headersList = await headers();
  const host = headersList.get('host') || 'featloop.com';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const origin = `${protocol}://${host}`;

  const snippet = `<script
  src="${origin}/widget.js"
  data-workspace="${slug}"
  defer
></script>`;

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight">Widget Integration</h1>
        <p className="text-sm text-zinc-400">
          Embed the feedback widget directly into your application or landing page.
        </p>
      </div>

      {/* Instructions Card */}
      <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-4">
        <div className="flex items-center space-x-2 text-zinc-300">
          <Terminal className="w-5 h-5 text-zinc-400" />
          <h2 className="text-sm font-semibold">Copy the script tag</h2>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Paste this snippet at the end of your <code className="font-mono text-zinc-300 bg-zinc-950 px-1 py-0.5 rounded">&lt;body&gt;</code> element on any page where you want the feedback trigger to appear.
        </p>

        {/* Code Snippet Box */}
        <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl relative group font-mono text-xs text-zinc-300 overflow-x-auto whitespace-pre">
          {snippet}
        </div>

        <div className="text-xs text-zinc-500 pt-2 leading-relaxed">
          🚀 <strong>Tip:</strong> The widget is fully styled and runs inside an isolated iframe, meaning it will not conflict with any existing CSS or JS scripts on your website.
        </div>
      </div>

    </div>
  );
}
