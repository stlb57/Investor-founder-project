import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '@/components/Layout'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { GradientText } from '@/components/ui/GradientText'
import { ArrowRightIcon, ChartBarIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <Layout checkAuth={false}>
      <Head>
        <title>ScaleX - AI Decision Support for Startup Funding</title>
        <meta name="description" content="Bias-aware funding signal intelligence layer connecting investors with execution-ready startups" />
      </Head>

      <div className="relative min-h-screen overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary-500/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 container-custom pt-32 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-600 dark:text-gray-300 mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
              Next Generation Funding Intelligence
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight leading-tight animate-slide-up">
              Find Signal in the <br /> <GradientText>Noise</GradientText>
            </h1>

            <p className="text-xl text-slate-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              AI decision support that connects investors with execution-ready startups.
              Bias-aware, explainable, focused on <span className="text-slate-900 dark:text-white font-medium">progress over pedigree</span>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/auth/signup?role=investor">
                <Button className="w-full sm:w-auto text-lg px-8 py-4" icon={<ArrowRightIcon className="w-5 h-5" />}>
                  For Investors
                </Button>
              </Link>

              <Link href="/auth/signup?role=startup">
                <Button variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4" icon={<SparklesIcon className="w-5 h-5" />}>
                  For Startups
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="container-custom py-20 relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            <GlassCard delay="0.3s" className="border-slate-200 dark:border-white/10">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center mb-6 text-primary-600 dark:text-primary-400">
                <ChartBarIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Readiness Score</h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                0-100 investability score based on execution consistency,
                traction velocity, and team stability. Visible to founders, validated for investors.
              </p>
            </GlassCard>

            <GlassCard delay="0.4s" className="border-slate-200 dark:border-white/10">
              <div className="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-500/20 flex items-center justify-center mb-6 text-secondary-600 dark:text-secondary-400">
                <SparklesIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Timeline Visualization</h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                Graphical startup journey replacing storytelling with
                objective progress tracking. Reduces bias, explains score changes.
              </p>
            </GlassCard>

            <GlassCard delay="0.5s" className="border-slate-200 dark:border-white/10 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                <ShieldCheckIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Responsible AI</h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
                Explainable decisions, bias mitigation, confidence bands,
                and regional normalization. Every decision shows reasoning.
              </p>
            </GlassCard>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-slate-200 dark:border-white/5 py-12 mt-20 bg-slate-50 dark:bg-black/20 backdrop-blur-sm">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-white/10">
                  <Image
                    src="/logo.png"
                    alt="ScaleX Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-slate-500 dark:text-gray-400 text-sm font-medium">
                  © 2024 ScaleX. Decision infrastructure.
                </div>
              </div>
              <div className="flex gap-8">
                <div className="flex gap-8">
                  <Link href="/pricing" className="text-slate-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white transition-colors text-sm">
                    Pricing
                  </Link>
                  <Link href="/insights" className="text-slate-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white transition-colors text-sm">
                    Insights
                  </Link>
                  <Link href="/responsible-ai" className="text-slate-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white transition-colors text-sm">
                    Responsible AI
                  </Link>
                  <Link href="#" className="text-slate-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white transition-colors text-sm">
                    Privacy Policy
                  </Link>
                  <Link href="#" className="text-slate-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white transition-colors text-sm">
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  )
}
