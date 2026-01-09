import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import { GradientText } from '@/components/ui/GradientText'
import { ArrowLeftIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface StoryContent {
    type: 'p' | 'h3' | 'img'
    text?: string
    src?: string
}

interface StoryDetail {
    id: string
    slug: string
    title: string
    type: string
    summary: string
    content: StoryContent[]
    related_tags: string[]
    created_at: string
}

export default function InsightDetail() {
    const router = useRouter()
    const { slug } = router.query
    const [story, setStory] = useState<StoryDetail | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (slug) {
            fetchStoryDetail()
        }
    }, [slug])

    // Mock data map
    const mockContent: Record<string, StoryDetail> = {
        'vertical-ai-healthcare-2024': {
            id: '1', slug: 'vertical-ai-healthcare-2024',
            title: 'The Rise of Vertical AI in Healthcare', type: 'ecosystem_insight',
            summary: 'Why specialized models like DataScribe are outperforming generalized LLMs in clinical settings.',
            content: [
                { type: 'h3', text: 'The Limits of Generalized LLMs' },
                { type: 'p', text: 'While GPT-4 and Claude 3 are incredibly powerful, they often hallucinate in high-stakes clinical environments. Vertical integration allows for grounding generation in specific medical ontologies.' },
                { type: 'h3', text: 'Case Study: DataScribe' },
                { type: 'p', text: 'DataScribe has reduced transcription errors by 40% compared to generic whisper-based solutions by fine-tuning on proprietary dataset of 1M+ clinical notes.' }
            ],
            related_tags: ['AI', 'Healthcare', 'Trends'], created_at: new Date().toISOString()
        },
        'fintech-infra-momentum': {
            id: '2', slug: 'fintech-infra-momentum',
            title: 'Market Momentum: Fintech Infrastructure', type: 'ecosystem_insight',
            summary: 'Infrastructure plays like VaultX are seeing 3x higher deal flow than consumer fintech apps.',
            content: [
                { type: 'p', text: 'Investors are shifting focus from consumer apps (CAC is too high) to the rails that power them. B2B payments and compliance infrastructure are hot.' }
            ],
            related_tags: ['Fintech', 'Infrastructure'], created_at: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        'decision-memo-visionary': {
            id: '3', slug: 'decision-memo-visionary',
            title: 'Decision Memo: Why We Passed on Visionary', type: 'decision_story',
            summary: 'A deep dive into why execution speed matters more than the model.',
            content: [
                { type: 'p', text: 'Visionary has an impressive demo, but their go-to-market strategy relies heavily on PLG in a sales-led enterprise market. We need to see faster iteration cycles.' }
            ],
            related_tags: ['GenAI', 'Decision Memo'], created_at: new Date(Date.now() - 86400000 * 5).toISOString()
        }
    }

    const fetchStoryDetail = async () => {
        // Simulate loading
        if (slug && typeof slug === 'string' && mockContent[slug]) {
            setStory(mockContent[slug])
        } else {
            // Fallback generic
            setStory(mockContent['vertical-ai-healthcare-2024'])
        }
        setLoading(false)
    }

    if (loading) {
        return (
            <Layout>
                <div className="container-custom py-20 flex justify-center">
                    <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
                </div>
            </Layout>
        )
    }

    if (!story) return null

    return (
        <Layout title={`${story.title} - Insights`}>
            <div className="bg-hero-glow bg-no-repeat bg-top-right opacity-5 fixed inset-0 pointer-events-none"></div>

            <div className="relative z-10 container-custom py-12">
                <div className="max-w-3xl mx-auto">
                    <Link href="/insights">
                        <button className="flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:text-gray-500 dark:hover:text-white mb-12 transition-colors group font-medium">
                            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Insights
                        </button>
                    </Link>

                    <header className="mb-12">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-[10px] uppercase tracking-widest px-3 py-1 bg-primary-100 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 rounded-full font-bold border border-primary-200 dark:border-primary-500/20">
                                {story.type.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-gray-500 flex items-center gap-1 font-medium">
                                <CalendarIcon className="w-3.5 h-3.5" />
                                {new Date(story.created_at).toLocaleDateString()}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                            {story.title}
                        </h1>

                        <p className="text-xl text-slate-600 dark:text-gray-400 font-light leading-relaxed border-l-2 border-primary-500 pl-6">
                            {story.summary}
                        </p>
                    </header>

                    <article className="prose prose-slate dark:prose-invert prose-primary max-w-none">
                        <GlassCard className="p-8 md:p-12 mb-12 border-slate-200 dark:border-white/5">
                            <div className="space-y-8">
                                {story.content.map((block, idx) => {
                                    if (block.type === 'h3') {
                                        return <h3 key={idx} className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">{block.text}</h3>
                                    }
                                    if (block.type === 'p') {
                                        return <p key={idx} className="text-lg text-slate-700 dark:text-gray-300 leading-relaxed font-light">{block.text}</p>
                                    }
                                    return null
                                })}
                            </div>
                        </GlassCard>
                    </article>

                    <footer className="border-t border-slate-200 dark:border-white/10 pt-12">
                        <div className="flex flex-wrap gap-2 mb-8">
                            {story.related_tags.map(tag => (
                                <span key={tag} className="text-xs text-slate-500 dark:text-gray-500 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full border border-slate-200 dark:border-white/5 flex items-center gap-1.5 font-medium">
                                    <TagIcon className="w-3.5 h-3.5" /> {tag}
                                </span>
                            ))}
                        </div>

                        <GlassCard className="bg-primary-50 dark:bg-primary-500/5 border-primary-200 dark:border-primary-500/20 p-8 text-center shadow-inner">
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Want deeper insights?</h4>
                            <p className="text-slate-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                Join our MVP partner program to access real-time execution signals and sector benchmarks.
                            </p>
                            <div className="flex justify-center gap-4">
                                <Link href="/pricing">
                                    <Button variant="secondary">View Pricing</Button>
                                </Link>
                                <Link href="/startup/onboarding">
                                    <Button>Get Started</Button>
                                </Link>
                            </div>
                        </GlassCard>
                    </footer>
                </div>
            </div>
        </Layout>
    )
}
