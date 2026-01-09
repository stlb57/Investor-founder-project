import React, { useState, useEffect } from 'react'
import Link from 'next/head'
import NextLink from 'next/link'
import Layout from '@/components/Layout'
import { GlassCard } from '@/components/ui/GlassCard'
import { api } from '@/lib/api'
import { GradientText } from '@/components/ui/GradientText'
import { CalendarIcon, TagIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface Story {
    id: string
    slug: string
    title: string
    type: string
    summary: string
    related_tags: string[]
    created_at: string
}

export default function InsightsList() {
    const [stories, setStories] = useState<Story[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStories()
    }, [])

    const fetchStories = async () => {
        try {
            const response = await api.get('/insights')
            setStories(response.data)
        } catch (error) {
            console.error('Error fetching stories:', error)
        } finally {
            setLoading(false)
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'decision_story': return 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10'
            case 'ecosystem_insight': return 'text-secondary-600 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-500/10'
            default: return 'text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-white/5'
        }
    }

    return (
        <Layout title="Insights - ScaleX">
            <div className="bg-hero-glow bg-no-repeat bg-top-left opacity-10 fixed inset-0 pointer-events-none"></div>

            <div className="relative z-10 container-custom py-20">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-16">
                        <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">Decision <GradientText>Insights</GradientText></h1>
                        <p className="text-xl text-slate-600 dark:text-gray-400">
                            Data-driven analysis and ecosystem stories that inform professional investment decisions.
                        </p>
                    </header>

                    {loading ? (
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-40 bg-slate-100 dark:bg-white/5 animate-pulse rounded-2xl border border-slate-200 dark:border-white/10"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-8">
                            {stories.map((story) => (
                                <NextLink key={story.id} href={`/insights/${story.slug}`}>
                                    <GlassCard className="group hover:border-primary-500/30 transition-all cursor-pointer border-slate-200 dark:border-white/10">
                                        <div className="flex flex-col md:flex-row gap-6 p-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded font-bold ${getTypeColor(story.type)}`}>
                                                        {story.type.replace('_', ' ')}
                                                    </span>
                                                    <span className="text-xs text-slate-500 dark:text-gray-400 flex items-center gap-1 font-medium">
                                                        <CalendarIcon className="w-3.5 h-3.5" />
                                                        {new Date(story.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                    {story.title}
                                                </h2>

                                                <p className="text-slate-600 dark:text-gray-400 mb-6 line-clamp-2">
                                                    {story.summary}
                                                </p>

                                                <div className="flex flex-wrap gap-2">
                                                    {story.related_tags.map(tag => (
                                                        <span key={tag} className="text-[10px] text-slate-500 dark:text-gray-500 bg-slate-50 dark:bg-white/5 px-2 py-0.5 rounded border border-slate-200 dark:border-white/10 flex items-center gap-1 font-semibold">
                                                            <TagIcon className="w-3 h-3 text-slate-400" /> {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center md:border-l border-slate-100 dark:border-white/10 md:pl-6">
                                                <ChevronRightIcon className="w-6 h-6 text-slate-300 dark:text-gray-700 group-hover:text-primary-600 dark:group-hover:text-primary-500 transition-colors" />
                                            </div>
                                        </div>
                                    </GlassCard>
                                </NextLink>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}
