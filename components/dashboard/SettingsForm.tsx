'use client';

import React, { useActionState, useState } from 'react';
import { updateWorkspaceSettings } from '@/app/dashboard/actions';
import { Loader2 } from 'lucide-react';

interface SettingsFormProps {
  workspaceId: string;
  initialName: string;
  initialSlug: string;
  initialDescription: string | null;
}

interface ActionState {
  error?: string;
  success?: string;
}

const initialState: ActionState = {
  error: undefined,
  success: undefined,
};

export default function SettingsForm({
  workspaceId,
  initialName,
  initialSlug,
  initialDescription,
}: SettingsFormProps) {
  const updateSettingsWithId = updateWorkspaceSettings.bind(null, workspaceId);
  const [state, formAction, isPending] = useActionState(updateSettingsWithId, initialState);
  const [slug, setSlug] = useState(initialSlug);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/\s+/g, '-');
    setSlug(value);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-6">
      
      {state?.error && (
        <div className="bg-red-950/50 border border-red-900 text-red-200 text-xs px-3 py-2 rounded-lg">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="bg-emerald-950/50 border border-emerald-900 text-emerald-200 text-xs px-3 py-2 rounded-lg">
          {state.success}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        
        {/* Name */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider" htmlFor="settings-name">
            Workspace Name
          </label>
          <input
            id="settings-name"
            name="name"
            type="text"
            required
            defaultValue={initialName}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition"
          />
        </div>

        {/* Slug */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider" htmlFor="settings-slug">
            URL Slug
          </label>
          <input
            id="settings-slug"
            name="slug"
            type="text"
            required
            value={slug}
            onChange={handleSlugChange}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition"
          />
          <p className="text-[9px] text-zinc-500 pt-0.5">
            Public Board URL: <span className="font-mono text-zinc-400">/board/{slug}</span>
          </p>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider" htmlFor="settings-desc">
            Description
          </label>
          <textarea
            id="settings-desc"
            name="description"
            rows={4}
            defaultValue={initialDescription || ''}
            placeholder="Introduce your feedback board to users..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="bg-zinc-100 text-zinc-950 font-bold px-4 py-2 rounded-lg text-xs hover:bg-zinc-200 transition flex items-center space-x-1.5 disabled:opacity-50"
        >
          {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <span>Save Changes</span>
        </button>

      </form>
    </div>
  );
}
