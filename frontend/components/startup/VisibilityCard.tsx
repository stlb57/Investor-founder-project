import React, { useEffect, useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { EyeIcon, HeartIcon } from '@heroicons/react/24/outline'
import { api } from '@/lib/api'

export function VisibilityCard() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/startups/visibility')
                setStats(response.data)
            } catch (error) {
                console.error("Failed to load visibility stats", error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) return null

    // Process intents for chart or list
    const intents = Object.entries(stats.intent_breakdown || {}).filter(([_, val]) => (val as number) > 0)

    return (
        <GlassCard className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <EyeIcon className="w-5 h-5 text-indigo-400" />
                        Market Signals
                    </h3>
                    <p className="text-xs text-indigo-300">
                        Delayed by 24h • Anonymized
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/20 rounded p-3 text-center">
                    <div className="text-2xl font-bold text-white">{stats.views_last_7d}</div>
                    <div className="text-xs text-gray-400 uppercase">Profile Views (7d)</div>
                </div>
                <div className="bg-black/20 rounded p-3 text-center">
                    <div className="text-2xl font-bold text-white">{stats.watchlist_total}</div>
                    <div className="text-xs text-gray-400 uppercase">Watchlists</div>
                </div>
            </div>

            {intents.length > 0 && (
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Investor Intent</h4>
                    <div className="space-y-2">
                        {intents.map(([key, val]: any) => (
                            <div key={key} className="flex justify-between items-center text-sm">
                                <span className="text-gray-300 capitalize">{key.replace(/_/g, ' ')}</span>
                                <span className="font-mono text-indigo-400">{val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </GlassCard>
    )
}
