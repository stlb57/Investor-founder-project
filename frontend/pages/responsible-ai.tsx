import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { GlassCard } from '@/components/ui/GlassCard'
import { GradientText } from '@/components/ui/GradientText'
import { ArrowLeftIcon, ShieldCheckIcon, ScaleIcon, EyeIcon, ChartBarIcon, UserGroupIcon, LightBulbIcon } from '@heroicons/react/24/outline'

export default function ResponsibleAI() {
  return (
    <Layout title="Responsible AI - ScaleX">
      <div className="bg-hero-glow bg-no-repeat bg-center opacity-10 fixed inset-0 pointer-events-none"></div>

      <div className="relative z-10 container-custom py-12 max-w-5xl mx-auto">
        <div className="mb-12 animate-fade-in">
          <Link href="/" className="inline-flex items-center text-slate-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors">
            <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Responsible AI & <GradientText>Bias Mitigation</GradientText>
            </h1>
            <p className="text-xl text-slate-600 dark:text-gray-400">
              ScaleX is committed to building AI systems that are transparent, fair, and accountable.
              Here&apos;s how we implement responsible AI practices in our startup funding platform.
            </p>
          </div>
        </div>

        {/* Main Principles */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <GlassCard className="h-full border-t-4 border-t-primary-500" hoverEffect={false}>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary-500/20 p-3 rounded-xl">
                <EyeIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Explainable AI</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Component Breakdown</h3>
                <p className="text-slate-600 dark:text-gray-400">Every Readiness Score shows its five components: execution consistency (25%), traction velocity (25%), market clarity (20%), team stability (15%), and capital efficiency (15%).</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Confidence Bands</h3>
                <p className="text-slate-600 dark:text-gray-400">All scores include uncertainty ranges (e.g., &quot;75 ± 8&quot;) based on data completeness and model confidence.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">&quot;Why This Decision&quot; Panels</h3>
                <p className="text-slate-600 dark:text-gray-400">Every startup match includes explanations of why it was surfaced, what risks exist, and what remains uncertain.</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="h-full border-t-4 border-t-cyan-500" hoverEffect={false}>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-cyan-500/20 p-3 rounded-xl">
                <ScaleIcon className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Bias Mitigation</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Progress Over Pedigree</h3>
                <p className="text-slate-600 dark:text-gray-400">Scoring focuses on execution consistency and traction growth rather than founder credentials or institutional affiliations.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Regional Normalization</h3>
                <p className="text-slate-600 dark:text-gray-400">Startups are compared to peers in their local ecosystem to avoid Silicon Valley bias, ensuring fair evaluation across geographies.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Blind Evaluation Mode</h3>
                <p className="text-slate-600 dark:text-gray-400">Investors can optionally hide founder names, photos, and educational backgrounds to focus purely on execution metrics.</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Technical Implementation */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">Technical Implementation</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <GlassCard className="border-slate-200 dark:border-white/10">
              <ShieldCheckIcon className="w-10 h-10 text-green-600 dark:text-green-400 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Black Boxes</h3>
              <p className="text-slate-600 dark:text-gray-400 text-sm">
                We use only interpretable ML models: logistic regression and gradient boosting.
                No deep learning or neural networks that can&apos;t be explained.
              </p>
            </GlassCard>
            <GlassCard className="border-slate-200 dark:border-white/10">
              <LightBulbIcon className="w-10 h-10 text-yellow-600 dark:text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Rule-Based Foundation</h3>
              <p className="text-slate-600 dark:text-gray-400 text-sm">
                Core scoring starts with transparent business rules before ML enhancement.
                Every decision can be traced back to specific data points.
              </p>
            </GlassCard>
            <GlassCard className="border-slate-200 dark:border-white/10">
              <ChartBarIcon className="w-10 h-10 text-primary-600 dark:text-primary-400 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Continuous Monitoring</h3>
              <p className="text-slate-600 dark:text-gray-400 text-sm">
                We track model performance across different demographic groups and
                geographic regions to detect and correct bias.
              </p>
            </GlassCard>
          </div>
        </div>

        {/* Impact Metrics */}
        <GlassCard className="mb-16 border-slate-200 dark:border-white/10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <UserGroupIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            Ecosystem Impact Metrics
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 border-b border-slate-200 dark:border-white/10 pb-2">Access Metrics</h3>
              <ul className="space-y-3 text-slate-600 dark:text-gray-400">
                <li className="flex items-start gap-2">• Funding gaps by geographic region</li>
                <li className="flex items-start gap-2">• Time-to-first-meeting across demographics</li>
                <li className="flex items-start gap-2">• Introduction acceptance rates by startup characteristics</li>
                <li className="flex items-start gap-2">• Visibility rates for different founder backgrounds</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 border-b border-slate-200 dark:border-white/10 pb-2">Quality Metrics</h3>
              <ul className="space-y-3 text-slate-600 dark:text-gray-400">
                <li className="flex items-start gap-2">• Score accuracy across different startup types</li>
                <li className="flex items-start gap-2">• Investor satisfaction with match quality</li>
                <li className="flex items-start gap-2">• Startup progression after platform engagement</li>
                <li className="flex items-start gap-2">• Reduction in cold outreach volume</li>
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* Disclaimer */}
        <div className="bg-yellow-500/10 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-2xl p-8 mb-16 shadow-inner">
          <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-200 mb-4 text-center">What We Don&apos;t Claim</h2>
          <ul className="grid md:grid-cols-2 gap-4 text-yellow-900/80 dark:text-yellow-100/80 text-sm">
            <li className="flex gap-2">
              <span className="font-bold text-yellow-600 dark:text-yellow-500">•</span>
              <span><strong>Perfect Prediction:</strong> We don&apos;t claim to predict startup success. Our scores reflect current readiness for investment based on historical patterns.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-yellow-600 dark:text-yellow-500">•</span>
              <span><strong>Complete Bias Elimination:</strong> While we work to reduce bias, we acknowledge that some biases may persist in our data and models.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-yellow-600 dark:text-yellow-500">•</span>
              <span><strong>Replacement for Human Judgment:</strong> ScaleX is a decision-support tool. Final investment decisions should always involve human evaluation.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-yellow-600 dark:text-yellow-500">•</span>
              <span><strong>Universal Applicability:</strong> Our models are trained primarily on tech startups and may not generalize to all industries or regions.</span>
            </li>
          </ul>
        </div>

        {/* Commitment */}
        <div className="text-center bg-gradient-to-br from-primary-50 to-emerald-50 dark:from-primary-900/40 dark:to-slate-900/40 rounded-3xl p-12 border border-primary-100 dark:border-white/10 shadow-xl">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Our Commitment</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <h4 className="font-bold text-primary-700 dark:text-primary-300 mb-2">Transparency</h4>
              <p className="text-slate-600 dark:text-gray-400 text-sm">We publish our methodology, limitations, and bias mitigation efforts. Our scoring components and weights are publicly documented.</p>
            </div>
            <div>
              <h4 className="font-bold text-primary-700 dark:text-primary-300 mb-2">Accountability</h4>
              <p className="text-slate-600 dark:text-gray-400 text-sm">We regularly audit our systems for bias and publish aggregate fairness metrics. We welcome external scrutiny and feedback.</p>
            </div>
            <div>
              <h4 className="font-bold text-primary-700 dark:text-primary-300 mb-2">Continuous Improvement</h4>
              <p className="text-slate-600 dark:text-gray-400 text-sm">We iterate on our models based on real-world outcomes and community feedback, always prioritizing fairness alongside accuracy.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}