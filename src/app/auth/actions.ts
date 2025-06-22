'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signInWithPassword(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({ 
    email, 
    password 
  })

  if (error) {
    return redirect(`/auth/login?message=${encodeURIComponent(error.message)}`)
  }

  return redirect('/')
}

export async function signInWithOtp(formData: FormData) {
  const email = formData.get('email') as string
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { 
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` 
    },
  })

  if (error) {
    return redirect(`/auth/login?message=${encodeURIComponent(error.message)}`)
  }

  return redirect('/auth/login?message=Check email to continue sign in process')
}

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return redirect(`/auth/signup?message=${encodeURIComponent(error.message)}`)
  }

  return redirect('/auth/login?message=Check email to continue sign in process')
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  return redirect('/auth/login')
} 