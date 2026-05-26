'use client';

import React, { useState, useEffect, useActionState } from 'react';
import { submitPost } from '@/app/board/actions';
import { Loader2 } from 'lucide-react';

interface FeedbackFormProps {
  workspaceSlug: string;
}

interface ActionState {
  error?: string;
  success?: string;
}

const initialState: ActionState = {
  error: undefined,
  success: undefined,
};

export default function FeedbackForm({ workspaceSlug }: FeedbackFormProps) {
  const submitPostWithSlug = submitPost.bind(null, workspaceSlug);
  const [state, formAction, isPending] = useActionState(submitPostWithSlug, initialState);

  const [hasSavedProfile, setHasSavedProfile] = useState(false);
  const [savedName, setSavedName] = useState('');
  const [savedEmail, setSavedEmail] = useState('');

  // Local state for input values to handle resets
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('featloop_voter_email');
    const name = localStorage.getItem('featloop_voter_name');
    if (email && name) {
      setHasSavedProfile(true);
      setSavedName(name);
      setSavedEmail(email);
    }
  }, []);

  // Sync state success to clear inputs and save cache
  useEffect(() => {
    if (state?.success) {
      // Clear inputs
      setTitle('');
      setDescription('');

      // If user entered details in inputs, save them to localStorage
      if (!hasSavedProfile && nameInput && emailInput) {
        localStorage.setItem('featloop_voter_email', emailInput);
        localStorage.setItem('featloop_voter_name', nameInput);
        
        // Also save this post's upvote in local votedPosts list
        // Note: submitPost automatically creates a vote, so we need to add the vote locally too
        // We'll need the new postId, but since we don't have it in server action return easily,
        // we can just refresh the page.
        
        setSavedName(nameInput);
        setSavedEmail(emailInput);
        setHasSavedProfile(true);
      }
    }
  }, [state, hasSavedProfile, nameInput, emailInput]);

  const handleClearProfile = () => {
    localStorage.removeItem('featloop_voter_email');
    localStorage.removeItem('featloop_voter_name');
    setHasSavedProfile(false);
    setSavedName('');
    setSavedEmail('');
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-zinc-50">Submit an Idea</h2>
        <p className="text-xs text-zinc-400">
          Suggest a new feature or improvement for this workspace.
        </p>
      </div>

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
        {/* Title */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Integrate with Google Calendar..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition"
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe your idea or what pain point it solves..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition resize-none"
          />
        </div>

        {/* Identity Section */}
        {hasSavedProfile ? (
          <div className="bg-zinc-950 border border-zinc-850 p-3 rounded-lg flex items-center justify-between text-xs">
            <div className="text-zinc-400">
              Submitting as <span className="text-zinc-200 font-medium">{savedName}</span> ({savedEmail})
            </div>
            <button
              type="button"
              onClick={handleClearProfile}
              className="text-zinc-500 hover:text-zinc-300 underline font-medium"
            >
              Change
            </button>
            {/* Hidden fields to submit along with the form */}
            <input type="hidden" name="name" value={savedName} />
            <input type="hidden" name="email" value={savedEmail} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider" htmlFor="author-name">
                Your Name
              </label>
              <input
                id="author-name"
                name="name"
                type="text"
                required
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                placeholder="Steve Jobs"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider" htmlFor="author-email">
                Your Email
              </label>
              <input
                id="author-email"
                name="email"
                type="email"
                required
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-zinc-100 text-zinc-950 font-bold py-2 rounded-lg text-xs hover:bg-zinc-200 transition flex items-center justify-center space-x-1.5"
        >
          {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <span>Submit Idea</span>
        </button>
      </form>
    </div>
  );
}
