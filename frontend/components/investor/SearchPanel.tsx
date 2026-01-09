import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'

interface SearchFilters {
    keyword?: string
    sector?: string
    stage?: string
    region?: string
    momentum?: string
    impact_tags?: string[]
}

interface SearchPanelProps {
    onSearch: (filters: SearchFilters) => void
    loading?: boolean
    totalPoolSize?: number
}

const SECTORS = ['Fintech', 'HealthTech', 'Climate Tech', 'EdTech', 'AgriTech', 'SaaS']
const STAGES = ['Pre-Seed', 'Seed', 'Series A', 'Series B']
const IMPACT_TAGS = ["Environment Friendly", "Climate Tech", "Healthcare Access", "Education", "Financial Inclusion"]

export function SearchPanel({ onSearch, loading, totalPoolSize = 100 }: SearchPanelProps) {
    const [filters, setFilters] = useState<SearchFilters>({})
    const [expanded, setExpanded] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(filters)
    }

    const toggleTag = (tag: string) => {
        const current = filters.impact_tags || []
        const updated = current.includes(tag)
            ? current.filter(t => t !== tag)
            : [...current, tag]
        setFilters({ ...filters, impact_tags: updated })
    }

    return (
        <div className="mb-8">
            <form onSubmit={handleSubmit}>
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder={`Search by name, ID, or within ${totalPoolSize} startups...`}
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-3 pl-10 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 shadow-inner"
                            value={filters.keyword || ''}
                            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e as any)}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[10px] text-slate-500 dark:text-gray-500 uppercase font-black tracking-widest">
                            Constrained Search
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setExpanded(!expanded)}
                        className="px-4"
                    >
                        <AdjustmentsHorizontalIcon className="w-5 h-5" />
                    </Button>
                    <Button type="submit" isLoading={loading}>
                        Search
                    </Button>
                </div>

                {expanded && (
                    <GlassCard className="mt-4 p-6 animate-fade-in-down">
                        <div className="mb-6">
                            <label className="block text-xs uppercase text-gray-500 mb-3">Smart Filter Presets</label>
                            <div className="flex flex-wrap gap-2 text-sm">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFilters({ momentum: 'improving', stage: 'Seed' })
                                        onSearch({ momentum: 'improving', stage: 'Seed' })
                                    }}
                                    className="px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 rounded-lg border border-primary-500/30 transition-all"
                                >
                                    🔥 High momentum, early stage
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFilters({ impact_tags: ['Climate Tech', 'Environment Friendly'] })
                                        onSearch({ impact_tags: ['Climate Tech', 'Environment Friendly'] })
                                    }}
                                    className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg border border-green-500/30 transition-all"
                                >
                                    🌍 Impact-first startups
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFilters({ momentum: 'stable' })
                                        onSearch({ momentum: 'stable' })
                                    }}
                                    className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 transition-all"
                                >
                                    ☕ Quiet but consistent
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div>
                                <label className="block text-xs uppercase text-gray-500 mb-2">Sector</label>
                                <select
                                    className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded px-3 py-2 text-slate-900 dark:text-white font-medium"
                                    onChange={(e) => setFilters({ ...filters, sector: e.target.value || undefined })}
                                    value={filters.sector || ''}
                                >
                                    <option value="">Any Sector</option>
                                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs uppercase text-gray-500 mb-2">Stage</label>
                                <select
                                    className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded px-3 py-2 text-slate-900 dark:text-white font-medium"
                                    onChange={(e) => setFilters({ ...filters, stage: e.target.value || undefined })}
                                    value={filters.stage || ''}
                                >
                                    <option value="">Any Stage</option>
                                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs uppercase text-gray-500 mb-2">Momentum</label>
                                <select
                                    className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded px-3 py-2 text-slate-900 dark:text-white font-medium"
                                    onChange={(e) => setFilters({ ...filters, momentum: e.target.value || undefined })}
                                    value={filters.momentum || ''}
                                >
                                    <option value="">Any Momentum</option>
                                    <option value="improving">Improving (↑)</option>
                                    <option value="stable">Stable (→)</option>
                                    <option value="declining">Declining (↓)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase text-gray-500 mb-2">Impact Focus</label>
                            <div className="flex flex-wrap gap-2">
                                {IMPACT_TAGS.map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => toggleTag(tag)}
                                        className={`px-3 py-1 rounded-full text-xs transition-colors border ${(filters.impact_tags || []).includes(tag)
                                            ? 'bg-primary-500/20 border-primary-500 text-primary-300'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </GlassCard>
                )}
            </form>
        </div>
    )
}
