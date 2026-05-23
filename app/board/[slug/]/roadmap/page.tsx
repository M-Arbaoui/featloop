import { notFound } from 'next/navigation';
import db from '@/lib/db';
import VoteButton from '@/features/board/VoteButton';
import Link from 'next/link';

interface RoadmapPageProps {
  params: Promise<{ slug: string }>;
}

export default async function RoadmapPage({ params }: RoadmapPageProps) {
  const { slug } = await params;

  // Fetch workspace
  const workspace = await db.workspace.findUnique({
    where: { slug },
  });

  if (!workspace) {
    notFound();
  }

  // Fetch roadmap posts
  const posts = await db.feedbackPost.findMany({
    where: {
      workspaceId: workspace.id,
      status: {
        in: ['PLANNED', 'IN_PROGRESS', 'RELEASED'],
      },
    },
    include: {
      author: true,
    },
    orderBy: {
      voteCount: 'desc',
    },
  });

  // Group posts by status
  const planned = posts.filter(p => p.status === 'PLANNED');
  const inProgress = posts.filter(p => p.status === 'IN_PROGRESS');
  const released = posts.filter(p => p.status === 'RELEASED');

  const columns = [
    { title: 'Planned', count: planned.length, posts: planned, colorClass: 'bg-purple-500' },
    { title: 'In Progress', count: inProgress.length, posts: inProgress, colorClass: 'bg-blue-500' },
    { title: 'Released', count: released.length, posts: released, colorClass: 'bg-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 px-4 py-8 selection:bg-zinc-800">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Workspace Header */}
        <div className="border-b border-zinc-900 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">{workspace.name}</h1>
            {workspace.description && (
              <p className="text-sm text-zinc-400 max-w-xl">{workspace.description}</p>
            )}
          </div>
          <div className="flex space-x-1.5 bg-zinc-900 border border-zinc-850 p-1 rounded-xl text-xs">
            <Link
              href={`/board/${slug}`}
              className="px-4 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 font-medium transition"
            >
              Feedback
            </Link>
            <Link
              href={`/board/${slug}/roadmap`}
              className="px-4 py-1.5 rounded-lg bg-zinc-800 text-zinc-100 font-medium"
            >
              Roadmap
            </Link>
          </div>
        </div>

        {/* Columns Grid */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {columns.map((col, index) => (
            <div key={index} className="bg-zinc-900/50 border border-zinc-900 rounded-2xl p-4 space-y-4">
              
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${col.colorClass}`} />
                  <h2 className="text-sm font-semibold text-zinc-250">{col.title}</h2>
                </div>
                <span className="text-[10px] bg-zinc-900 text-zinc-500 font-bold px-2 py-0.5 rounded-md">
                  {col.count}
                </span>
              </div>

              {/* Cards list */}
              <div className="space-y-3 min-h-[300px]">
                {col.posts.length === 0 ? (
                  <div className="text-center py-12 text-zinc-600 text-xs">
                    No items here
                  </div>
                ) : (
                  col.posts.map(post => (
                    <div
                      key={post.id}
                      className="bg-zinc-900 border border-zinc-850 p-4 rounded-xl flex items-start gap-3 hover:border-zinc-800 transition"
                    >
                      <VoteButton
                        postId={post.id}
                        initialVoteCount={post.voteCount}
                        initialVoted={false}
                      />
                      <div className="space-y-1 flex-1">
                        <h3 className="text-xs font-bold text-zinc-100 leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-[11px] text-zinc-400 leading-normal line-clamp-2">
                          {post.description}
                        </p>
                        <div className="text-[9px] text-zinc-500 pt-1">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
