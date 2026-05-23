import db from '@/lib/db';
import StatusSelector from '@/features/admin/StatusSelector';
import AdminControls from '@/features/admin/AdminControls';
import { Pin } from 'lucide-react';

interface DashboardSlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DashboardSlugPage({ params }: DashboardSlugPageProps) {
  const { slug } = await params;

  // Fetch workspace
  const workspace = await db.workspace.findUnique({
    where: { slug },
  });

  if (!workspace) {
    return <div>Workspace not found.</div>;
  }

  // Fetch all posts for this workspace
  const posts = await db.feedbackPost.findMany({
    where: { workspaceId: workspace.id },
    include: {
      author: true,
    },
    orderBy: [
      { isPinned: 'desc' },
      { voteCount: 'desc' },
    ],
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight">Suggestions</h1>
        <p className="text-sm text-zinc-400">
          Review, pin, change statuses, or delete feedback posts submitted by your users.
        </p>
      </div>

      {/* Suggestion list */}
      <div className="border border-zinc-900 rounded-2xl bg-zinc-900/35 overflow-hidden">
        {posts.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 text-xs">
            No suggestions submitted yet for this workspace.
          </div>
        ) : (
          <div className="divide-y divide-zinc-900">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-900/10 transition"
              >
                
                {/* Details column */}
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
                      {post.title}
                    </h3>
                    {post.isPinned && (
                      <span className="text-zinc-500" title="Pinned Post">
                        <Pin className="w-3.5 h-3.5 fill-current" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center space-x-2 text-[10px] text-zinc-500 pt-1">
                    <span>By {post.author.name || 'Anonymous'}</span>
                    <span>•</span>
                    <span>{post.voteCount} {post.voteCount === 1 ? 'vote' : 'votes'}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions column */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <StatusSelector postId={post.id} initialStatus={post.status} />
                  <AdminControls
                    postId={post.id}
                    workspaceSlug={slug}
                    initialIsPinned={post.isPinned}
                  />
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
