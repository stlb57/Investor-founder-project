import React, { useState, useEffect } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { api } from '@/lib/api'

export function DiscoveryBenchmarks() {
    const [sector, setSector] = useState('')
    const [benchmarkData, setBenchmarkData] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const handleSearch = async () => {
        if (!sector) return
        setLoading(true)
        try {
            // Re-using the same peer benchmarks logic but with a filter if we want
            const response = await api.get(`/startups/discovery/peers?sector=${sector}`)
            setBenchmarkData(response.data)
        } catch (error) {
            console.error('Benchmark search failed:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <GlassCard className="p-6 border-slate-200 dark:border-white/10">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Self-Discovery Benchmarks</h3>
            <p className="text-slate-600 dark:text-gray-400 text-sm mb-6">Compare your trajectory against anonymized sector peers to identify signals that matter.</p>

            <div className="flex gap-2 mb-6">
                <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search sector (e.g. Fintech, EdTech)..."
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 shadow-inner"
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <Button onClick={handleSearch} isLoading={loading}>Explore</Button>
            </div>

            {benchmarkData && (
                <div className="animate-fade-in space-y-4">
                    <div className="bg-primary-50 dark:bg-primary-500/10 p-4 rounded-xl border border-primary-100 dark:border-primary-500/20 shadow-inner">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-primary-700 dark:text-primary-300 font-bold uppercase tracking-wider">Sector Readiness Comparison</span>
                            <span className="text-[10px] text-slate-500 dark:text-gray-500 font-medium">{benchmarkData.peer_count} peers found</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <div className="h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden relative border border-slate-300 dark:border-white/10">
                                    <div
                                        className="absolute h-full bg-primary-500 rounded-full"
                                        style={{ width: `${benchmarkData.your_score}%` }}
                                    />
                                    <div
                                        className="absolute h-full w-1 bg-slate-900 dark:bg-white top-0 z-10"
                                        style={{ left: `${benchmarkData.median_peer_score}%` }}
                                        title="Peer Median"
                                    />
                                </div>
                                <div className="flex justify-between mt-2 text-[10px] text-slate-500 dark:text-gray-500 font-medium">
                                    <span>You: {benchmarkData.your_score}</span>
                                    <span>Peer Median: {benchmarkData.median_peer_score}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-gray-300 italic font-medium">&quot; {benchmarkData.benchmark_insight} &quot;</p>
                </div>
            )}
        </GlassCard>
    )
}
