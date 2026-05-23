'use client';

import React, { useState } from 'react';
import { updatePostStatus } from '@/app/dashboard/actions';
import { Loader2 } from 'lucide-react';

interface StatusSelectorProps {
  postId: string;
  initialStatus: 'SUGGESTION' | 'PLANNED' | 'IN_PROGRESS' | 'RELEASED';
}

export default function StatusSelector({ postId, initialStatus }: StatusSelectorProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isPending, setIsPending] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value as any;
    setIsPending(true);
    try {
      await updatePostStatus(postId, nextStatus);
      setStatus(nextStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative flex items-center">
      {isPending && <Loader2 className="w-3.5 h-3.5 text-zinc-400 animate-spin absolute -left-5" />}
      <select
        value={status}
        onChange={handleChange}
        disabled={isPending}
        className={`bg-zinc-950 border border-zinc-800 text-xs rounded-lg px-2 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-500 cursor-pointer transition ${
          status === 'RELEASED' ? 'text-emerald-400 border-emerald-950' :
          status === 'IN_PROGRESS' ? 'text-blue-400 border-blue-950' :
          status === 'PLANNED' ? 'text-purple-400 border-purple-950' :
          'text-zinc-400'
        }`}
      >
        <option value="SUGGESTION" className="text-zinc-400 bg-zinc-950">Suggestion</option>
        <option value="PLANNED" className="text-purple-400 bg-zinc-950">Planned</option>
        <option value="IN_PROGRESS" className="text-blue-400 bg-zinc-950">In Progress</option>
        <option value="RELEASED" className="text-emerald-400 bg-zinc-950">Released</option>
      </select>
    </div>
  );
}
