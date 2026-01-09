import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '@/components/Layout'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { GradientText } from '@/components/ui/GradientText'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'
import {
  BuildingOfficeIcon,
  GlobeAltIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  BriefcaseIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'

const IMPACT_TAGS = [
  "Environment Friendly", "Climate Tech", "Healthcare Access",
  "Education", "Financial Inclusion", "Women-Led",
  "Rural / Tier-2", "Accessibility", "Open Source"
]

export default function StartupOnboarding() {
  const { user } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    // Section 1: Basic Startup Profile
    name: '',
    sector: '',
    stage: '',
    region: '',
    location: '',
    description: '',
    impact_tags: [] as string[],
    website_url: '',
    founded_date: '',
    team_size: '1-2',
    is_incorporated: false,

    // Section 2: Founder Execution Signals
    founder_role: '',
    time_commitment: 'full_time',
    prev_startup_exp: false,
    experience_years: '0-2',
    cofounder_count: 0,

    // Section 3: Product/Solution
    product_description: '',

    // Section 4: Traction (Range-Based)
    mau_range: '0-100',
    user_growth_rate: '0-10%',
    revenue_status: 'pre_revenue',
    revenue_range: '0',
    retention_level: 'medium',

    // Section 5: Market & Business
    customer_type: 'B2C',
    market_size: 'medium',
    monetization_model: '',
    competition_level: 'medium',

    // Section 6: Roadmap & Intent
    next_milestone: '',
    current_bottleneck: '',
    fundraising_intent: false,
    target_raise_stage: 'seed'
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImpactTagToggle = (tag: string) => {
    setFormData(prev => {
      const currentTags = prev.impact_tags
      if (currentTags.includes(tag)) {
        return { ...prev, impact_tags: currentTags.filter(t => t !== tag) }
      } else if (currentTags.length < 5) {
        return { ...prev, impact_tags: [...currentTags, tag] }
      }
      return prev
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload = {
        ...formData,
        founded_date: formData.founded_date || undefined,
      }

      const response = await api.post('/startups/onboarding', payload)

      // Redirect to dashboard
      router.push('/startup/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <Head>
        <title>Startup Onboarding - ScaleX</title>
      </Head>

      <div className="bg-hero-glow bg-no-repeat bg-center opacity-10 fixed inset-0 pointer-events-none"></div>

      <div className="relative z-10 container-custom py-12 max-w-5xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Launch Your <GradientText>Journey</GradientText>
          </h1>
          <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Complete your comprehensive profile to get accurate readiness scores and connect with the right investors.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 animate-slide-up">
          {/* Section 1: Basic Startup Profile */}
          <GlassCard className="border-slate-200 dark:border-white/10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <BuildingOfficeIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              Section 1: Basic Startup Profile
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Startup Name *</label>
                <input
                  type="text"
                  required
                  className="input-field w-full"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Sector / Domain *</label>
                <select
                  required
                  className="input-field w-full"
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                >
                  <option value="">Select Sector</option>
                  <option value="FinTech">FinTech</option>
                  <option value="HealthTech">HealthTech</option>
                  <option value="EdTech">EdTech</option>
                  <option value="SaaS">SaaS</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Climate Tech">Climate Tech</option>
                  <option value="AgriTech">AgriTech</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Startup Stage *</label>
                <select
                  required
                  className="input-field w-full"
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                >
                  <option value="">Select Stage</option>
                  <option value="Idea">Idea</option>
                  <option value="Pre-Seed">Pre-Seed</option>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Series B">Series B</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Country / Region *</label>
                <input
                  type="text"
                  required
                  className="input-field w-full"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  placeholder="e.g. India, USA, Singapore"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">City</label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Bangalore, San Francisco"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Team Size *</label>
                <select
                  required
                  className="input-field w-full"
                  value={formData.team_size}
                  onChange={(e) => setFormData({ ...formData, team_size: e.target.value })}
                >
                  <option value="1-2">1-2</option>
                  <option value="3-5">3-5</option>
                  <option value="6-10">6-10</option>
                  <option value="11-20">11-20</option>
                  <option value="20+">20+</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Incorporated?</label>
                <div className="flex items-center space-x-4 mt-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_incorporated: true })}
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${formData.is_incorporated
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400'}`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_incorporated: false })}
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${!formData.is_incorporated
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400'}`}
                  >
                    No
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Website</label>
                <input
                  type="url"
                  className="input-field w-full"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">One-Liner Description *</label>
                <textarea
                  required
                  className="input-field w-full"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your startup in one compelling sentence..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-4 block uppercase tracking-wider">Impact Tags (select up to 5)</label>
                <div className="flex flex-wrap gap-3">
                  {IMPACT_TAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleImpactTagToggle(tag)}
                      className={`px-4 py-2 rounded-xl text-sm transition-all duration-300 border font-medium ${formData.impact_tags.includes(tag)
                        ? 'bg-primary-600/10 dark:bg-primary-500/20 border-primary-500 text-primary-700 dark:text-white shadow-md transform scale-105'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/10'
                        }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-slate-500 dark:text-gray-500 mt-3 text-right font-medium">
                  {formData.impact_tags.length}/5 selected
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Section 2: Founder Execution Signals */}
          <GlassCard className="border-slate-200 dark:border-white/10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <UserGroupIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              Section 2: Founder Execution Signals
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Founder Role *</label>
                <select
                  required
                  className="input-field w-full"
                  value={formData.founder_role}
                  onChange={(e) => setFormData({ ...formData, founder_role: e.target.value })}
                >
                  <option value="">Select Role</option>
                  <option value="CEO">CEO</option>
                  <option value="CTO">CTO</option>
                  <option value="COO">COO</option>
                  <option value="CPO">CPO</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Time Commitment *</label>
                <select
                  required
                  className="input-field w-full"
                  value={formData.time_commitment}
                  onChange={(e) => setFormData({ ...formData, time_commitment: e.target.value })}
                >
                  <option value="full_time">Full-Time</option>
                  <option value="part_time">Part-Time</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Previous Startup Experience?</label>
                <div className="flex items-center space-x-4 mt-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, prev_startup_exp: true })}
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${formData.prev_startup_exp
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400'}`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, prev_startup_exp: false })}
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${!formData.prev_startup_exp
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400'}`}
                  >
                    No
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Relevant Experience (Years) *</label>
                <select
                  required
                  className="input-field w-full"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                >
                  <option value="0-2">0-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Number of Co-founders *</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="10"
                  className="input-field w-full"
                  value={formData.cofounder_count}
                  onChange={(e) => setFormData({ ...formData, cofounder_count: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </GlassCard>

          {/* Section 3: Product/Solution */}
          <GlassCard className="border-slate-200 dark:border-white/10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <LightBulbIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              Section 3: Product / Solution
            </h2>
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Detailed Product Description *</label>
              <textarea
                required
                className="input-field w-full"
                rows={4}
                value={formData.product_description}
                onChange={(e) => setFormData({ ...formData, product_description: e.target.value })}
                placeholder="Describe your product, the problem it solves, and your unique approach..."
              />
            </div>
          </GlassCard>

          {/* Section 4: Traction (Range-Based) */}
          <GlassCard className="border-slate-200 dark:border-white/10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <ChartBarIcon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              Section 4: Traction (Range-Based)
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Monthly Active Users *</label>
                <select
                  required
                  className="input-field w-full"
                  value={formData.mau_range}
                  onChange={(e) => setFormData({ ...formData, mau_range: e.target.value })}
                >
                  <option value="0-100">0 - 100</option>
                  <option value="100-1k">100 - 1K</option>
                  <option value="1k-10k">1K - 10K</option>
                  <option value="10k-100k">10K - 100K</option>
                  <option value="100k+">100K+</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">User Growth Rate (MoM) *</label>
                <select
                  required
                  className="input-field w-full"
                  value={formData.user_growth_rate}
                  onChange={(e) => setFormData({ ...formData, user_growth_rate: e.target.value })}
                >
                  <option value="0-10%">0-10%</option>
                  <option value="10-25%">10-25%</option>
                  <option value="25-50%">25-50%</option>
                  <option value="50%+">50%+</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Revenue Status *</label>
                <select
                  required
                  className="input-field w-full"
                  value={formData.revenue_status}
                  onChange={(e) => setFormData({ ...formData, revenue_status: e.target.value })}
                >
                  <option value="pre_revenue">Pre-Revenue</option>
                  <option value="early_revenue">Early Revenue</option>
                  <option value="profitable">Profitable</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Monthly Revenue (Range) *</label>
                <select
                  required
                  className="input-field w-full"
                  value={formData.revenue_range}
                  onChange={(e) => setFormData({ ...formData, revenue_range: e.target.value })}
                >
                  <option value="0">$0 (Pre-Revenue)</option>
                  <option value="0-5k">$0 - $5K</option>
                  <option value="5k-25k">$5K - $25K</option>
                  <option value="25k-100k">$25K - $100K</option>
                  <option value="100k+">$100K+</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">User Retention *</label>
                <select
                  required
                  className="input-field w-full"
                  value={formData.retention_level}
                  onChange={(e) => setFormData({ ...formData, retention_level: e.target.value })}
                >
                  <option value="low">Low (0-30%)</option>
                  <option value="medium">Medium (30-60%)</option>
                  <option value="high">High (60%+)</option>
                </select>
              </div>
            </div>
          </GlassCard>

          {/* Section 5: Market & Business */}
          <GlassCard className="border-slate-200 dark:border-white/10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <BriefcaseIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              Section 5: Market & Business
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Customer Type *</label>
                <select
                  required
                  className="input-field w-full"
                  value={formData.customer_type}
                  onChange={(e) => setFormData({ ...formData, customer_type: e.target.value })}
                >
                  <option value="B2B">B2B</option>
                  <option value="B2C">B2C</option>
                  <option value="B2B2C">B2B2C</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Market Size *</label>
                <select
                  required
                  className="input-field w-full"
                  value={formData.market_size}
                  onChange={(e) => setFormData({ ...formData, market_size: e.target.value })}
                >
                  <option value="small">Small (Niche)</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Monetization Model *</label>
                <select
                  required
                  className="input-field w-full"
                  value={formData.monetization_model}
                  onChange={(e) => setFormData({ ...formData, monetization_model: e.target.value })}
                >
                  <option value="">Select Model</option>
                  <option value="subscription">Subscription</option>
                  <option value="freemium">Freemium</option>
                  <option value="transaction_fee">Transaction Fee</option>
                  <option value="advertising">Advertising</option>
                  <option value="marketplace">Marketplace</option>
                  <option value="enterprise">Enterprise License</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Primary Competitor Type *</label>
                <select
                  required
                  className="input-field w-full"
                  value={formData.competition_level}
                  onChange={(e) => setFormData({ ...formData, competition_level: e.target.value })}
                >
                  <option value="low">Low (New Market)</option>
                  <option value="medium">Medium</option>
                  <option value="high">High (Crowded)</option>
                </select>
              </div>
            </div>
          </GlassCard>

          {/* Section 6: Roadmap & Intent */}
          <GlassCard className="border-slate-200 dark:border-white/10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <RocketLaunchIcon className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              Section 6: Roadmap & Intent
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Next 30-60 Day Milestone *</label>
                <textarea
                  required
                  className="input-field w-full"
                  rows={3}
                  value={formData.next_milestone}
                  onChange={(e) => setFormData({ ...formData, next_milestone: e.target.value })}
                  placeholder="What's your key milestone in the next 30-60 days?"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Current Bottleneck *</label>
                <select
                  required
                  className="input-field w-full"
                  value={formData.current_bottleneck}
                  onChange={(e) => setFormData({ ...formData, current_bottleneck: e.target.value })}
                >
                  <option value="">Select Bottleneck</option>
                  <option value="Product Development">Product Development</option>
                  <option value="User Acquisition">User Acquisition</option>
                  <option value="Funding">Funding</option>
                  <option value="Team Hiring">Team Hiring</option>
                  <option value="Market Fit">Market Fit</option>
                  <option value="Technical">Technical</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Fundraising Intent?</label>
                <div className="flex items-center space-x-4 mt-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, fundraising_intent: true })}
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${formData.fundraising_intent
                      ? 'bg-pink-600 text-white'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400'}`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, fundraising_intent: false })}
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${!formData.fundraising_intent
                      ? 'bg-pink-600 text-white'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400'}`}
                  >
                    No
                  </button>
                </div>
              </div>
              {formData.fundraising_intent && (
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block uppercase tracking-wider">Target Raise Stage *</label>
                  <select
                    required
                    className="input-field w-full"
                    value={formData.target_raise_stage}
                    onChange={(e) => setFormData({ ...formData, target_raise_stage: e.target.value })}
                  >
                    <option value="angel">Angel</option>
                    <option value="seed">Seed</option>
                    <option value="series_a">Series A</option>
                    <option value="series_b">Series B</option>
                  </select>
                </div>
              )}
            </div>
          </GlassCard>

          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-200 px-4 py-3 rounded-xl text-sm text-center font-medium shadow-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              isLoading={loading}
              disabled={!formData.name}
              className="w-full md:w-auto text-lg px-8 py-3"
            >
              Generate Score & Dashboard
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
