import React, { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { TrashIcon, PlusIcon, CalendarIcon, BoltIcon } from '@heroicons/react/24/outline'

export default function InvestorTimeline() {
    const { user } = useAuth()
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [formData, setFormData] = useState({
        event_date: new Date().toISOString().split('T')[0],
        event_type: 'INVESTMENT',
        title: '',
        description: ''
    })

    useEffect(() => {
        if (user?.role === 'investor') {
            loadTimeline()
        }
    }, [user])

    const loadTimeline = async () => {
        try {
            const response = await api.get('/investors/timeline')
            setEvents(response.data)
        } catch (error) {
            console.error('Failed to load timeline:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await api.post('/investors/timeline', formData)
            setShowAddForm(false)
            setFormData({
                event_date: new Date().toISOString().split('T')[0],
                event_type: 'INVESTMENT',
                title: '',
                description: ''
            })
            loadTimeline()
        } catch (error) {
            console.error('Failed to add event:', error)
        }
    }

    const deleteEvent = async (id: string) => {
        try {
            await api.delete(`/investors/timeline/${id}`)
            loadTimeline()
        } catch (error) {
            console.error('Failed to delete event:', error)
        }
    }

    if (loading) return <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
    </Layout>

    return (
        <Layout title="Investment Timeline - ScaleX">
            <div className="container-custom py-12">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Investment <span className="text-primary-600 dark:text-primary-400">Timeline</span></h1>
                        <p className="text-slate-600 dark:text-gray-400 text-sm font-medium">Track your execution and portfolio history.</p>
                    </div>
                    <Button onClick={() => setShowAddForm(!showAddForm)} variant={showAddForm ? 'secondary' : 'primary'} className="shadow-md">
                        {showAddForm ? 'Cancel' : <><PlusIcon className="w-4 h-4 mr-2" /> Add Event</>}
                    </Button>
                </div>

                {showAddForm && (
                    <GlassCard className="mb-12 animate-fade-in border-slate-200 dark:border-white/10 shadow-lg" delay="0s">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-gray-400 mb-2">Event Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                                        value={formData.event_date}
                                        onChange={e => setFormData({ ...formData, event_date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-gray-400 mb-2">Event Type</label>
                                    <select
                                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                                        value={formData.event_type}
                                        onChange={e => setFormData({ ...formData, event_type: e.target.value })}
                                    >
                                        <option value="INVESTMENT">Portfolio Investment</option>
                                        <option value="EXIT">Successful Exit</option>
                                        <option value="ADVISORY">Advisory Role</option>
                                        <option value="FUNDING">Fund Milestone</option>
                                        <option value="TEAM">Team Update</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-gray-400 mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., Invested in SpaceX Series G"
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-gray-400 mb-2">Description / Notes</label>
                                <textarea
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all min-h-[100px] font-medium"
                                    placeholder="Add context or execution notes..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <Button type="submit" className="w-full">Save Event to Timeline</Button>
                        </form>
                    </GlassCard>
                )}

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-slate-100 dark:bg-white/10 transform -translate-x-1/2"></div>

                    <div className="space-y-12">
                        {events.length === 0 ? (
                            <div className="text-center py-20 text-slate-500 dark:text-gray-500 relative z-10">
                                <BoltIcon className="w-16 h-16 mx-auto mb-6 opacity-20 text-primary-500" />
                                <p className="text-lg font-bold text-slate-400 dark:text-gray-400">Your execution history is currently empty.</p>
                                <p className="text-sm mt-2 font-medium">Start by adding your first investment or exit above.</p>
                            </div>
                        ) : (
                            events.map((event, idx) => (
                                <div key={event.id} className={`flex flex-col md:flex-row items-center gap-8 relative z-10 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                    <div className="flex-1 w-full">
                                        <GlassCard delay={`${idx * 0.1}s`} className="border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-[10px] font-black text-primary-700 dark:text-primary-400 uppercase tracking-widest bg-primary-100 dark:bg-primary-500/10 px-2.5 py-1 rounded-full border border-primary-200 dark:border-primary-500/20">
                                                    {event.event_type}
                                                </span>
                                                <button onClick={() => deleteEvent(event.id)} className="text-slate-400 hover:text-red-500 transition-colors bg-slate-100 dark:bg-white/5 p-1.5 rounded-lg border border-slate-200 dark:border-white/5">
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">{event.title}</h3>
                                            <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed mb-4 font-medium">{event.description}</p>
                                            <div className="flex items-center text-xs text-slate-500 dark:text-gray-500 gap-2 font-bold">
                                                <CalendarIcon className="w-4 h-4 text-slate-400" />
                                                {new Date(event.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                        </GlassCard>
                                    </div>

                                    {/* Event Circle Anchor */}
                                    <div className="w-4 h-4 rounded-full bg-primary-600 dark:bg-primary-500 border-4 border-white dark:border-slate-900 relative z-20 shadow-sm"></div>

                                    <div className="flex-1 hidden md:block"></div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}
