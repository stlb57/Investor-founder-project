import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { GradientText } from '@/components/ui/GradientText'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'
import {
  ArrowLeftIcon,
  MapPinIcon,
  GlobeAltIcon,
  UsersIcon,
  CalendarIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  BoltIcon
} from '@heroicons/react/24/outline'

interface StartupDetails {
  id: string
  name: string
  description: string
  sector: string
  stage: string
  location: string
  impact_tags: string[]
  team_size: number
  metrics: any
  timeline: any[]
  readiness_score: number
  readiness_band: string
  readiness_breakdown: string
  public_review_score: number
  public_review_explanation: string
  execution_gap: any
  momentum: string
}

export default function StartupDetailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { id } = router.query
  const [startup, setStartup] = useState<StartupDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [requestingIntro, setRequestingIntro] = useState(false)

  useEffect(() => {
    if (id) {
      fetchStartup()
    }
  }, [id])

  const fetchStartup = async () => {
    try {
      const response = await api.get(`/investors/startup/${id}`)
      setStartup(response.data)
    } catch (error) {
      console.error('Failed to fetch startup:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestIntro = async () => {
    setRequestingIntro(true)
    try {
      await api.post('/introductions/request', { startup_id: id })
      // Consider adding a toast notification here
      router.push('/investor/intros')
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to request introduction')
    } finally {
      setRequestingIntro(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin mb-4"></div>
            <div className="text-slate-500 dark:text-gray-400 font-medium">Loading startup details...</div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!startup) {
    return (
      <Layout>
        <div className="container-custom py-20 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Startup not found</h2>
          <Link href="/investor/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={`${startup.name} - ScaleX`}>
      <div className="bg-hero-glow bg-no-repeat bg-center opacity-10 fixed inset-0 pointer-events-none"></div>

      <div className="relative z-10 container-custom py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link href="/investor/dashboard" className="inline-flex items-center text-slate-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white mb-6 transition-colors font-medium">
            <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{startup.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-gray-400 font-medium">
                <span className="flex items-center">
                  <ChartBarIcon className="w-4 h-4 mr-1.5 text-primary-600 dark:text-primary-400" /> {startup.stage}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-gray-600"></span>
                <span className="flex items-center">
                  <BoltIcon className="w-4 h-4 mr-1.5 text-yellow-600 dark:text-yellow-400" /> {startup.sector}
                </span>
                {startup.location && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-gray-600"></span>
                    <span className="flex items-center">
                      <MapPinIcon className="w-4 h-4 mr-1.5 text-slate-400 dark:text-gray-400" /> {startup.location}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={handleRequestIntro}
                isLoading={requestingIntro}
                disabled={requestingIntro}
                className="bg-primary-500 hover:bg-primary-600"
              >
                Request Introduction
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8 animate-slide-up">
            <GlassCard className="border-slate-200 dark:border-white/10 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">About</h2>
              <p className="text-slate-600 dark:text-gray-300 leading-relaxed mb-6 font-medium">{startup.description}</p>

              {startup.impact_tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {startup.impact_tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-white/10 uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </GlassCard>

            <GlassCard className="border-slate-200 dark:border-white/10 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Traction & Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center shadow-inner">
                  <div className="text-xs text-slate-500 dark:text-gray-500 mb-1 uppercase tracking-wider font-bold">Users</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{startup.metrics?.users_bucket || 'N/A'}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center shadow-inner">
                  <div className="text-xs text-slate-500 dark:text-gray-500 mb-1 uppercase tracking-wider font-bold">Revenue</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{startup.metrics?.revenue_bucket || 'N/A'}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center shadow-inner">
                  <div className="text-xs text-slate-500 dark:text-gray-500 mb-1 uppercase tracking-wider font-bold">Team Size</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{startup.team_size}</div>
                </div>
                <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-500/5 border border-cyan-200 dark:border-cyan-500/20 text-center shadow-inner">
                  <div className="text-xs text-cyan-700 dark:text-cyan-500 mb-1 uppercase tracking-wider font-bold">Momentum</div>
                  <div className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{startup.momentum}</div>
                </div>
                {startup.execution_gap?.has_gap && (
                  <div className="col-span-2 p-4 rounded-2xl bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 flex items-center gap-4 shadow-inner">
                    <ShieldCheckIcon className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <div className="text-left">
                      <div className="text-xs text-red-700 dark:text-red-500 font-black uppercase tracking-widest">Risk Alert</div>
                      <div className="text-red-800 dark:text-red-200/80 text-sm font-bold">Execution gap detected ({startup.execution_gap.largest_gap_days} days)</div>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>

            <GlassCard className="border-slate-200 dark:border-white/10 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Timeline</h2>
              {startup.timeline.length === 0 ? (
                <p className="text-slate-500 dark:text-gray-500 italic font-medium">No timeline events reported yet.</p>
              ) : (
                <div className="relative border-l-2 border-slate-100 dark:border-white/10 ml-3 space-y-10">
                  {startup.timeline.map((event, idx) => (
                    <div key={idx} className="relative pl-8">
                      <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-primary-600 dark:bg-primary-500 border-4 border-white dark:border-slate-900 shadow-sm"></div>
                      <div className="text-[10px] text-primary-700 dark:text-primary-400 font-black uppercase tracking-widest mb-1">{event.event_type}</div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 leading-tight">{event.title}</h3>
                      <div className="text-slate-500 dark:text-gray-500 text-xs mb-3 font-bold">{new Date(event.event_date).toLocaleDateString()}</div>
                      {event.description && <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed font-medium bg-slate-50 dark:bg-white/5 p-3 rounded-lg border border-slate-100 dark:border-white/5">{event.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <GlassCard className="text-center relative overflow-hidden border-slate-200 dark:border-white/10 shadow-lg">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-600 to-cyan-500 dark:from-primary-500 dark:to-cyan-500"></div>
              <div className="mb-4 text-slate-500 dark:text-gray-500 text-xs font-black uppercase tracking-widest">Readiness Score</div>
              <div className={`text-7xl font-black mb-3 ${getScoreColor(startup.readiness_score).replace('text-green-400', 'text-green-600 dark:text-green-400').replace('text-yellow-400', 'text-yellow-600 dark:text-yellow-400').replace('text-red-400', 'text-red-600 dark:text-red-400')}`}>
                {startup.readiness_score}
              </div>
              <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white text-xs font-black uppercase tracking-widest mb-8 border border-slate-200 dark:border-white/10">
                {startup.readiness_band} Band
              </div>
              <div className="text-left bg-slate-50 dark:bg-white/5 rounded-xl p-5 text-sm text-slate-600 dark:text-gray-300 border border-slate-100 dark:border-white/5 font-medium leading-relaxed">
                {startup.readiness_breakdown}
              </div>
            </GlassCard>

            <GlassCard className="text-center relative overflow-hidden border-slate-200 dark:border-white/10 shadow-lg">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-purple-500 dark:from-blue-500 dark:to-purple-500"></div>
              <div className="mb-4 text-slate-500 dark:text-gray-500 text-xs font-black uppercase tracking-widest">Public Sentiment</div>
              <div className="text-6xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">
                {startup.public_review_score}
              </div>
              <p className="text-slate-500 dark:text-gray-400 text-xs font-bold mb-6">Based on market signals</p>
              <div className="text-left bg-slate-50 dark:bg-white/5 rounded-xl p-5 text-sm text-slate-600 dark:text-gray-300 border border-slate-100 dark:border-white/5 font-medium leading-relaxed">
                {startup.public_review_explanation}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </Layout>
  )
}
