import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { GradientText } from '@/components/ui/GradientText'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'
import { ArrowLeftIcon, ChatBubbleLeftRightIcon, ClockIcon, CheckCircleIcon, XCircleIcon, HandThumbUpIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

interface Introduction {
  id: string
  startup_name: string
  status: string
  requested_at: string
  responded_at?: string
  outcome?: string
}

export default function Introductions() {
  const { user } = useAuth()
  const [introductions, setIntroductions] = useState<Introduction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'investor') {
      loadIntroductions()
    }
  }, [user])

  const loadIntroductions = async () => {
    try {
      const response = await api.get('/introductions/status')
      setIntroductions(response.data)
    } catch (error) {
      console.error('Failed to load introductions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin mb-4"></div>
            <div className="text-slate-500 dark:text-gray-400 font-medium">Loading introductions...</div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Introductions - ScaleX">
      <div className="bg-hero-glow bg-no-repeat bg-center opacity-10 fixed inset-0 pointer-events-none"></div>

      <div className="relative z-10 container-custom py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 animate-fade-in">
          <div>
            <Link href="/investor/dashboard" className="inline-flex items-center text-slate-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white mb-4 transition-colors font-medium">
              <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Introduction <GradientText>Requests</GradientText></h1>
            <p className="text-slate-600 dark:text-gray-400">Track and manage your interactions with startups.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {introductions.length === 0 ? (
              <GlassCard className="text-center py-20 border-slate-200 dark:border-white/10 shadow-sm">
                <div className="bg-slate-100 dark:bg-white/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-200 dark:border-white/10 shadow-inner">
                  <ChatBubbleLeftRightIcon className="w-12 h-12 text-slate-300 dark:text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">No Requests Yet</h3>
                <p className="text-slate-600 dark:text-gray-400 max-w-md mx-auto mb-10 font-medium">
                  Browse curated startups and request introductions to get started.
                </p>
                <Link href="/investor/dashboard">
                  <Button variant="primary" className="shadow-md">Browse Startups</Button>
                </Link>
              </GlassCard>
            ) : (
              <div className="grid gap-6">
                {introductions.map((intro, idx) => (
                  <GlassCard key={intro.id} delay={`${idx * 0.1}s`} className="group relative overflow-hidden border-slate-200 dark:border-white/10 shadow-md">
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                      <span className="text-6xl font-bold text-slate-900/5 dark:text-white/5 select-none">{idx + 1}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {intro.startup_name}
                          </h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${intro.status === 'requested' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30' :
                            intro.status === 'accepted' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30' :
                              intro.status === 'declined' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30' :
                                'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30'
                            }`}>
                            {intro.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-gray-400 mb-4 font-medium">
                          <span className="flex items-center gap-1.5">
                            <ClockIcon className="w-4 h-4 text-slate-400" />
                            Requested: {new Date(intro.requested_at).toLocaleDateString()}
                          </span>
                          {intro.responded_at && (
                            <span className="flex items-center gap-1.5 text-slate-700 dark:text-gray-300">
                              <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                              Responded: {new Date(intro.responded_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {intro.outcome && (
                          <div className="bg-slate-100 dark:bg-white/5 rounded-lg p-3 text-sm text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-white/5">
                            <span className="font-bold text-slate-900 dark:text-white">Outcome:</span> {intro.outcome}
                          </div>
                        )}
                      </div>

                      <div className="ml-4 flex flex-col items-end gap-2">
                        {intro.status === 'requested' && (
                          <span className="text-sm text-yellow-700 dark:text-yellow-400 flex items-center gap-1.5 bg-yellow-100 dark:bg-yellow-400/10 px-3 py-1 rounded-full font-bold border border-yellow-200 dark:border-transparent">
                            <ClockIcon className="w-4 h-4" /> Awaiting Response
                          </span>
                        )}
                        {intro.status === 'accepted' && (
                          <Button variant="primary" className="text-sm py-1.5 h-auto">
                            Schedule Meeting
                          </Button>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>

          <div>
            <GlassCard className="sticky top-24 border-slate-200 dark:border-white/10 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <InformationCircleIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Guidelines
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1 bg-primary-100 dark:bg-primary-500/20 p-2 rounded-xl h-fit border border-primary-200 dark:border-primary-500/20">
                    <HandThumbUpIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-bold text-sm tracking-tight">No Cold Outreach</h4>
                    <p className="text-xs text-slate-600 dark:text-gray-400 mt-1.5 leading-relaxed font-medium">All qualified introductions are facilitated directly through the ScaleX platform.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 bg-green-100 dark:bg-green-500/20 p-2 rounded-xl h-fit border border-green-200 dark:border-green-500/20">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-bold text-sm tracking-tight">Mutual Consent</h4>
                    <p className="text-xs text-slate-600 dark:text-gray-400 mt-1.5 leading-relaxed font-medium">Startups review all requests. Connection info is released only upon mutual opt-in.</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </Layout>
  )
}