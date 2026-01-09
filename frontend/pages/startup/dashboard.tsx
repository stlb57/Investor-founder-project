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
import { PassFeedback } from '@/components/startup/PassFeedback'
import { HealthRing } from '@/components/startup/HealthRing'
import { ShieldCheckIcon, EyeSlashIcon, ChartBarIcon, PlusIcon, EyeIcon, ClipboardDocumentIcon, CheckIcon, ClockIcon, BoltIcon, ListBulletIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { TimelineScrubber }
  from '@/components/startup/TimelineScrubber'
import { RiskSurfacing } from '@/components/startup/RiskSurfacing'
import { DiscoveryBenchmarks } from '@/components/startup/DiscoveryBenchmarks'
import { ErrorBlock } from '@/components/ui/ErrorBlock'

interface StartupProfile {
  id: string
  name: string
  slug: string
  sector: string
  stage: string
  team_size: number
  metrics?: string | { revenue_bucket?: string; users_bucket?: string; burn_bucket?: string }
  revenue_bucket: string
  users_bucket: string
  visibility_locked: boolean
  public_review_score?: number
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
  const [risks, setRisks] = useState([])
  const [benchmarks, setBenchmarks] = useState(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      setRisks(scoreResponse.data.risks || [])

      const benchmarkResponse = await api.get('/startups/discovery/peers')
      setBenchmarks(benchmarkResponse.data)

    } catch (error: any) {
      console.error('Failed to load dashboard data:', error)
      setError(error.response?.data?.detail || 'Execution metrics could not be synchronized. Verify your connection.')
    } finally {
      setLoading(false)
    }
  }

  const copyId = () => {
    if (profile?.slug) {
      navigator.clipboard.writeText(profile.slug)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin mb-4"></div>
            <div className="text-slate-500 dark:text-gray-400">Analyzing startup metrics...</div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container-custom py-20">
          <GlassCard className="max-w-lg mx-auto text-center p-12 border-slate-200 dark:border-white/10">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-emerald-400 mb-4">
              Initialize Profile
            </h2>
            <p className="text-slate-600 dark:text-gray-400 mb-8">
              Welcome to ScaleX. To generate your fundraising readiness score, we need to build your initial profile.
            </p>
            <Link href="/startup/onboarding">
              <Button icon={<PlusIcon className="w-5 h-5" />}>Start Onboarding</Button>
            </Link>
          </GlassCard>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={`${profile.name} - Startup Dashboard`}>
      <div className="bg-hero-glow bg-no-repeat bg-top-left opacity-10 fixed inset-0 pointer-events-none"></div>

      <div className="relative z-10 container-custom py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 animate-fade-in">
          <div>
            <div className="text-sm text-slate-500 dark:text-gray-400 mb-2 uppercase tracking-wider font-semibold">Startup Dashboard</div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              <GradientText>{profile.name}</GradientText>
            </h1>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 group">
                <span className="font-mono text-primary-600 dark:text-primary-400 uppercase tracking-wider">ID: {profile.slug}</span>
                <button
                  onClick={copyId}
                  className="hover:text-primary-600 dark:hover:text-white transition-colors p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10"
                  title="Copy ID to clipboard"
                >
                  {copied ? <CheckIcon className="w-3.5 h-3.5 text-green-600 dark:text-green-400" /> : <ClipboardDocumentIcon className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-gray-400 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10">
                <span className="text-slate-900 dark:text-white font-semibold">{profile.sector}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-gray-600"></span>
                <span className="text-primary-600 dark:text-primary-400 font-medium">{profile.stage}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-6 md:mt-0">
            {profile.visibility_locked && (
              <span className="px-4 py-2 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/20 flex items-center gap-2">
                <EyeSlashIcon className="w-4 h-4" /> Visibility Locked
              </span>
            )}
            <Link href="/startup/onboarding">
              <Button variant="secondary">Edit Profile</Button>
            </Link>
          </div>
        </div>



        {/* Error Handling */}
        {error && (
          <div className="mb-12">
            <ErrorBlock
              message={error}
              onRetry={() => {
                setError(null)
                setLoading(true)
                loadDashboardData()
              }}
              onClose={() => setError(null)}
            />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Score & Insights */}
          <div className="lg:col-span-2 space-y-8">
            {readinessScore && (
              <GlassCard className="animate-slide-up border-slate-200 dark:border-white/10" delay="0.1s">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ChartBarIcon className="w-6 h-6 text-primary-600 dark:text-primary-500" />
                    Readiness Score
                  </h3>
                  <div className="text-4xl font-bold text-slate-900 dark:text-white">
                    {readinessScore.score}<span className="text-lg text-slate-500 dark:text-gray-500 font-normal">/100</span>
                  </div>
                </div>
                {/* 
                     We are wrapping the existing component for now. 
                     Ideally we would rewrite ReadinessScore to be dark-mode native, 
                     but we can style the container first. 
                 */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
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

            {profile.public_review_score !== undefined && (
              <GlassCard className="animate-slide-up border-slate-200 dark:border-white/10" delay="0.15s">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheckIcon className="w-6 h-6 text-green-600 dark:text-green-500" />
                    Public Credibility (Model 3)
                  </h3>
                  <div className="text-4xl font-bold text-slate-900 dark:text-white">
                    {profile.public_review_score}<span className="text-lg text-slate-500 dark:text-gray-500 font-normal">/100</span>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-6 border border-slate-200 dark:border-white/5 shadow-inner">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
                        AI-powered analysis of public signals, website sentiment, and consistency of claims.
                        This score reflects how your startup is perceived by external stakeholders and AI diligence models.
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${profile.public_review_score >= 70 ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' :
                          profile.public_review_score >= 50 ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                            'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                          }`}>
                          {profile.public_review_score >= 90 ? 'Very Credible' :
                            profile.public_review_score >= 70 ? 'Mostly Credible' :
                              profile.public_review_score >= 50 ? 'Questionable' : 'High Risk'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RiskSurfacing risks={risks} />
              <PassFeedback />
            </div>

            <GlassCard className="animate-slide-up border-slate-200 dark:border-white/10" delay="0.2s">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ClockIcon className="w-6 h-6 text-secondary-600 dark:text-secondary-500" />
                  Journey Timeline
                </h3>
                <Link href="/startup/timeline">
                  <Button variant="secondary" className="text-sm py-1 px-3">Manage</Button>
                </Link>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <TimelineVisualization
                  events={timelineEvents}
                  showImpact={true}
                  editable={true}
                />
                <div className="mt-4">
                  <TimelineScrubber
                    currentDateIndex={timelineEvents.length - 1}
                    totalEvents={timelineEvents.length}
                    onChange={(idx) => console.log('Scrub to', idx)}
                    startDate={timelineEvents.length > 0 ? timelineEvents[0].event_date : ''}
                  />
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Right Column - Quick Stats & Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <GlassCard className="animate-slide-up border-slate-200 dark:border-white/10" delay="0.3s">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-white/10 pb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-transparent">
                  <span className="text-slate-500 dark:text-gray-400 text-sm font-medium">Team Size</span>
                  <span className="font-bold text-slate-900 dark:text-white">{profile.team_size || 'Not set'}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-transparent">
                  <span className="text-slate-500 dark:text-gray-400 text-sm font-medium">Revenue</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {(() => {
                      try {
                        const metrics = typeof profile.metrics === 'string' ? JSON.parse(profile.metrics) : profile.metrics
                        return metrics?.revenue_bucket || 'Not disclosed'
                      } catch {
                        return 'Not disclosed'
                      }
                    })()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-transparent">
                  <span className="text-slate-500 dark:text-gray-400 text-sm font-medium">Users</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {(() => {
                      try {
                        const metrics = typeof profile.metrics === 'string' ? JSON.parse(profile.metrics) : profile.metrics
                        return metrics?.users_bucket || 'Not disclosed'
                      } catch {
                        return 'Not disclosed'
                      }
                    })()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-transparent">
                  <span className="text-slate-500 dark:text-gray-400 text-sm font-medium">Events</span>
                  <span className="font-bold text-slate-900 dark:text-white">{timelineEvents.length}</span>
                </div>
              </div>
            </GlassCard>

            {/* Actions */}
            <GlassCard className="animate-slide-up border-slate-200 dark:border-white/10" delay="0.4s">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-white/10 pb-4">Actions</h3>
              <div className="space-y-3">
                <Link href="/startup/timeline" className="block">
                  <Button className="w-full justify-start shadow-sm" icon={<PlusIcon className="w-5 h-5" />}>Add Timeline Event</Button>
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
            <GlassCard className={`animate-slide-up relative overflow-hidden ${profile.visibility_locked ? 'border-red-500/30' : 'border-green-500/30'}`} delay="0.5s">
              <VisibilityCard />
            </GlassCard>

            <DiscoveryBenchmarks />
          </div>
        </div>
      </div>
    </Layout>
  )
}

function VisibilityCard() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Visibility Signal</h4>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
      </div>
      <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed mb-4">
        Your execution data is currently being synthesized for verified investors.
        Higher data density leads to better matches.
      </p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
          <div className="h-full bg-primary-500 w-[75%] rounded-full"></div>
        </div>
        <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400">75%</span>
      </div>
    </div>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  )
}