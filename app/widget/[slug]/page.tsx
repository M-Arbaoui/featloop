import { notFound } from 'next/navigation';
import db from '@/lib/db';
import FeedbackForm from '@/features/board/FeedbackForm';

interface WidgetPageProps {
  params: Promise<{ slug: string }>;
}

export default async function WidgetPage({ params }: WidgetPageProps) {
  const { slug } = await params;

  const workspace = await db.workspace.findUnique({
    where: { slug },
  });

  if (!workspace) {
    notFound();
  }

  return (
    <div className="bg-zinc-950 text-zinc-50 min-h-screen flex flex-col p-4">
      {/* Sleek minimal header for the widget */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-900 mb-4">
        <div>
          <h1 className="text-xs font-semibold text-zinc-300">Feedback for {workspace.name}</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <FeedbackForm workspaceSlug={slug} />
      </div>
      
      <div className="text-center pt-3 text-[9px] text-zinc-600">
        Powered by FeatLoop
      </div>
    </div>
  );
}
