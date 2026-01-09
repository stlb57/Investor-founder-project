import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { GradientText } from '@/components/ui/GradientText'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'
import { ArrowLeftIcon, CheckCircleIcon, SparklesIcon, FireIcon, UserGroupIcon, CurrencyDollarIcon, PresentationChartLineIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

interface ImprovementTask {
  id: string
  category: string
  task: string
  description: string
  impact: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  completed: boolean
}

interface ReadinessScoreData {
  score: number
  confidence_band: number
  components: any
  strengths: string[]
  weaknesses: string[]
  improvements: string[]
}

export default function StartupImprove() {
  const { user } = useAuth()
  const [readinessScore, setReadinessScore] = useState<ReadinessScoreData | null>(null)
  const [tasks, setTasks] = useState<ImprovementTask[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'startup') {
      loadImprovementData()
    }
  }, [user])

  const loadImprovementData = async () => {
    try {
      // Get startup profile first
      const profileResponse = await api.get('/startups/profile')

      // Calculate readiness score
      const scoreResponse = await api.post('/scoring/readiness', {
        startup_id: profileResponse.data.id
      })
      setReadinessScore(scoreResponse.data)

      // Generate improvement tasks based on score
      generateImprovementTasks(scoreResponse.data)

    } catch (error) {
      console.error('Failed to load improvement data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateImprovementTasks = (scoreData: ReadinessScoreData) => {
    const tasks: ImprovementTask[] = []

    // Generate tasks based on weaknesses and improvements
    scoreData.improvements.forEach((improvement, index) => {
      let category = 'General'
      let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium'
      let impact = 5

      if (improvement.includes('execution')) {
        category = 'Execution'
        difficulty = 'Medium'
        impact = 8
      } else if (improvement.includes('traction')) {
        category = 'Traction'
        difficulty = 'Hard'
        impact = 10
      } else if (improvement.includes('market')) {
        category = 'Market'
        difficulty = 'Easy'
        impact = 6
      } else if (improvement.includes('team')) {
        category = 'Team'
        difficulty = 'Medium'
        impact = 7
      } else if (improvement.includes('capital')) {
        category = 'Capital'
        difficulty = 'Hard'
        impact = 9
      }

      tasks.push({
        id: `task-${index}`,
        category,
        task: improvement,
        description: getTaskDescription(improvement),
        impact,
        difficulty,
        completed: false
      })
    })

    // Add some general improvement tasks
    if (scoreData.score < 70) {
      tasks.push({
        id: 'timeline-events',
        category: 'Execution',
        task: 'Add recent timeline events',
        description: 'Document your latest product releases, team hires, or traction milestones',
        impact: 5,
        difficulty: 'Easy',
        completed: false
      })
    }

    if (scoreData.score < 50) {
      tasks.push({
        id: 'market-research',
        category: 'Market',
        task: 'Conduct market validation',
        description: 'Survey potential customers and validate your value proposition',
        impact: 8,
        difficulty: 'Medium',
        completed: false
      })
    }

    setTasks(tasks)
  }

  const getTaskDescription = (improvement: string): string => {
    const descriptions: { [key: string]: string } = {
      'Establish regular product release cadence': 'Set up a consistent schedule for product updates and feature releases to demonstrate execution consistency.',
      'Focus on user acquisition and retention metrics': 'Implement tracking for key metrics like CAC, LTV, and retention rates to show traction growth.',
      'Clarify target market and value proposition': 'Define your ideal customer profile and unique value proposition more clearly.',
      'Strengthen team with key hires or reduce founder churn': 'Add strategic team members or address any founder/key employee departures.',
      'Improve capital efficiency or funding strategy': 'Optimize your burn rate and develop a clear funding roadmap.'
    }

    return descriptions[improvement] || 'Work on this area to improve your readiness score.'
  }

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20 shadow-sm'
      case 'Medium': return 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20 shadow-sm'
      case 'Hard': return 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20 shadow-sm'
      default: return 'bg-slate-100 dark:bg-gray-500/10 text-slate-600 dark:text-gray-400 border-slate-200 dark:border-gray-500/20'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Execution': return <FireIcon className="w-5 h-5 text-orange-400" />
      case 'Traction': return <PresentationChartLineIcon className="w-5 h-5 text-purple-400" />
      case 'Market': return <GlobeAltIcon className="w-5 h-5 text-blue-400" />
      case 'Team': return <UserGroupIcon className="w-5 h-5 text-pink-400" />
      case 'Capital': return <CurrencyDollarIcon className="w-5 h-5 text-green-400" />
      default: return <SparklesIcon className="w-5 h-5 text-yellow-400" />
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin mb-4"></div>
            <div className="text-slate-500 dark:text-gray-400">Analyzing improvement opportunities...</div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Improve Your Score - ScaleX">
      <div className="bg-hero-glow bg-no-repeat bg-center opacity-10 fixed inset-0 pointer-events-none"></div>

      <div className="relative z-10 container-custom py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 animate-fade-in">
          <div>
            <Link href="/startup/dashboard" className="inline-flex items-center text-slate-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white mb-4 transition-colors font-medium">
              <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Improve <GradientText>Readiness</GradientText></h1>
            <p className="text-slate-600 dark:text-gray-400">
              Actionable tasks to boost your score and investor visibility.
            </p>
          </div>
          <div className="mt-6 md:mt-0 glass px-6 py-3 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm transition-all hover:bg-white/5">
            <div className="text-sm text-slate-500 dark:text-gray-400 mb-1 font-semibold uppercase tracking-wider">Current Score</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white leading-none">
              {readinessScore?.score || 0}
              <span className="text-sm text-slate-500 dark:text-gray-500 font-normal ml-2">± {readinessScore?.confidence_band || 0}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tasks List */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-primary-600 dark:text-yellow-400" />
                Recommended Actions
              </h2>

              {tasks.length === 0 ? (
                <GlassCard className="text-center py-12 border-slate-200 dark:border-white/10 shadow-sm">
                  <div className="text-green-500/20 mb-4 bg-green-50 dark:bg-green-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto border border-green-100 dark:border-transparent">
                    <CheckCircleIcon className="w-10 h-10 text-green-600 dark:text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">All Systems Go!</h3>
                  <p className="text-slate-600 dark:text-gray-400 max-w-md mx-auto">
                    You&apos;re performing well across all key metrics. Continue documenting your progress in the timeline to maintain your score.
                  </p>
                </GlassCard>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task, idx) => (
                    <GlassCard
                      key={task.id}
                      className={`group transition-all duration-300 hover:border-primary-500/30 dark:hover:border-white/20 border-slate-200 dark:border-white/10 shadow-sm ${task.completed ? 'opacity-75 grayscale bg-slate-50 dark:bg-white/5' : 'opacity-100'} animate-slide-up`}
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 dark:border-gray-500 hover:border-primary-400 dark:hover:border-primary-400'
                            }`}
                        >
                          {task.completed && <CheckCircleIcon className="w-4 h-4" />}
                        </button>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className={`font-bold text-lg ${task.completed ? 'text-slate-400 dark:text-gray-500 line-through' : 'text-slate-900 dark:text-white'}`}>
                              {task.task}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${getDifficultyColor(task.difficulty)}`}>
                                {task.difficulty}
                              </span>
                              <span className="px-2 py-0.5 text-[10px] bg-slate-100 dark:bg-black/30 text-primary-700 dark:text-primary-300 rounded border border-slate-200 dark:border-white/5 flex items-center gap-1 font-bold uppercase tracking-wider">
                                {getCategoryIcon(task.category)}
                                {task.category}
                              </span>
                            </div>
                          </div>
                          <p className="text-slate-600 dark:text-gray-400 text-sm mb-3 font-medium">{task.description}</p>
                          <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-bold">
                            <SparklesIcon className="w-3.5 h-3.5" />
                            +{task.impact} points impact
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="space-y-6">
            {readinessScore && (
              <GlassCard className="sticky top-24 animate-slide-up border-slate-200 dark:border-white/10 shadow-md" delay="0.3s">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-white/10 pb-4">Score Breakdown</h3>
                <div className="space-y-4">
                  {Object.entries(readinessScore.components).map(([key, component]: [string, any]) => (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-slate-500 dark:text-gray-400 capitalize flex items-center gap-2 font-medium">
                          {getCategoryIcon(key)} {/* Reusing category icon logic roughly matches keys */}
                          {key.replace('_', ' ')}
                        </span>
                        <span className={`text-sm font-bold ${component.score >= 70 ? 'text-green-600 dark:text-green-400' :
                          component.score >= 40 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                          }`}>{component.score}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-1.5 overflow-hidden border border-slate-200 dark:border-transparent">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${component.score >= 70 ? 'bg-green-500' :
                            component.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          style={{ width: `${component.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {readinessScore?.strengths && readinessScore.strengths.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/10">
                    <h4 className="text-sm font-bold text-green-700 dark:text-green-400 mb-4 flex items-center gap-2">
                      <SparklesIcon className="w-4 h-4" /> Your Strengths
                    </h4>
                    <ul className="space-y-3">
                      {readinessScore.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-gray-300 font-medium">
                          <CheckCircleIcon className="w-4 h-4 text-green-600/70 dark:text-green-500/70 mt-0.5 shrink-0" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/10 space-y-3">
                  <Button variant="primary" className="w-full shadow-sm" onClick={() => loadImprovementData()}>Recalculate Score</Button>
                  <Link href="/startup/onboarding" className="block w-full">
                    <Button variant="secondary" className="w-full">Update Profile</Button>
                  </Link>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}