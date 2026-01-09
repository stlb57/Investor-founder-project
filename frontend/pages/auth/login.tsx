import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/ThemeProvider'
import { Button } from '@/components/ui/Button'
import { ErrorBlock } from '@/components/ui/ErrorBlock'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const { login } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Sign In - ScaleX</title>
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
              Find execution-ready startups with verifiable traction.
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 bg-surface flex flex-col justify-center py-12 px-6 lg:px-20 border-l border-slate-200 dark:border-white/5 relative">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Link href="/" className="lg:hidden flex items-center gap-3 mb-8">
              <div className="relative w-10 h-10">
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

            <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">Welcome back</h2>
            <p className="text-slate-600 dark:text-gray-400 mb-8">Please enter your details to sign in.</p>

            <form className="space-y-6" onSubmit={handleSubmit}>
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
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-gray-300">
                    Password
                  </label>
                  <a href="#" className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
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
                  title="Authentication Failed"
                  onClose={() => setError('')}
                />
              )}

              <div>
                <Button type="submit" className="w-full" isLoading={loading}>
                  Sign in
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-surface text-slate-500">New to ScaleX?</span>
                </div>
              </div>

              <Link href="/auth/signup" className="block w-full btn-secondary text-center">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}