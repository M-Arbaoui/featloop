'use server';

import { createClient } from '@/lib/supabase/server';
import db from '@/lib/db';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data?.user) {
    // Ensure user is synced in DB
    try {
      await db.user.upsert({
        where: { id: data.user.id },
        update: {
          email: data.user.email!,
          name: data.user.user_metadata?.name || null,
        },
        create: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name || null,
        },
      });
    } catch (dbError) {
      console.error('Database sync error on login:', dbError);
    }
  }

  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || undefined,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data?.user) {
    // If Supabase immediately returns a session (e.g. email verification is off), sync to DB
    if (data.session) {
      try {
        await db.user.upsert({
          where: { id: data.user.id },
          update: {
            email: data.user.email!,
            name: name || null,
          },
          create: {
            id: data.user.id,
            email: data.user.email!,
            name: name || null,
          },
        });
      } catch (dbError) {
        console.error('Database sync error on signup:', dbError);
      }
      redirect('/dashboard');
    } else {
      // If email verification is on, they must confirm their email first
      return { success: 'Check your email for the confirmation link to complete registration.' };
    }
  }

  return { error: 'Something went wrong.' };
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
