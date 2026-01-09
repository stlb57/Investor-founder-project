import React from 'react'
import { GlassCard } from '../ui/GlassCard'
import { CheckCircleIcon, ExclamationTriangleIcon, LightBulbIcon } from '@heroicons/react/24/outline'

interface ReadinessScoreProps {
  score: number
  confidenceBand: number
  components?: {
    execution: { score: number; explanation: any }
    traction: { score: number; explanation: any }
    market: { score: number; explanation: any }
    team: { score: number; explanation: any }
    capital: { score: number; explanation: any }
  }
  strengths?: string[]
  weaknesses?: string[]
  improvements?: string[]
  showDetails?: boolean
}

export default function ReadinessScore({
  score,
  confidenceBand,
  components,
  strengths = [],
  weaknesses = [],
  improvements = [],
  showDetails = false
}: ReadinessScoreProps) {
  const getScoreClass = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400'
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Investment Ready'
    if (score >= 60) return 'Strong Progress'
    if (score >= 40) return 'Building Momentum'
    if (score >= 20) return 'Early Stage'
    return 'Pre-Readiness'
  }

  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Startup Readiness Score</h3>
        <div className="text-xs text-slate-500 dark:text-gray-500 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded border border-slate-200 dark:border-white/10">
          Updated {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Main Score Display */}
      <div className="flex items-center space-x-6 mb-8">
        <div className="relative w-32 h-32">
          {/* Background Circle */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-slate-200 dark:text-white/10"
            />
            {/* Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
              className={`transition-all duration-1000 ${getScoreClass(score)}`}
              strokeLinecap="round"
            />
          </svg>
          {/* Score Number */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-4xl font-black ${getScoreClass(score)}`}>{score}</span>
          </div>
        </div>

        <div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {getScoreLabel(score)}
          </div>
          <div className="text-slate-500 dark:text-gray-400 mb-2 font-mono font-medium">
            Score: {score} ± {confidenceBand}
          </div>
          <div className="text-xs text-slate-400 dark:text-gray-500">
            Confidence band indicates uncertainty
          </div>
        </div>
      </div>

      {/* Component Breakdown */}
      {components && showDetails && (
        <div className="mb-8">
          <h4 className="font-bold text-slate-700 dark:text-gray-300 mb-4 uppercase text-xs tracking-widest">Score Components</h4>
          <div className="space-y-4">
            {Object.entries(components).map(([key, component]) => (
              <div key={key} className="flex items-center justify-between group">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded flex items-center justify-center bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-bold ${getScoreClass(component.score)}`}>
                    {component.score}
                  </div>
                  <span className="capitalize text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors font-medium">
                    {key.replace('_', ' ')}
                  </span>
                </div>
                <div className="w-32 bg-slate-100 dark:bg-white/10 rounded-full h-1.5 overflow-hidden border border-slate-200 dark:border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${component.score >= 70 ? 'bg-green-500' :
                      component.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    style={{ width: `${component.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {showDetails && (
        <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-slate-200 dark:border-white/10">
          {/* Strengths */}
          {strengths.length > 0 && (
            <div>
              <h4 className="font-bold text-green-700 dark:text-green-400 mb-3 flex items-center text-sm uppercase tracking-wider">
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Strengths
              </h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-gray-400">
                {strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-green-500/50">•</span> {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses */}
          {weaknesses.length > 0 && (
            <div>
              <h4 className="font-bold text-red-700 dark:text-red-400 mb-3 flex items-center text-sm uppercase tracking-wider">
                <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                Risk Factors
              </h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-gray-400">
                {weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-red-500/50">•</span> {weakness}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvements */}
          {improvements.length > 0 && (
            <div>
              <h4 className="font-bold text-cyan-700 dark:text-cyan-400 mb-3 flex items-center text-sm uppercase tracking-wider">
                <LightBulbIcon className="w-4 h-4 mr-2" />
                Action Items
              </h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-gray-400">
                {improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-cyan-500/50">•</span> {improvement}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Explainability Note */}
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
        <div className="bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 p-4 rounded-lg shadow-inner">
          <h4 className="font-bold text-primary-700 dark:text-primary-300 mb-2 text-sm">How This Score Works</h4>
          <p className="text-xs text-primary-600/80 dark:text-primary-200/70 leading-relaxed">
            The Readiness Score combines execution consistency (25%), traction velocity (25%),
            market clarity (20%), team stability (15%), and capital efficiency (15%).
            The confidence band (±{confidenceBand}) reflects data completeness and uncertainty.
          </p>
        </div>
      </div>
    </GlassCard>
  )
}