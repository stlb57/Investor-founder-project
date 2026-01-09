import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { GradientText } from '@/components/ui/GradientText'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'
import { useRouter } from 'next/router'
import { ArrowLeftIcon, ChatBubbleLeftRightIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline'

interface IntroductionRequest {
  id: string
  investor_name: string
  status: string
  requested_at: string
  responded_at?: string
}

export default function StartupIntroductions() {
  const { user } = useAuth()
  const router = useRouter()
  const [requests, setRequests] = useState<IntroductionRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'startup') {
      loadIntroductionRequests()
    }
  }, [user])

  const loadIntroductionRequests = async () => {
    try {
      const response = await api.get('/introductions/requests')
      setRequests(response.data)
    } catch (error) {
      console.error('Failed to load introduction requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResponse = async (introId: string, response: 'accepted' | 'declined') => {
    try {
      await api.post('/introductions/respond', {
        introduction_id: introId,
        response
      })
      loadIntroductionRequests() // Reload requests
    } catch (error) {
      console.error('Failed to respond to introduction:', error)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin mb-4"></div>
            <div className="text-slate-500 dark:text-gray-400 font-medium">Checking for introductions...</div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Introduction Requests - ScaleX">
      <div className="bg-hero-glow bg-no-repeat bg-center opacity-10 fixed inset-0 pointer-events-none"></div>

      <div className="relative z-10 container-custom py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 animate-fade-in">
          <div>
            <Link href="/startup/dashboard" className="inline-flex items-center text-slate-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white mb-4 transition-colors font-medium">
              <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Introduction <GradientText>Requests</GradientText></h1>
            <p className="text-slate-600 dark:text-gray-400">Connect with investors interested in your startup.</p>
          </div>
        </div>

        <GlassCard className="min-h-[400px] border-slate-200 dark:border-white/10 shadow-sm">
          {requests.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-slate-100 dark:bg-white/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-200 dark:border-white/10 shadow-inner">
                <ChatBubbleLeftRightIcon className="w-12 h-12 text-slate-300 dark:text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">No Requests Yet</h3>
              <p className="text-slate-600 dark:text-gray-400 max-w-md mx-auto mb-10 font-medium">
                Keep building your readiness score. Investors are notified when you hit high confidence bands.
              </p>
              <Link href="/startup/improve">
                <Button variant="primary" className="shadow-md">Improve Your Score</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request, idx) => (
                <div key={request.id} className="bg-slate-50 dark:bg-white/5 rounded-2xl p-6 border border-slate-200 dark:border-white/5 hover:border-primary-500/30 dark:hover:border-white/10 transition-all shadow-sm animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                        {request.investor_name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-gray-400 font-medium">
                        <span className="flex items-center gap-1.5">
                          <ClockIcon className="w-4 h-4 text-slate-400" />
                          {new Date(request.requested_at).toLocaleDateString()}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${request.status === 'requested' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-transparent' :
                          request.status === 'accepted' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-transparent' :
                            'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-transparent'
                          }`}>
                          {request.status}
                        </span>
                      </div>
                    </div>

                    {request.status === 'requested' && (
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <Button
                          variant="secondary"
                          onClick={() => handleResponse(request.id, 'declined')}
                          className="flex-1 md:flex-none"
                        >
                          Decline
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => handleResponse(request.id, 'accepted')}
                          className="flex-1 md:flex-none"
                        >
                          Accept Connect
                        </Button>
                      </div>
                    )}

                    {request.status === 'accepted' && (
                      <div className="text-green-600 dark:text-green-400 flex items-center gap-2 font-bold px-3 py-1 bg-green-50 dark:bg-transparent rounded-lg">
                        <CheckCircleIcon className="w-5 h-5" /> Connected
                      </div>
                    )}
                    {request.status === 'declined' && (
                      <div className="text-slate-500 dark:text-gray-500 flex items-center gap-2 font-bold px-3 py-1 bg-slate-100 dark:bg-transparent rounded-lg">
                        <XCircleIcon className="w-5 h-5" /> Declined
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </Layout>
  )
}