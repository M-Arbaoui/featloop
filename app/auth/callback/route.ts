import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data?.user) {
      const user = data.user;
      
      // Sync user to our database
      try {
        await db.user.upsert({
          where: { id: user.id },
          update: {
            email: user.email!,
            name: user.user_metadata?.name || user.user_metadata?.full_name || null,
            image: user.user_metadata?.avatar_url || null,
          },
          create: {
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.name || user.user_metadata?.full_name || null,
            image: user.user_metadata?.avatar_url || null,
          },
        });
      } catch (dbError) {
        console.error('Failed to sync user to database:', dbError);
      }
      
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);
}
