import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { GradientText } from '@/components/ui/GradientText'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'
import ReadinessScore from '@/components/scoring/ReadinessScore' // We may need to update this component too, but for now wrap it
import TimelineVisualization from '@/components/timeline/TimelineVisualization' // Same here
import { ChartBarIcon, ClockIcon, BoltIcon, EyeIcon, EyeSlashIcon, PlusIcon, ListBulletIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

interface StartupProfile {
  id: string
  name: string
  sector: string
  stage: string
  team_size: number
  revenue_bucket: string
  users_bucket: string
  visibility_locked: boolean
}

interface ReadinessScoreData {
  score: number
  confidence_band: number
  components: any
  strengths: string[]
  weaknesses: string[]
  improvements: string[]
}

export default function StartupDashboardIndex() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<StartupProfile | null>(null)
  const [readinessScore, setReadinessScore] = useState<ReadinessScoreData | null>(null)
  const [timelineEvents, setTimelineEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'startup') {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      const profileResponse = await api.get('/startups/profile')
      setProfile(profileResponse.data)

      const eventsResponse = await api.get('/startups/timeline/events')
      setTimelineEvents(eventsResponse.data)

      const scoreResponse = await api.post('/scoring/readiness', {
        startup_id: profileResponse.data.id
      })
      setReadinessScore(scoreResponse.data)

    } catch (error) {
      console.error('Failed to load dashboard data:', error)
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
            <div className="text-slate-500 dark:text-gray-400 font-medium">Analyzing startup metrics...</div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!profile) {
    return (
      <Layout title="Welcome to ScaleX">
        <div className="container-custom py-20">
          <GlassCard className="max-w-lg mx-auto text-center p-12 border-slate-200 dark:border-white/10 shadow-lg">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-cyan-400 mb-4 tracking-tight">
              Initialize Profile
            </h2>
            <p className="text-slate-600 dark:text-gray-400 mb-8 font-medium">
              Welcome to ScaleX. To generate your fundraising readiness score, we need to build your initial profile.
            </p>
            <Link href="/startup/onboarding">
              <Button icon={<PlusIcon className="w-5 h-5" />} className="shadow-md">Start Onboarding</Button>
            </Link>
          </GlassCard>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={`${profile.name} - Startup Dashboard - ScaleX`}>
      <div className="bg-hero-glow bg-no-repeat bg-top-left opacity-10 fixed inset-0 pointer-events-none"></div>

      <div className="relative z-10 container-custom py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 animate-fade-in">
          <div>
            <div className="text-[10px] text-slate-500 dark:text-gray-500 mb-2 uppercase tracking-widest font-black">Startup Dashboard</div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
              <GradientText>{profile.name}</GradientText>
            </h1>
            <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-gray-400 bg-slate-100 dark:bg-white/5 inline-flex px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 font-bold">
              <span className="text-slate-900 dark:text-white">{profile.sector}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-gray-600"></span>
              <span className="text-primary-600 dark:text-primary-400">{profile.stage}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-6 md:mt-0">
            {profile.visibility_locked && (
              <span className="px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-xs rounded-full border border-red-200 dark:border-red-500/20 flex items-center gap-2 font-black uppercase tracking-widest">
                <EyeSlashIcon className="w-4 h-4" /> Visibility Locked
              </span>
            )}
            <Link href="/startup/onboarding">
              <Button variant="secondary" className="shadow-sm">Edit Profile</Button>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Score & Insights */}
          <div className="lg:col-span-2 space-y-8">
            {readinessScore && (
              <GlassCard className="animate-slide-up border-slate-200 dark:border-white/10 shadow-sm" delay="0.1s">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                    <ChartBarIcon className="w-6 h-6 text-primary-600 dark:text-primary-500" />
                    Readiness Score
                  </h3>
                  <div className="text-4xl font-black text-slate-900 dark:text-white">
                    {readinessScore.score}<span className="text-lg text-slate-400 dark:text-gray-500 font-medium">/100</span>
                  </div>
                </div>
                {/* 
                     We are wrapping the existing component for now. 
                     Ideally we would rewrite ReadinessScore to be dark-mode native, 
                     but we can style the container first. 
                 */}
                <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-6 border border-slate-100 dark:border-white/5 shadow-inner">
                  <ReadinessScore
                    score={readinessScore.score}
                    confidenceBand={readinessScore.confidence_band}
                    components={readinessScore.components}
                    strengths={readinessScore.strengths}
                    weaknesses={readinessScore.weaknesses}
                    improvements={readinessScore.improvements}
                    showDetails={true}
                  />
                </div>
              </GlassCard>
            )}

            <GlassCard className="animate-slide-up border-slate-200 dark:border-white/10 shadow-sm" delay="0.2s">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                  <ClockIcon className="w-6 h-6 text-cyan-600 dark:text-cyan-500" />
                  Journey Timeline
                </h3>
                <Link href="/startup/timeline">
                  <Button variant="secondary" className="text-xs py-1 px-4 font-bold shadow-sm">Manage</Button>
                </Link>
              </div>
              <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-6 border border-slate-100 dark:border-white/5 shadow-inner">
                <TimelineVisualization
                  events={timelineEvents}
                  showImpact={true}
                  editable={true}
                />
              </div>
            </GlassCard>
          </div>

          {/* Right Column - Quick Stats & Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <GlassCard className="animate-slide-up border-slate-200 dark:border-white/10 shadow-sm" delay="0.3s">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-white/10 pb-4 tracking-tight">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 shadow-inner">
                  <span className="text-slate-500 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">Team Size</span>
                  <span className="font-black text-slate-900 dark:text-white">{profile.team_size}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 shadow-inner">
                  <span className="text-slate-500 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">Revenue</span>
                  <span className="font-black text-slate-900 dark:text-white">{profile.revenue_bucket}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 shadow-inner">
                  <span className="text-slate-500 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">Users</span>
                  <span className="font-black text-slate-900 dark:text-white">{profile.users_bucket}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 shadow-inner">
                  <span className="text-slate-500 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">Events</span>
                  <span className="font-black text-slate-900 dark:text-white">{timelineEvents.length}</span>
                </div>
              </div>
            </GlassCard>

            {/* Actions */}
            <GlassCard className="animate-slide-up" delay="0.4s">
              <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4">Actions</h3>
              <div className="space-y-3">
                <Link href="/startup/timeline" className="block">
                  <Button className="w-full justify-start" icon={<PlusIcon className="w-5 h-5" />}>Add Timeline Event</Button>
                </Link>
                <Link href="/startup/improve" className="block">
                  <Button variant="secondary" className="w-full justify-start" icon={<ListBulletIcon className="w-5 h-5" />}>Improvement Tasks</Button>
                </Link>
                <Link href="/startup/intros" className="block">
                  <Button variant="secondary" className="w-full justify-start" icon={<ChatBubbleLeftRightIcon className="w-5 h-5" />}>Introduction Requests</Button>
                </Link>
              </div>
            </GlassCard>

            {/* Visibility Status */}
            <GlassCard className={`animate-slide-up relative overflow-hidden shadow-lg ${profile.visibility_locked ? 'border-red-200 dark:border-red-500/30' : 'border-green-200 dark:border-green-500/30'}`} delay="0.5s">
              <div className={`absolute inset-0 opacity-10 ${profile.visibility_locked ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 relative z-10 flex items-center gap-2 tracking-tight">
                {profile.visibility_locked ? <EyeSlashIcon className="w-5 h-5 text-red-600 dark:text-red-400" /> : <EyeIcon className="w-5 h-5 text-green-600 dark:text-green-400" />}
                Visibility Status
              </h3>
              {profile.visibility_locked ? (
                <div className="relative z-10">
                  <p className="text-sm text-red-800 dark:text-red-200 mb-2 font-bold">Your startup is hidden from investors.</p>
                  <p className="text-[10px] text-red-700 dark:text-red-300/70 uppercase font-black tracking-widest">
                    Visibility key: Consistent timeline updates (gap &lt; 30 days).
                  </p>
                </div>
              ) : (
                <div className="relative z-10">
                  <p className="text-sm text-green-800 dark:text-green-200 mb-2 font-bold">Your startup is visible to investors.</p>
                  <p className="text-[10px] text-green-700 dark:text-green-300/70 uppercase font-black tracking-widest">
                    Keep adding milestones to maintain visibility.
                  </p>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </Layout>
  )
}