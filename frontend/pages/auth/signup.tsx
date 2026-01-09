import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/ThemeProvider'
import { Button } from '@/components/ui/Button'
import { ErrorBlock } from '@/components/ui/ErrorBlock'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'investor' | 'startup'>('startup')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const { signup } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // Set role from query parameter
    if (router.query.role === 'investor' || router.query.role === 'startup') {
      setRole(router.query.role)
    }
  }, [router.query.role])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signup(email, password, role)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Sign Up - ScaleX</title>
      </Head>

      <div className="min-h-screen flex text-slate-900 dark:text-white">
        {/* Left Side - Visuals */}
        <div className="hidden lg:flex lg:w-1/2 bg-background relative overflow-hidden items-center justify-center">
          <div className="bg-hero-glow bg-no-repeat bg-center opacity-30 absolute inset-0 animate-pulse-slow"></div>
          <div className="relative z-10 p-12 text-center max-w-lg">
            <div className="relative w-32 h-32 mx-auto mb-8">
              {mounted && (
                <Image
                  src={theme === 'dark' ? '/logo_dark.png' : '/logo.png'}
                  alt="ScaleX Logo"
                  fill
                  className="object-contain"
                />
              )}
            </div>
            <h1 className="text-5xl font-bold mb-6 tracking-tight">
              Join the <span className="text-gradient">Future</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-gray-400 leading-relaxed">
              {role === 'startup'
                ? "Get funded based on your execution, not your connections."
                : "Find execution-ready startups with verifiable traction."}
            </p>
          </div>

          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 bg-surface flex flex-col justify-center py-12 px-6 lg:px-20 border-l border-slate-200 dark:border-white/5 relative">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Link href="/" className="lg:hidden flex items-center gap-3 mb-8">
              <div className="relative w-12 h-12">
                {mounted && (
                  <Image
                    src={theme === 'dark' ? '/logo_dark.png' : '/logo.png'}
                    alt="ScaleX Logo"
                    fill
                    className="object-contain"
                  />
                )}
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">ScaleX</span>
            </Link>

            <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">Create an account</h2>
            <p className="text-slate-600 dark:text-gray-400 mb-8">Get started with ScaleX today.</p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">I am a...</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('startup')}
                    className={`p-4 rounded-xl border transition-all duration-300 ${role === 'startup'
                      ? 'bg-primary-600/10 dark:bg-primary-600/20 border-primary-500 text-primary-600 dark:text-primary-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                      : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                  >
                    <span className="block font-medium mb-1">Founder</span>
                    <span className="text-xs opacity-70">Raising capital</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('investor')}
                    className={`p-4 rounded-xl border transition-all duration-300 ${role === 'investor'
                      ? 'bg-primary-600/10 dark:bg-primary-600/20 border-primary-500 text-primary-600 dark:text-primary-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                      : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                  >
                    <span className="block font-medium mb-1">Investor</span>
                    <span className="text-xs opacity-70">Scouting deals</span>
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input-field"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <ErrorBlock
                  message={error}
                  title="Signup Failed"
                  onClose={() => setError('')}
                />
              )}

              <Button type="submit" className="w-full" isLoading={loading}>
                Create account
              </Button>
            </form>

            <div className="mt-8 text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-surface text-slate-500">Already a member?</span>
                </div>
              </div>

              <Link href="/auth/login" className="block w-full btn-secondary text-center">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
