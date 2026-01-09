import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '@/components/Layout'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { GradientText } from '@/components/ui/GradientText'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'
import { BanknotesIcon, BriefcaseIcon, GlobeAltIcon, UserIcon } from '@heroicons/react/24/outline'

export default function InvestorOnboarding() {
  const { user } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (user?.role === 'investor') {
      api.get('/investors/profile')
        .then(() => router.push('/investor/dashboard'))
        .catch(() => { }) // No profile, stay on onboarding
    }
  }, [user])

  const [formData, setFormData] = useState({
    name: '',
    firm_name: '',
    type: 'angel',
    stage_preference: [] as string[],
    sector_interests: [] as string[],
    region_focus: [] as string[],
    check_size_min: '',
    check_size_max: '',
    investment_thesis: '',
    past_investments: [] as string[]
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const stages = ['Idea', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+']
  const sectors = ['FinTech', 'HealthTech', 'EdTech', 'SaaS', 'E-commerce', 'AI/ML', 'Climate Tech', 'AgriTech', 'Other']
  const regions = ['North America', 'Europe', 'Asia Pacific', 'India', 'Southeast Asia', 'Middle East', 'Africa', 'Latin America']

  const toggleStage = (stage: string) => {
    setFormData(prev => ({
      ...prev,
      stage_preference: prev.stage_preference.includes(stage)
        ? prev.stage_preference.filter(s => s !== stage)
        : [...prev.stage_preference, stage]
    }))
  }

  const toggleSector = (sector: string) => {
    setFormData(prev => ({
      ...prev,
      sector_interests: prev.sector_interests.includes(sector)
        ? prev.sector_interests.filter(s => s !== sector)
        : [...prev.sector_interests, sector]
    }))
  }

  const toggleRegion = (region: string) => {
    setFormData(prev => ({
      ...prev,
      region_focus: prev.region_focus.includes(region)
        ? prev.region_focus.filter(r => r !== region)
        : [...prev.region_focus, region]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload = {
        ...formData,
        check_size_min: formData.check_size_min ? parseInt(formData.check_size_min) : null,
        check_size_max: formData.check_size_max ? parseInt(formData.check_size_max) : null
      }

      await api.post('/investors/onboarding', payload)
      router.push('/investor/dashboard')
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to create profile'

      // If profile already exists, redirect to dashboard
      if (errorMessage.includes('already exists')) {
        router.push('/investor/dashboard')
      } else {
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <Head>
        <title>Investor Onboarding - ScaleX</title>
      </Head>

      <div className="bg-hero-glow bg-no-repeat bg-center opacity-10 fixed inset-0 pointer-events-none"></div>

      <div className="relative z-10 container-custom py-12 max-w-5xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Join <GradientText>ScaleX</GradientText></h1>
          <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Complete your comprehensive investor profile to get matched with high-signal, vetted startups.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 animate-slide-up">
          {/* Basic Info */}
          <GlassCard className="border-slate-200 dark:border-white/10 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary-100 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20">
                <UserIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              Primary Info
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block">Full Name *</label>
                <input
                  type="text"
                  required
                  className="input-field w-full bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Connor"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block">Firm / Fund Name</label>
                <input
                  type="text"
                  className="input-field w-full bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  value={formData.firm_name}
                  onChange={(e) => setFormData({ ...formData, firm_name: e.target.value })}
                  placeholder="e.g. Acme Ventures"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block">Investor Type *</label>
                <select
                  className="input-field w-full bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="angel">Angel Investor</option>
                  <option value="vc">Venture Capital (VC)</option>
                  <option value="accelerator">Accelerator</option>
                  <option value="cvc">Corporate VC</option>
                  <option value="family_office">Family Office</option>
                  <option value="pe">Private Equity</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </GlassCard>

          {/* Investment Focus */}
          <GlassCard className="border-slate-200 dark:border-white/10 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20">
                <BriefcaseIcon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              Investment Focus
            </h2>

            <div className="mb-8">
              <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-4 block">Stage Preference (Select All That Apply)</label>
              <div className="flex flex-wrap gap-3">
                {stages.map(stage => (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => toggleStage(stage)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border ${formData.stage_preference.includes(stage)
                      ? 'bg-cyan-600 text-white border-cyan-500 shadow-md'
                      : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:border-cyan-400'
                      }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-4 block">Sector Interests (Select All That Apply)</label>
              <div className="flex flex-wrap gap-3">
                {sectors.map(sector => (
                  <button
                    key={sector}
                    type="button"
                    onClick={() => toggleSector(sector)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border ${formData.sector_interests.includes(sector)
                      ? 'bg-primary-600 text-white border-primary-500 shadow-md'
                      : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:border-primary-400'
                      }`}
                  >
                    {sector}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-4 block">Geographic Focus (Select All That Apply)</label>
              <div className="flex flex-wrap gap-3">
                {regions.map(region => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => toggleRegion(region)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border ${formData.region_focus.includes(region)
                      ? 'bg-green-600 text-white border-green-500 shadow-md'
                      : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:border-green-400'
                      }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Check Size */}
          <GlassCard className="border-slate-200 dark:border-white/10 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
                <BanknotesIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              Investment Capacity (USD)
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block">Minimum Check Size</label>
                <input
                  type="number"
                  className="input-field w-full bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  value={formData.check_size_min}
                  onChange={(e) => setFormData({ ...formData, check_size_min: e.target.value })}
                  placeholder="e.g., 25000"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block">Maximum Check Size</label>
                <input
                  type="number"
                  className="input-field w-full bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  value={formData.check_size_max}
                  onChange={(e) => setFormData({ ...formData, check_size_max: e.target.value })}
                  placeholder="e.g., 500000"
                />
              </div>
            </div>
          </GlassCard>

          {/* Investment Thesis */}
          <GlassCard className="border-slate-200 dark:border-white/10 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20">
                <BriefcaseIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              Investment Philosophy
            </h2>
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block">Investment Thesis (Optional)</label>
              <textarea
                className="input-field w-full bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-medium"
                rows={4}
                placeholder="Describe your investment philosophy, what you look for in startups..."
                value={formData.investment_thesis}
                onChange={(e) => setFormData({ ...formData, investment_thesis: e.target.value })}
              />
            </div>
          </GlassCard>

          {/* Past Investments (Optional) */}
          <GlassCard className="border-slate-200 dark:border-white/10 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20">
                <GlobeAltIcon className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              Portfolio (Optional)
            </h2>
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 block">Past Investments / Portfolio Companies</label>
              <textarea
                className="input-field w-full bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-medium"
                rows={4}
                placeholder="List notable investments, one per line..."
                value={formData.past_investments.join('\n')}
                onChange={(e) => setFormData({
                  ...formData,
                  past_investments: e.target.value.split('\n').filter(i => i.trim())
                })}
              />
            </div>
          </GlassCard>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-lg text-sm text-center">
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
              Create Investor Profile
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
