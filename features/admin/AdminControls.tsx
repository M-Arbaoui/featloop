'use client';

import React, { useState } from 'react';
import { Pin, Trash2, Loader2 } from 'lucide-react';
import { togglePinPost, deletePost } from '@/app/dashboard/actions';
import { useRouter } from 'next/navigation';

interface AdminControlsProps {
  postId: string;
  workspaceSlug: string;
  initialIsPinned: boolean;
}

export default function AdminControls({ postId, workspaceSlug, initialIsPinned }: AdminControlsProps) {
  const router = useRouter();
  const [isPinned, setIsPinned] = useState(initialIsPinned);
  const [isPinning, setIsPinning] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePin = async () => {
    setIsPinning(true);
    try {
      await togglePinPost(postId, isPinned);
      setIsPinned(!isPinned);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsPinning(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) {
      return;
    }
    setIsDeleting(true);
    try {
      await deletePost(postId, workspaceSlug);
      router.refresh();
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Pin button */}
      <button
        onClick={handlePin}
        disabled={isPinning}
        title={isPinned ? 'Unpin post' : 'Pin post'}
        className={`p-1.5 rounded-lg border transition ${
          isPinned
            ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
            : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-300 hover:border-zinc-800'
        }`}
      >
        {isPinning ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current' : ''}`} />
        )}
      </button>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        title="Delete post"
        className="p-1.5 rounded-lg border bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-red-400 hover:border-red-950 hover:bg-red-950/20 transition"
      >
        {isDeleting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Trash2 className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}
