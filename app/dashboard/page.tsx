import { createClient } from '@/lib/supabase/server';
import db from '@/lib/db';
import { redirect } from 'next/navigation';
import OnboardingForm from '@/components/dashboard/OnboardingForm';

export default async function DashboardIndexPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch workspaces for user
  const workspaces = await db.workspace.findMany({
    where: {
      ownerId: user.id,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // If workspace already exists, redirect to it
  if (workspaces.length > 0) {
    redirect(`/dashboard/${workspaces[0].slug}`);
  }

  // Otherwise show workspace creation onboarding
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-50 px-4">
      <OnboardingForm />
    </div>
  );
}
