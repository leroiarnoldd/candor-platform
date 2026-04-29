'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'candidate' | 'company'>('candidate')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role }
        }
      })

      if (signupError) throw signupError

      if (data.user) {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-white text-3xl font-bold mb-8">Join Candor</h1>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full bg-zinc-900 text-white px-4 py-3 rounded-lg border border-zinc-700 focus:outline-none focus:border-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full bg-zinc-900 text-white px-4 py-3 rounded-lg border border-zinc-700 focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full bg-zinc-900 text-white px-4 py-3 rounded-lg border border-zinc-700 focus:outline-none focus:border-blue-500"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setRole('candidate')}
              className={`flex-1 py-3 rounded-lg border font-medium transition-colors ${
                role === 'candidate'
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-transparent border-zinc-700 text-zinc-400'
              }`}
            >
              I'm a Candidate
            </button>
            <button
              type="button"
              onClick={() => setRole('company')}
              className={`flex-1 py-3 rounded-lg border font-medium transition-colors ${
                role === 'company'
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-transparent border-zinc-700 text-zinc-400'
              }`}
            >
              I'm a Company
            </button>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="text-zinc-500 text-sm mt-6 text-center">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}