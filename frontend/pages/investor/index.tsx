import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { GradientText } from '@/components/ui/GradientText'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'
import { EyeIcon, HeartIcon, XMarkIcon, ChevronRightIcon, BoltIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

interface CuratedStartup {
  id: string
  name: string
  sector: string
  stage: string
  readiness_band: string
  match_reason: string
  visible_risk: string
  final_match_score: number
}

interface InvestorProfile {
  id: string
  name: string
  stage_focus: string[]
  sector_focus: string[]
  check_size_min?: number
  check_size_max?: number
}

export default function InvestorDashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<InvestorProfile | null>(null)
  const [curatedStartups, setCuratedStartups] = useState<CuratedStartup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'investor') {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      const profileResponse = await api.get('/investors/profile')
      setProfile(profileResponse.data)

      const startupsResponse = await api.get('/investors/curated-startups')
      setCuratedStartups(startupsResponse.data)

    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartupAction = async (startupId: string, action: string) => {
    try {
      await api.post(`/investors/interests/${startupId}`, { action })

      if (action === 'passed') {
        setCuratedStartups((prev: CuratedStartup[]) => prev.filter((s: CuratedStartup) => s.id !== startupId))
      }
    } catch (error) {
      console.error('Failed to track interest:', error)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin mb-4"></div>
            <div className="text-slate-500 dark:text-gray-400 font-medium">Curating deal flow...</div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!profile) {
    return (
      <Layout title="Complete Profile - ScaleX">
        <div className="container-custom py-20">
          <GlassCard className="max-w-lg mx-auto text-center border-slate-200 dark:border-white/10 shadow-lg" delay="0.1s">
            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center mx-auto mb-6 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-500/20 shadow-inner">
              <BoltIcon className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Complete Your Profile</h2>
            <p className="text-slate-600 dark:text-gray-400 mb-8 font-medium">Set up your investment thesis to start receiving AI-curated deal flow.</p>
            <Link href="/investor/onboarding">
              <Button className="shadow-md">Complete Onboarding <ArrowRightIcon className="w-4 h-4 ml-2" /></Button>
            </Link>
          </GlassCard>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Investor Dashboard - ScaleX">
      <div className="bg-hero-glow bg-no-repeat bg-top-right opacity-10 fixed inset-0 pointer-events-none"></div>

      <div className="relative z-10 container-custom py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 animate-fade-in">
          <div>
            <div className="text-sm text-slate-500 dark:text-gray-400 mb-2 font-medium">Welcome back</div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight"><GradientText>{profile.name}</GradientText></h1>
            <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-gray-400 bg-slate-100 dark:bg-white/5 inline-flex px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 font-bold">
              <span>{(profile.stage_focus || []).join(', ')}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-gray-600"></span>
              <span>{(profile.sector_focus || []).join(', ')}</span>
            </div>
          </div>
          <div className="flex gap-4 mt-6 md:mt-0">
            <Link href="/investor/intros">
              <Button variant="secondary" className="shadow-sm">Introductions</Button>
            </Link>
            <Link href="/investor/onboarding">
              <Button variant="secondary" className="shadow-sm">Settings</Button>
            </Link>
          </div>
        </div>

        {/* Curated Startups */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
            Curated For You
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-500/30 font-black">
              {curatedStartups.length} Matches
            </span>
          </h2>
        </div>

        {curatedStartups.length === 0 ? (
          <GlassCard className="text-center py-20 border-slate-200 dark:border-white/10 shadow-sm">
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-6 text-slate-400 dark:text-gray-500 border border-slate-200 dark:border-white/10 shadow-inner">
              <BoltIcon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No matches yet</h3>
            <p className="text-slate-600 dark:text-gray-400 max-w-md mx-auto font-medium leading-relaxed">
              Our AI is analyzing new startups against your investment thesis. We prioritize quality over volume. Check back soon.
            </p>
          </GlassCard>
        ) : (
          <div className="grid gap-6">
            {curatedStartups.map((startup, idx) => (
              <GlassCard key={startup.id} delay={`${idx * 0.1}s`} className="group relative overflow-hidden border-slate-200 dark:border-white/10 shadow-md">
                <div className="absolute top-0 right-0 p-4 opacity-50">
                  <span className="text-6xl font-bold text-slate-900/5 dark:text-white/5 select-none">{idx + 1}</span>
                </div>

                <div className="flex flex-col md:flex-row gap-8 relative z-10 w-full">
                  {/* Startup Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors tracking-tight">
                          {startup.name}
                        </h3>
                        <div className="flex gap-2">
                          <span className="px-2.5 py-1 bg-slate-100 dark:bg-white/10 rounded-lg text-[10px] text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-white/10 uppercase tracking-widest font-black">
                            {startup.sector}
                          </span>
                          <span className="px-2.5 py-1 bg-primary-100 dark:bg-primary-500/10 rounded-lg text-[10px] text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-500/20 uppercase tracking-widest font-black">
                            {startup.stage}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <div className="text-[10px] text-slate-500 dark:text-gray-500 uppercase tracking-widest mb-1 font-black">Signal Strength</div>
                        <div className={`text-lg font-black uppercase tracking-tight ${startup.readiness_band === 'High' ? 'text-green-600 dark:text-green-400' :
                          startup.readiness_band === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                          {startup.readiness_band} Signal
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 dark:text-gray-500 uppercase tracking-widest mb-1 font-black">Match Reason</div>
                        <div className="text-sm text-slate-700 dark:text-gray-300 font-bold leading-tight">{startup.match_reason}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 dark:text-gray-500 uppercase tracking-widest mb-1 font-black">Risk Factor</div>
                        <div className="text-sm text-red-600 dark:text-red-400 font-black tracking-tight">{startup.visible_risk}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                      <div className="text-[10px] text-slate-500 dark:text-gray-500 flex items-center gap-1.5 uppercase font-black tracking-widest">
                        <ShieldCheckIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                        Bias-mitigated evaluation
                      </div>
                      <Link href={`/investor/startups/${startup.id}`}>
                        <Button className="text-[10px] px-4 py-2 font-black uppercase tracking-widest shadow-sm">
                          View Full Analysis <ChevronRightIcon className="w-4 h-4 ml-1.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Quick Actions Panel */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-6 border-t md:border-t-0 md:border-l border-slate-100 dark:border-white/10 pt-4 md:pt-0 md:pl-8 min-w-[140px]">
                    <div className="text-center md:text-right">
                      <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-primary-400 dark:from-primary-400 dark:to-cyan-400 tracking-tighter">
                        {Math.round(startup.final_match_score * 100)}%
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-gray-500 uppercase tracking-widest font-black">Fit Score</div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartupAction(startup.id, 'passed')}
                        className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all border border-slate-200 dark:border-transparent hover:border-red-500/20 shadow-inner"
                        title="Pass"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleStartupAction(startup.id, 'watched')}
                        className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-green-500/10 text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-all border border-slate-200 dark:border-transparent hover:border-green-500/20 shadow-inner"
                        title="Watch List"
                      >
                        <HeartIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  )
}
