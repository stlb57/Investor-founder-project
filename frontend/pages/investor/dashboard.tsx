import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { GradientText } from '@/components/ui/GradientText'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'
import {
  EyeIcon,
  HeartIcon,
  XMarkIcon,
  ChevronRightIcon,
  BoltIcon,
  ShieldCheckIcon,
  MapIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import { DiscoveryMap } from '@/components/investor/DiscoveryMap'
import { SearchPanel } from '@/components/investor/SearchPanel'
import { ErrorBlock } from '@/components/ui/ErrorBlock'

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
  const [curatedStartups, setCuratedStartups] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [loading, setLoading] = useState(true)
  const [showWatchModal, setShowWatchModal] = useState(false)
  const [selectedStartupId, setSelectedStartupId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

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

    } catch (error: any) {
      console.error('Failed to load dashboard data:', error)
      setError(error.response?.data?.detail || 'The investment signal was lost. Please check your connectivity.')
    } finally {
      setLoading(false)
    }
  }

  const handleStartupAction = async (startupId: string, action: string) => {
    try {
      await api.post(`/investors/interests/${startupId}`, { action })

      if (action === 'passed') {
        setCuratedStartups((prev: CuratedStartup[]) => prev.filter((s: CuratedStartup) => s.id !== startupId))
        setSearchResults((prev: any[]) => prev.filter((s: any) => s.id !== startupId))
      }
    } catch (error) {
      console.error('Failed to track interest:', error)
    }
  }

  const handleSearch = async (filters: any) => {
    setLoading(true)
    setIsSearching(true)
    try {
      const response = await api.post('/investors/search', filters)
      setSearchResults(response.data)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWatchClick = (startupId: string) => {
    setSelectedStartupId(startupId)
    setShowWatchModal(true)
  }

  const confirmWatch = async (intent: string) => {
    if (!selectedStartupId) return
    try {
      await api.post(`/investors/watchlist/${selectedStartupId}`, { intent })
      const action = 'watched'
      setCuratedStartups(prev => prev.filter(s => s.id !== selectedStartupId))
      setSearchResults(prev => prev.filter(s => s.id !== selectedStartupId))
      setShowWatchModal(false)
      setSelectedStartupId(null)
    } catch (error) {
      console.error('Action failed:', error)
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
      <Layout>
        <div className="container-custom py-20">
          <GlassCard className="max-w-lg mx-auto text-center" delay="0.1s">
            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center mx-auto mb-6 text-primary-600 dark:text-primary-400">
              <BoltIcon className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Complete Your Profile</h2>
            <p className="text-slate-600 dark:text-gray-400 mb-8">Set up your investment thesis to start receiving AI-curated deal flow.</p>
            <Link href="/investor/onboarding">
              <Button>Complete Onboarding <ArrowRightIcon className="w-4 h-4 ml-2" /></Button>
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
            <div className="text-sm text-slate-500 dark:text-gray-400 mb-2 uppercase tracking-wider font-semibold">Investor Dashboard</div>
            <Link href="/investor/dashboard" className="hover:opacity-80 transition-opacity">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4"><GradientText>{profile.name}</GradientText></h1>
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 group">
                <span className="font-mono text-primary-600 dark:text-primary-400 uppercase tracking-wider">ID: {profile.id.slice(0, 8)}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(profile.id)
                  }}
                  className="hover:text-primary-600 dark:hover:text-white transition-colors p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10"
                  title="Copy ID to clipboard"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-gray-400 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10">
                <span className="font-medium">{(profile.stage_focus || []).join(', ')}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-gray-600"></span>
                <span className="font-medium">{(profile.sector_focus || []).join(', ')}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-6 md:mt-0">
            <Link href="/investor/intros">
              <Button variant="secondary">Introductions</Button>
            </Link>
            <Link href="/investor/onboarding">
              <Button variant="secondary">Settings</Button>
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

        {/* Search & Discovery */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Discovery</h2>
            <div className="flex bg-slate-100 dark:bg-white/5 rounded-lg p-1 border border-slate-200 dark:border-white/10">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded text-sm flex items-center gap-2 transition-colors ${viewMode === 'list' ? 'bg-primary-600 text-white shadow-md' : 'text-slate-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white'}`}
              >
                <MagnifyingGlassIcon className="w-4 h-4" /> Search
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1 rounded text-sm flex items-center gap-2 transition-colors ${viewMode === 'map' ? 'bg-primary-600 text-white shadow-md' : 'text-slate-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white'}`}
              >
                <MapIcon className="w-4 h-4" /> Map
              </button>
            </div>
          </div>

          {viewMode === 'map' ? (
            <DiscoveryMap />
          ) : (
            <div className="animate-fade-in">
              <SearchPanel onSearch={handleSearch} />

              {isSearching && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Search Results <span className="text-slate-500 dark:text-gray-400 text-sm font-normal">({searchResults.length})</span>
                  </h3>
                  <div className="grid gap-4">
                    {searchResults.map((startup) => (
                      <GlassCard key={startup.id} className="flex justify-between items-center group border-slate-200 dark:border-white/10 shadow-sm">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">{startup.name}</h4>
                          <p className="text-sm text-slate-600 dark:text-gray-400 font-medium">{startup.sector} • {startup.stage}</p>
                          <div className="text-xs text-slate-500 dark:text-gray-500 mt-1">{startup.explanation}</div>
                        </div>
                        <Link href={`/investor/startups/${startup.id}`}>
                          <Button variant="secondary" className="text-sm">View Profile</Button>
                        </Link>
                      </GlassCard>
                    ))}
                    {searchResults.length === 0 && (
                      <div className="text-center py-8 text-slate-500 dark:text-gray-500 font-medium">No startups found matching your criteria.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Curated Startups (Only show if NOT searching or if searching is empty but that might be confusing. Let's keep it below or hide if searching) */}
        {!isSearching && viewMode === 'list' && (
          <>
            <div className="mb-8 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Curated For You
                <span className="text-xs px-2 py-1 rounded bg-primary-500/20 text-primary-400 border border-primary-500/30">
                  {curatedStartups.length} Matches
                </span>
              </h2>
            </div>
          </>
        )}

        {!isSearching && viewMode === 'list' && (
          curatedStartups.length === 0 ? (
            <GlassCard className="text-center py-16 border-slate-200 dark:border-white/10">
              <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-6 text-slate-400 dark:text-gray-500">
                <BoltIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No matches yet</h3>
              <p className="text-slate-600 dark:text-gray-400 max-w-md mx-auto">
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
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                            {startup.name}
                            <span className="ml-2 text-xs font-mono text-slate-500 dark:text-gray-500 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded border border-slate-200 dark:border-white/5">
                              ID: {startup.slug || startup.id.slice(0, 8)}
                            </span>
                          </h3>
                          <div className="flex gap-2">
                            <span className="px-2 py-1 bg-slate-100 dark:bg-white/10 rounded text-xs text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-white/10 uppercase tracking-wider font-medium">
                              {startup.sector}
                            </span>
                            <span className="px-2 py-1 bg-primary-100 dark:bg-primary-500/10 rounded text-xs text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-500/20 uppercase tracking-wider font-medium">
                              {startup.stage}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                        <div>
                          <div className="text-xs text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-1 font-medium">Signal Strength</div>
                          <div className={`text-lg font-bold ${startup.readiness_band === 'High' ? 'text-green-600 dark:text-green-400' :
                            startup.readiness_band === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                            {startup.readiness_band} Signal
                          </div>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <div className="text-xs text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1 font-bold">Why This Was Shown</div>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-100 dark:bg-primary-500/10 rounded-full text-xs text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-500/30 font-medium">
                            <BoltIcon className="w-3 h-3 text-primary-600 dark:text-primary-500" />
                            {startup.match_reason}
                          </span>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-1 font-medium">Risk Factor</div>
                          <div className="text-sm text-red-600 dark:text-red-400 font-medium">{startup.visible_risk}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/5">
                        <div className="text-xs text-slate-500 dark:text-gray-500 flex items-center gap-1 font-medium">
                          <ShieldCheckIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                          Bias-mitigated evaluation
                        </div>
                        <Link href={`/investor/startups/${startup.id}`}>
                          <Button className="text-sm px-4 py-2">
                            View Full Analysis <ChevronRightIcon className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Quick Actions Panel */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 border-t md:border-t-0 md:border-l border-slate-200 dark:border-white/10 pt-4 md:pt-0 md:pl-8 min-w-[140px]">
                      <div className="text-center md:text-right">
                        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-primary-400 dark:from-primary-400 dark:to-emerald-400">
                          {Math.round(startup.final_match_score * 100)}%
                        </div>
                        <div className="text-xs text-slate-500 dark:text-gray-500 uppercase tracking-wider font-bold">Fit Score</div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStartupAction(startup.id, 'passed')}
                          className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-red-500/20 text-slate-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all border border-slate-200 dark:border-transparent hover:border-red-500/30"
                          title="Pass"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleWatchClick(startup.id)}
                          className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-green-500/20 text-slate-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-all border border-slate-200 dark:border-transparent hover:border-green-500/30"
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
          )
        )}

        {/* Watchlist Intent Modal */}
        {showWatchModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <GlassCard className="max-w-md w-full p-8 border-primary-500/30">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Watch with Intent</h3>
              <p className="text-slate-600 dark:text-gray-400 text-sm mb-6">Why are you adding this to your watchlist? This signal is shared (anonymously) with the founder to preserve market intelligence.</p>

              <div className="space-y-3">
                <Button
                  variant="secondary"
                  className="w-full justify-start py-4"
                  onClick={() => confirmWatch('tracking_execution')}
                >
                  📈 Tracking execution density
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start py-4"
                  onClick={() => confirmWatch('waiting_for_milestone')}
                >
                  🎯 Waiting for specific milestone
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start py-4"
                  onClick={() => confirmWatch('monitoring_market')}
                >
                  🔭 Monitoring market fit
                </Button>
                <Button
                  variant="ghost"
                  className="w-full mt-4"
                  onClick={() => setShowWatchModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </GlassCard>
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
