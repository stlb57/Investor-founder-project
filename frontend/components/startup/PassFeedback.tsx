import React, { useEffect, useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { api } from '@/lib/api'

export function PassFeedback() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await api.get('/startups/pass-reasons')
                setData(response.data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchFeedback()
    }, [])

    if (loading || !data || data.total_passes === 0) return null

    return (
        <GlassCard className="mt-8 border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-900/10">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Feedback Analysis</h3>
            <p className="text-sm text-slate-600 dark:text-gray-400 mb-6 font-medium">
                Common reasons investors passed on this round (Aggregated from {data.total_passes} passes)
            </p>

            <div className="space-y-4">
                {data.reasons.map((item: any) => (
                    <div key={item.reason}>
                        <div className="flex justify-between text-sm mb-1 font-medium">
                            <span className="text-slate-700 dark:text-gray-300 capitalize">{item.reason.replace(/_/g, ' ')}</span>
                            <span className="text-slate-500 dark:text-gray-500">{item.percentage}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden border border-slate-300 dark:border-transparent">
                            <div
                                className="h-full bg-red-500/50 dark:bg-red-500/50 rounded-full"
                                style={{ width: `${item.percentage}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    )
}
