import React from 'react'
import Head from 'next/head'
import Layout from '@/components/Layout'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { GradientText } from '@/components/ui/GradientText'
import { CheckIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

export default function Pricing() {
    return (
        <Layout title="Pricing - ScaleX">
            <div className="bg-hero-glow bg-no-repeat bg-top-right opacity-10 fixed inset-0 pointer-events-none"></div>

            <div className="relative z-10 container-custom py-20">
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">Commercial <GradientText>Tiers</GradientText></h1>
                    <p className="text-xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Structured access to the ScaleX ecosystem. Pricing is currently informational for our MVP partners.
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 px-4 py-2 rounded-full border border-primary-200 dark:border-primary-500/20 text-sm font-medium">
                        <InformationCircleIcon className="w-4 h-4" /> MVP Pricing Phase
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Investor Plans */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-4 flex items-center gap-2">
                            For Investors
                        </h2>
                        <div className="grid gap-6">
                            {/* Investor Free */}
                            <GlassCard className="p-8 border-slate-200 dark:border-white/10">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Observer</h3>
                                        <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mt-2">$0</div>
                                    </div>
                                    <span className="text-[10px] text-slate-500 dark:text-gray-500 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-2 py-1 rounded">Free</span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    <PriceItem text="Daily Signal Feed access" />
                                    <PriceItem text="Basic Startup Search" />
                                    <PriceItem text="Public Timeline visibility" />
                                    <PriceItem text="3 Discovery Intros / mo" />
                                </ul>
                                <Button variant="secondary" className="w-full">Learn more</Button>
                            </GlassCard>

                            {/* Investor Pro */}
                            <GlassCard className="p-8 border-primary-500/30 dark:border-primary-500/30 bg-primary-50/50 dark:bg-primary-500/5">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Full Signal</h3>
                                        <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mt-2">$499<span className="text-sm text-slate-500 dark:text-gray-500 font-normal"> /mo</span></div>
                                    </div>
                                    <span className="text-[10px] text-primary-600 dark:text-primary-400 uppercase tracking-widest bg-primary-100 dark:bg-primary-500/10 px-2 py-1 rounded">Recommended</span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    <PriceItem text="Real-time Execution Alarms" />
                                    <PriceItem text="Advanced Discovery Map" />
                                    <PriceItem text="Risk & Execution Gap signals" />
                                    <PriceItem text="Unlimited Intros" />
                                    <PriceItem text="Sector Benchmark Analysis" />
                                </ul>
                                <Button className="w-full">Learn more</Button>
                            </GlassCard>
                        </div>
                    </div>

                    {/* Founder Plans */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-4 flex items-center gap-2">
                            For Founders
                        </h2>
                        <div className="grid gap-6">
                            {/* Founder Free */}
                            <GlassCard className="p-8 border-slate-200 dark:border-white/10">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Builder</h3>
                                        <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mt-2">$0</div>
                                    </div>
                                    <span className="text-[10px] text-slate-500 dark:text-gray-500 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-2 py-1 rounded">Free</span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    <PriceItem text="Timeline & Milestone logging" />
                                    <PriceItem text="Readiness Score tracking" />
                                    <PriceItem text="Basic Founder Feed" />
                                    <PriceItem text="Visibility Controls" />
                                </ul>
                                <Button variant="secondary" className="w-full">Learn more</Button>
                            </GlassCard>

                            {/* Founder Pro */}
                            <GlassCard className="p-8 border-secondary-300 dark:border-secondary-500/30 bg-secondary-50 dark:bg-secondary-500/5">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Founder Plus</h3>
                                        <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mt-2">$99<span className="text-sm text-slate-500 dark:text-gray-500 font-normal"> /mo</span></div>
                                    </div>
                                    <span className="text-[10px] text-secondary-600 dark:text-secondary-400 uppercase tracking-widest bg-secondary-100 dark:bg-secondary-500/10 px-2 py-1 rounded font-medium">Growth</span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    <PriceItem text="Peer Benchmarking dashboard" />
                                    <PriceItem text="Impact Depth verification" />
                                    <PriceItem text="Aggregated Interest insights" />
                                    <PriceItem text="Priority Discovery placement" />
                                </ul>
                                <Button className="w-full">Learn more</Button>
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

function PriceItem({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-gray-400">
            <CheckIcon className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
            {text}
        </li>
    )
}
