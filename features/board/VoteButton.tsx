'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { toggleVote } from '@/app/board/actions';
import { useRouter } from 'next/navigation';

interface VoteButtonProps {
  postId: string;
  initialVoteCount: number;
  initialVoted: boolean; // Did this user (cached locally) vote? We can check locally
}

export default function VoteButton({ postId, initialVoteCount, initialVoted }: VoteButtonProps) {
  const router = useRouter();
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [isVoted, setIsVoted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    // Check if voter is already stored in localStorage
    const savedEmail = localStorage.getItem('featloop_voter_email');
    if (savedEmail) {
      // Check if this post is marked as voted by this user in localStorage
      const votedPosts = JSON.parse(localStorage.getItem('featloop_voted_posts') || '[]');
      if (votedPosts.includes(postId)) {
        setIsVoted(true);
      }
    }
  }, [postId]);

  const handleVoteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const savedEmail = localStorage.getItem('featloop_voter_email');
    const savedName = localStorage.getItem('featloop_voter_name') || '';

    if (savedEmail && savedName) {
      // Call action directly
      setIsPending(true);
      const res = await toggleVote(postId, savedEmail, savedName);
      setIsPending(false);

      if (res.success) {
        const votedPosts = JSON.parse(localStorage.getItem('featloop_voted_posts') || '[]');
        if (res.voted) {
          setVoteCount(prev => prev + 1);
          setIsVoted(true);
          votedPosts.push(postId);
        } else {
          setVoteCount(prev => Math.max(0, prev - 1));
          setIsVoted(false);
          const index = votedPosts.indexOf(postId);
          if (index > -1) votedPosts.splice(index, 1);
        }
        localStorage.setItem('featloop_voted_posts', JSON.stringify(votedPosts));
        router.refresh();
      }
    } else {
      setShowModal(true);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setIsPending(true);
    const res = await toggleVote(postId, email, name);
    setIsPending(false);

    if (res.success) {
      // Save user to localStorage
      localStorage.setItem('featloop_voter_email', email);
      localStorage.setItem('featloop_voter_name', name);

      const votedPosts = JSON.parse(localStorage.getItem('featloop_voted_posts') || '[]');
      if (res.voted) {
        setVoteCount(prev => prev + 1);
        setIsVoted(true);
        votedPosts.push(postId);
      } else {
        setVoteCount(prev => Math.max(0, prev - 1));
        setIsVoted(false);
        const index = votedPosts.indexOf(postId);
        if (index > -1) votedPosts.splice(index, 1);
      }
      localStorage.setItem('featloop_voted_posts', JSON.stringify(votedPosts));
      setShowModal(false);
      router.refresh();
    }
  };

  return (
    <>
      <button
        onClick={handleVoteClick}
        disabled={isPending}
        className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl border transition ${
          isVoted
            ? 'bg-zinc-100 border-zinc-100 text-zinc-950 font-bold'
            : 'bg-zinc-950 hover:bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-100'
        }`}
      >
        <ChevronUp className="w-5 h-5 -mb-0.5" />
        <span className="text-xs font-semibold">{voteCount}</span>
      </button>

      {/* Verification Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 text-sm font-medium"
            >
              ✕
            </button>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-zinc-100">Verify your vote</h3>
              <p className="text-xs text-zinc-400">
                Please enter your details to verify your vote and avoid duplicate submissions.
              </p>
            </div>
            <form onSubmit={handleModalSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider" htmlFor="voter-name">
                  Your Name
                </label>
                <input
                  id="voter-name"
                  type="text"
                  required
                  placeholder="Steve Jobs"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider" htmlFor="voter-email">
                  Email Address
                </label>
                <input
                  id="voter-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-zinc-100 text-zinc-950 font-bold py-1.5 rounded-lg text-xs hover:bg-zinc-200 transition"
              >
                Confirm Vote
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
