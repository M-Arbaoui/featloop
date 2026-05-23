'use server';

import { createClient } from '@/lib/supabase/server';
import db from '@/lib/db';
import { redirect } from 'next/navigation';

export async function createWorkspace(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  let slug = (formData.get('slug') as string || '').toLowerCase().trim();
  const description = formData.get('description') as string;

  if (!name || !slug) {
    return { error: 'Workspace name and slug are required' };
  }

  // Validate slug format
  const slugRegex = /^[a-z0-9-]+$/;
  if (!slugRegex.test(slug)) {
    return { error: 'Slug must contain only lowercase letters, numbers, and hyphens' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  // Check slug uniqueness
  try {
    const existing = await db.workspace.findUnique({
      where: { slug },
    });

    if (existing) {
      return { error: 'This slug is already taken. Try another one.' };
    }

    // Create the workspace
    const workspace = await db.workspace.create({
      data: {
        name,
        slug,
        description: description || null,
        ownerId: user.id,
      },
    });

    // We can't use redirect directly in try/catch block because redirect throws a Next.js routing error that is caught
  } catch (error: any) {
    if (error.error === undefined) {
      return { error: 'Failed to create workspace. Database error.' };
    }
  }

  redirect(`/dashboard/${slug}`);
}

export async function deletePost(postId: string, workspaceSlug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Verify ownership
  const post = await db.feedbackPost.findUnique({
    where: { id: postId },
    include: { workspace: true },
  });

  if (!post || post.workspace.ownerId !== user.id) {
    throw new Error('Unauthorized or post not found');
  }

  await db.feedbackPost.delete({
    where: { id: postId },
  });

  return { success: true };
}

export async function togglePinPost(postId: string, currentPinStatus: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Verify ownership
  const post = await db.feedbackPost.findUnique({
    where: { id: postId },
    include: { workspace: true },
  });

  if (!post || post.workspace.ownerId !== user.id) {
    throw new Error('Unauthorized or post not found');
  }

  await db.feedbackPost.update({
    where: { id: postId },
    data: { isPinned: !currentPinStatus },
  });

  return { success: true };
}

export async function updatePostStatus(postId: string, status: 'SUGGESTION' | 'PLANNED' | 'IN_PROGRESS' | 'RELEASED') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Verify ownership
  const post = await db.feedbackPost.findUnique({
    where: { id: postId },
    include: { workspace: true },
  });

  if (!post || post.workspace.ownerId !== user.id) {
    throw new Error('Unauthorized or post not found');
  }

  await db.feedbackPost.update({
    where: { id: postId },
    data: { status },
  });

  return { success: true };
}

export async function updateWorkspaceSettings(workspaceId: string, prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  let slug = (formData.get('slug') as string || '').toLowerCase().trim();
  const description = formData.get('description') as string;

  if (!name || !slug) {
    return { error: 'Workspace name and slug are required' };
  }

  // Validate slug format
  const slugRegex = /^[a-z0-9-]+$/;
  if (!slugRegex.test(slug)) {
    return { error: 'Slug must contain only lowercase letters, numbers, and hyphens' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  // Verify ownership
  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace || workspace.ownerId !== user.id) {
    return { error: 'Unauthorized or workspace not found' };
  }

  // Check slug uniqueness
  if (slug !== workspace.slug) {
    const existing = await db.workspace.findUnique({
      where: { slug },
    });

    if (existing) {
      return { error: 'This slug is already taken. Try another one.' };
    }
  }

  let redirectedSlug = '';

  try {
    const updated = await db.workspace.update({
      where: { id: workspaceId },
      data: {
        name,
        slug,
        description: description || null,
      },
    });
    redirectedSlug = updated.slug;
  } catch (error) {
    return { error: 'Failed to update workspace. Database error.' };
  }

  if (redirectedSlug && redirectedSlug !== workspace.slug) {
    redirect(`/dashboard/${redirectedSlug}/settings?success=Settings updated successfully`);
  }

  return { success: 'Settings updated successfully' };
}

