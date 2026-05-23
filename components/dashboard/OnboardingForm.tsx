'use client';

import React, { useActionState, useState } from 'react';
import { createWorkspace } from '@/app/dashboard/actions';
import { Loader2 } from 'lucide-react';

const initialState = {
  error: '',
};

export default function OnboardingForm() {
  const [state, formAction, isPending] = useActionState(createWorkspace, initialState);
  const [slug, setSlug] = useState('');

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '') // strip special chars
      .replace(/\s+/g, '-'); // replace spaces with hyphens
    setSlug(value);
  };

  return (
    <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-xl font-bold tracking-tight text-zinc-50">Create your Workspace</h1>
        <p className="text-sm text-zinc-400">
          This is where you will manage feedback and roadmaps.
        </p>
      </div>

      {state?.error && (
        <div className="bg-red-950/50 border border-red-900 text-red-200 text-xs px-4 py-3 rounded-lg mb-6">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-400" htmlFor="name">
            Workspace Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="My SaaS"
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-400" htmlFor="slug">
            URL Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            placeholder="my-saas"
            required
            value={slug}
            onChange={handleSlugChange}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition"
          />
          <p className="text-[10px] text-zinc-500 pt-1">
            Your board will be public at:{' '}
            <span className="text-zinc-400 font-mono">
              /board/{slug || 'my-saas'}
            </span>
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-400" htmlFor="description">
            Description <span className="text-zinc-600">(Optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Feature requests and bug reports for My SaaS."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200 disabled:opacity-50 font-medium py-2 rounded-lg text-sm transition flex items-center justify-center space-x-2"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>Create Workspace</span>
        </button>
      </form>
    </div>
  );
}
