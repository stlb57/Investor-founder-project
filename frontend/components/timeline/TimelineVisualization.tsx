import React from 'react'
import { format } from 'date-fns'
import { GlassCard } from '../ui/GlassCard'
import { CheckCircleIcon, QuestionMarkCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

interface TimelineEvent {
  id: string
  event_date: string
  event_type: 'founder_team' | 'product_execution' | 'traction' | 'capital'
  title: string
  description?: string
  confidence: 'verified' | 'self_reported' | 'inferred'
  impact_score?: number
}

interface TimelineVisualizationProps {
  events: TimelineEvent[]
  showImpact?: boolean
  editable?: boolean
  onEventClick?: (event: TimelineEvent) => void
  showPeerBaseline?: boolean
}

const eventTypeConfig: Record<string, { label: string; color: string; dotClass: string }> = {
  MILESTONE: {
    label: 'Critical Milestone',
    color: 'blue',
    dotClass: 'bg-blue-500'
  },
  PIVOT: {
    label: 'Strategic Pivot',
    color: 'orange',
    dotClass: 'bg-orange-500'
  },
  FUNDING: {
    label: 'Capital Raised',
    color: 'green',
    dotClass: 'bg-green-500'
  },
  TEAM: {
    label: 'Team Evolution',
    color: 'purple',
    dotClass: 'bg-purple-500'
  },
  PRODUCT: {
    label: 'Product Launch/Update',
    color: 'cyan',
    dotClass: 'bg-cyan-500'
  },
  INVESTMENT: {
    label: 'Investment',
    color: 'emerald',
    dotClass: 'bg-emerald-500'
  },
  EXIT: {
    label: 'Exit Event',
    color: 'yellow',
    dotClass: 'bg-yellow-500'
  },
  ADVISORY: {
    label: 'Advisory',
    color: 'indigo',
    dotClass: 'bg-indigo-500'
  }
}

const confidenceConfig: Record<string, { label: string; icon: JSX.Element; class: string }> = {
  VERIFIED: { label: 'Verified', icon: <CheckCircleIcon className="w-4 h-4" />, class: 'text-green-400' },
  SELF_REPORTED: { label: 'Self-reported', icon: <InformationCircleIcon className="w-4 h-4" />, class: 'text-blue-400' },
  AUDITED: { label: 'Audited', icon: <CheckCircleIcon className="w-4 h-4" />, class: 'text-emerald-400' }
}

export default function TimelineVisualization({
  events,
  showImpact = false,
  editable = false,
  onEventClick,
  showPeerBaseline = false
}: TimelineVisualizationProps) {
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) =>
    new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
  )

  if (events.length === 0) {
    return (
      <GlassCard className="text-center py-12">
        <div className="text-gray-500 mb-4 flex justify-center">
          <InformationCircleIcon className="w-12 h-12" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">No timeline events</h3>
        <p className="text-gray-400">
          {editable ? 'Add your first milestone to start building your timeline.' : 'No execution history available.'}
        </p>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="h-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h3 className="text-xl font-bold text-white">Startup Journey Timeline</h3>
        <div className="flex flex-wrap gap-4 text-xs">
          {Object.entries(eventTypeConfig).map(([type, config]) => (
            <div key={type} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${config.dotClass}`} />
              <span className="text-gray-400">{config.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative border-l-2 border-slate-300 dark:border-white/20 ml-3 md:ml-6 space-y-8 my-4">
        {sortedEvents.map((event, index) => {
          const config = eventTypeConfig[event.event_type] || {
            label: 'Other Event',
            color: 'gray',
            dotClass: 'bg-gray-500'
          }
          const confidenceInfo = confidenceConfig[event.confidence] || {
            label: 'Unverified',
            icon: <QuestionMarkCircleIcon className="w-4 h-4" />,
            class: 'text-gray-400'
          }

          return (
            <div
              key={event.id}
              className={`relative pl-8 md:pl-12 transition-all ${editable ? 'cursor-pointer hover:opacity-80' : ''}`}
              onClick={() => editable && onEventClick?.(event)}
            >
              {/* Timeline connect dot */}
              <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-background z-10 ${config.dotClass}`} />

              <div className="flex flex-col md:flex-row gap-4 justify-between items-start bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className="font-bold text-white text-lg">{event.title}</h4>
                    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 ${confidenceInfo.class}`} title={confidenceInfo.label}>
                      {confidenceInfo.icon} {confidenceInfo.label}
                    </span>
                  </div>

                  <div className="text-sm text-primary-400 font-mono mb-2">
                    {format(new Date(event.event_date), 'MMM d, yyyy')}
                  </div>

                  {event.description && (
                    <p className="text-sm text-gray-400 mb-3 leading-relaxed">{event.description}</p>
                  )}

                  <div className="inline-block px-2 py-1 rounded text-xs font-medium bg-white/10 text-gray-300">
                    {config.label}
                  </div>
                </div>

                {showImpact && event.impact_score !== undefined && (
                  <div className={`shrink-0 px-3 py-1 rounded-lg text-sm font-bold border ${event.impact_score > 0
                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                    : event.impact_score < 0
                      ? 'bg-red-500/10 text-red-400 border-red-500/20'
                      : 'bg-white/5 text-gray-400 border-white/10'
                    }`}>
                    Momentum: {event.impact_score > 0 ? '+' : ''}{event.impact_score}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Timeline Stats */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {Object.entries(eventTypeConfig).map(([type, config]) => {
            const count = events.filter(e => e.event_type === type).length
            return (
              <div key={type} className="p-3 rounded-lg bg-white/5">
                <div className="text-2xl font-bold text-white mb-1">{count}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">{config.label.split(' ')[0]}</div>
              </div>
            )
          })}
        </div>
      </div>
    </GlassCard>
  )
}