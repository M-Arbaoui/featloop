import { notFound } from 'next/navigation';
import db from '@/lib/db';
import FeedbackForm from '@/features/board/FeedbackForm';
import VoteButton from '@/features/board/VoteButton';
import Link from 'next/link';
import { Pin } from 'lucide-react';

interface BoardPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}

export default async function BoardPage({ params, searchParams }: BoardPageProps) {
  const { slug } = await params;
  const { sort } = await searchParams;
  const activeSort = sort === 'new' ? 'new' : 'top';

  // Fetch workspace
  const workspace = await db.workspace.findUnique({
    where: { slug },
  });

  if (!workspace) {
    notFound();
  }

  // Fetch posts sorted accordingly
  const posts = await db.feedbackPost.findMany({
    where: { workspaceId: workspace.id },
    include: {
      author: true,
    },
    orderBy: [
      { isPinned: 'desc' }, // pinned posts always at top
      activeSort === 'new' ? { createdAt: 'desc' } : { voteCount: 'desc' },
    ],
  });

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
              className="px-4 py-1.5 rounded-lg bg-zinc-800 text-zinc-100 font-medium"
            >
              Feedback
            </Link>
            <Link
              href={`/board/${slug}/roadmap`}
              className="px-4 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 font-medium transition"
            >
              Roadmap
            </Link>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Left Column: Submit form */}
          <div className="md:col-span-1">
            <FeedbackForm workspaceSlug={slug} />
          </div>

          {/* Right Column: Posts List */}
          <div className="md:col-span-2 space-y-4">
            
            {/* Sorting Filter */}
            <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-900">
              <span className="text-zinc-500 font-medium">{posts.length} suggestions</span>
              <div className="flex items-center space-x-3 text-zinc-400">
                <Link
                  href={`/board/${slug}?sort=top`}
                  className={`font-semibold transition ${activeSort === 'top' ? 'text-zinc-100' : 'hover:text-zinc-200'}`}
                >
                  Top
                </Link>
                <Link
                  href={`/board/${slug}?sort=new`}
                  className={`font-semibold transition ${activeSort === 'new' ? 'text-zinc-100' : 'hover:text-zinc-200'}`}
                >
                  New
                </Link>
              </div>
            </div>

            {/* Posts */}
            {posts.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-zinc-900 rounded-2xl">
                <p className="text-sm text-zinc-500">No suggestions yet. Be the first to submit!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-zinc-900 border border-zinc-850 p-5 rounded-2xl flex items-start gap-4 hover:border-zinc-800 transition relative group"
                  >
                    {/* Vote button component */}
                    <VoteButton
                      postId={post.id}
                      initialVoteCount={post.voteCount}
                      initialVoted={false}
                    />

                    {/* Post content */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-zinc-100 leading-tight">
                          {post.title}
                        </h3>
                        {post.isPinned && (
                          <span className="text-zinc-500" title="Pinned Post">
                            <Pin className="w-3.5 h-3.5 fill-current" />
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          post.status === 'RELEASED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' :
                          post.status === 'IN_PROGRESS' ? 'bg-blue-950 text-blue-400 border border-blue-900' :
                          post.status === 'PLANNED' ? 'bg-purple-950 text-purple-400 border border-purple-900' :
                          'bg-zinc-800 text-zinc-400'
                        }`}>
                          {post.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                        {post.description}
                      </p>
                      <div className="flex items-center space-x-2 text-[10px] text-zinc-500 pt-2">
                        <span>Submitted by {post.author.name || 'Anonymous'}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
