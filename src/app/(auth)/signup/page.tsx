'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)

    setTimeout(() => {
      router.push('/dashboard')
      router.refresh()
    }, 1500)
  }

  if (success) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200/80 p-8 shadow-sm text-center">
        <h2 className="text-lg font-semibold text-[#09090b] mb-2 tracking-tight">Welcome to the team</h2>
        <p className="text-[14px] text-neutral-400">
          Check your email for a confirmation link, or you may be redirected automatically.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 p-8 shadow-sm">
      <h2 className="text-lg font-semibold text-[#09090b] mb-6 tracking-tight">Create your account</h2>

      <form onSubmit={handleSignup} className="space-y-4">
        <Input
          id="fullName"
          label="Full Name"
          placeholder="Your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Min 6 characters"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 border border-red-200">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-neutral-400">
        Already have an account?{' '}
        <Link href="/login" className="text-[#09090b] hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}
