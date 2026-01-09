import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { GradientText } from '@/components/ui/GradientText'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'
import { PlusIcon, ArrowLeftIcon, CalendarIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline'

interface TimelineEvent {
  id: string
  event_date: string
  event_type: string
  title: string
  description: string
  confidence: string
  created_at: string
}

export default function TimelinePage() {
  const { user, logout } = useAuth()
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    event_date: '',
    event_type: 'product',
    title: '',
    description: '',
    confidence: 'self_reported'
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await api.get('/startups/timeline/events')
      setEvents(response.data)
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/startups/timeline/events', formData)
      setShowAddForm(false)
      setFormData({
        event_date: '',
        event_type: 'product',
        title: '',
        description: '',
        confidence: 'self_reported'
      })
      fetchEvents()
    } catch (error) {
      console.error('Failed to add event:', error)
    }
  }

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      team: 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
      product: 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20',
      traction: 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20',
      capital: 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20'
    }
    return colors[type] || 'bg-slate-100 dark:bg-gray-500/10 text-slate-600 dark:text-gray-400 border-slate-200 dark:border-gray-500/20'
  }

  return (
    <Layout title="Timeline - ScaleX">
      <div className="bg-hero-glow bg-no-repeat bg-center opacity-10 fixed inset-0 pointer-events-none"></div>

      <div className="relative z-10 container-custom py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 animate-fade-in">
          <div>
            <Link href="/startup/dashboard" className="inline-flex items-center text-slate-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white mb-4 transition-colors font-medium">
              <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Startup <GradientText>Timeline</GradientText></h1>
            <p className="text-slate-600 dark:text-gray-400">Track your execution milestones to signal readiness.</p>
          </div>
          <div className="flex gap-4 mt-6 md:mt-0">
            <Button onClick={() => setShowAddForm(!showAddForm)} icon={<PlusIcon className="w-5 h-5" />}>
              {showAddForm ? 'Cancel' : 'Add Event'}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Column (Conditional or Sticky) */}
          {showAddForm && (
            <div className="lg:col-span-1 animate-slide-up">
              <GlassCard className="sticky top-24 border-slate-200 dark:border-white/10">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-white/10 pb-4">New Milestone</h3>
                <form onSubmit={handleAddEvent} className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Date</label>
                    <input
                      type="date"
                      required
                      className="input-field w-full"
                      value={formData.event_date}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Category</label>
                    <select
                      className="input-field w-full"
                      value={formData.event_type}
                      onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                    >
                      <option value="product">Product</option>
                      <option value="traction">Traction</option>
                      <option value="team">Team</option>
                      <option value="capital">Capital</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Launched MVP"
                      className="input-field w-full"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Description</label>
                    <textarea
                      rows={3}
                      placeholder="Brief details about the milestone..."
                      className="input-field w-full"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Verification Level</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, confidence: 'self_reported' })}
                        className={`px-3 py-2 rounded-xl text-sm border transition-all ${formData.confidence === 'self_reported' ? 'bg-primary-600/10 dark:bg-white/10 border-primary-500 shadow-sm text-primary-700 dark:text-white font-bold' : 'bg-slate-50 dark:bg-transparent border-slate-200 dark:border-white/5 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                      >
                        Self Report
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, confidence: 'verified' })}
                        className={`px-3 py-2 rounded-xl text-sm border transition-all ${formData.confidence === 'verified' ? 'bg-primary-600/20 dark:bg-primary-500/20 border-primary-500 shadow-sm text-primary-700 dark:text-primary-400 font-bold' : 'bg-slate-50 dark:bg-transparent border-slate-200 dark:border-white/5 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                      >
                        Verify (beta)
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full mt-4 shadow-sm">Save Milestone</Button>
                </form>
              </GlassCard>
            </div>
          )}

          {/* Timeline List */}
          <div className={`${showAddForm ? 'lg:col-span-2' : 'lg:col-span-3'} `}>
            <div className="relative border-l border-slate-200 dark:border-white/10 ml-6 space-y-12">
              {loading ? (
                <div className="text-slate-500 dark:text-gray-500 italic pl-8">Loading timeline...</div>
              ) : events.length === 0 ? (
                <GlassCard className="ml-8 text-center py-12 border-slate-200 dark:border-white/10">
                  <ChatBubbleBottomCenterTextIcon className="w-12 h-12 mx-auto text-slate-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No events yet</h3>
                  <p className="text-slate-600 dark:text-gray-400">Add your first milestone to start building your trust score.</p>
                  <Button onClick={() => setShowAddForm(true)} variant="secondary" className="mt-6">Add First Event</Button>
                </GlassCard>
              ) : (
                events.map((event, idx) => (
                  <div key={event.id} className="relative pl-8 animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                    {/* Dot */}
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-slate-100 dark:border-[#0F172A] ${event.event_type === 'traction' ? 'bg-purple-500' :
                      event.event_type === 'product' ? 'bg-green-500' :
                        event.event_type === 'capital' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>

                    <GlassCard className="group hover:border-primary-500/30 dark:hover:border-white/20 transition-all border-slate-200 dark:border-white/10">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border shadow-sm ${getEventTypeColor(event.event_type)}`}>
                            {event.event_type}
                          </span>
                          <span className="text-sm text-slate-500 dark:text-gray-400 flex items-center gap-1 font-medium">
                            <CalendarIcon className="w-4 h-4" />
                            {new Date(event.event_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-gray-500 bg-slate-100 dark:bg-black/20 px-2 py-1 rounded border border-slate-200 dark:border-transparent font-bold tracking-wider uppercase">
                          {event.confidence === 'verified' ? '✅ Verified' : '📝 Self-Reported'}
                        </div>

                      </div>

                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{event.title}</h3>
                      {event.description && (
                        <p className="text-slate-600 dark:text-gray-400 leading-relaxed font-light">{event.description}</p>
                      )}
                    </GlassCard>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
