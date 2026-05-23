'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function submitPost(workspaceSlug: string, prevState: any, formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const email = (formData.get('email') as string || '').toLowerCase().trim();
  const name = formData.get('name') as string;

  if (!title || !description || !email || !name) {
    return { error: 'All fields are required.' };
  }

  // Find workspace
  const workspace = await db.workspace.findUnique({
    where: { slug: workspaceSlug },
  });

  if (!workspace) {
    return { error: 'Workspace not found.' };
  }

  try {
    // 1. Get or create shadow user
    const user = await db.user.upsert({
      where: { email },
      update: {}, // Don't change anything if user exists
      create: {
        id: crypto.randomUUID(), // For shadow users, we assign a random UUID since they don't have a Supabase Auth session yet
        email,
        name,
      },
    });

    // 2. Create post
    const post = await db.feedbackPost.create({
      data: {
        title,
        description,
        workspaceId: workspace.id,
        authorId: user.id,
        voteCount: 1, // Author votes for their own post automatically
      },
    });

    // 3. Register initial vote
    await db.vote.create({
      data: {
        postId: post.id,
        userId: user.id,
      },
    });

    revalidatePath(`/board/${workspaceSlug}`);
    return { success: 'Your feedback has been submitted successfully.' };
  } catch (error) {
    console.error('Failed to submit post:', error);
    return { error: 'Failed to submit feedback. Try again.' };
  }
}

export async function toggleVote(postId: string, email: string, name: string) {
  const cleanEmail = email.toLowerCase().trim();
  if (!cleanEmail || !name) {
    return { error: 'Email and Name are required to vote.' };
  }

  try {
    // 1. Get or create shadow user
    const user = await db.user.upsert({
      where: { email: cleanEmail },
      update: {},
      create: {
        id: crypto.randomUUID(),
        email: cleanEmail,
        name,
      },
    });

    // 2. Check if vote exists
    const existingVote = await db.vote.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: user.id,
        },
      },
    });

    let voted = false;

    if (existingVote) {
      // Toggle off: Delete vote
      await db.vote.delete({
        where: { id: existingVote.id },
      });
      // Decrement voteCount
      await db.feedbackPost.update({
        where: { id: postId },
        data: { voteCount: { decrement: 1 } },
      });
    } else {
      // Toggle on: Create vote
      await db.vote.create({
        data: {
          postId,
          userId: user.id,
        },
      });
      // Increment voteCount
      await db.feedbackPost.update({
        where: { id: postId },
        data: { voteCount: { increment: 1 } },
      });
      voted = true;
    }

    return { success: true, voted };
  } catch (error) {
    console.error('Failed to toggle vote:', error);
    return { error: 'Failed to register vote.' };
  }
}
