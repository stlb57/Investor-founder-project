import React, { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { SignalCard } from './SignalCard'
import { BoltIcon } from '@heroicons/react/24/outline'

export const SignalFeed: React.FC = () => {
    const [signals, setSignals] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFeed()
    }, [])

    const fetchFeed = async () => {
        try {
            const response = await api.get('/feed')
            setSignals(response.data)
        } catch (error) {
            console.error('Failed to fetch feed:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-48 bg-white/5 animate-pulse rounded-2xl border border-white/10"></div>
                ))}
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto py-4">
            {signals.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                    <BoltIcon className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-500">No active signals</h3>
                    <p className="text-sm text-gray-600 mt-2">Check back later for system-generated insights.</p>
                </div>
            ) : (
                <div className="animate-fade-in divide-y divide-white/5">
                    {signals.map((signal, idx) => (
                        <div key={signal.id} className="animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                            <SignalCard signal={signal} />
                        </div>
                    ))}

                    <div className="text-center py-8 text-xs text-gray-600 uppercase tracking-widest">
                        End of Signal Stream
                    </div>
                </div>
            )}
        </div>
    )
}
