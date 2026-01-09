import React from 'react'
import { GlassCard } from '../ui/GlassCard'
import { Button } from '../ui/Button'
import Link from 'next/link'
import {
    ExclamationTriangleIcon,
    InformationCircleIcon,
    CheckCircleIcon,
    ArrowTrendingUpIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'

interface SignalCardProps {
    signal: {
        id: string
        type: string
        severity: 'low' | 'medium' | 'high'
        headline: string
        explanation: string
        evidence: string
        startup_name: string
        created_at: string
        action_label: string
        action_link: string
    }
}

export const SignalCard: React.FC<SignalCardProps> = ({ signal }) => {
    const getSeverityStyles = (severity: string) => {
        switch (severity) {
            case 'high':
                return 'border-red-500/30 bg-red-500/5'
            case 'medium':
                return 'border-yellow-500/30 bg-yellow-500/5'
            default:
                return 'border-white/10 bg-white/5'
        }
    }

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'high':
                return <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
            case 'medium':
                return <InformationCircleIcon className="w-5 h-5 text-yellow-400" />
            default:
                return <CheckCircleIcon className="w-5 h-5 text-primary-400" />
        }
    }

    return (
        <GlassCard className={`mb-6 transition-all hover:scale-[1.01] ${getSeverityStyles(signal.severity)}`}>
            <div className="flex items-start gap-4">
                <div className="mt-1">
                    {getSeverityIcon(signal.severity)}
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                            {signal.startup_name} • {signal.type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-gray-600">
                            {new Date(signal.created_at).toLocaleDateString()}
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3">
                        {signal.headline}
                    </h3>

                    <div className="space-y-4 mb-6">
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Why this matters</h4>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                {signal.explanation}
                            </p>
                        </div>

                        <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                            <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                                <MagnifyingGlassIcon className="w-3 h-3" /> Evidence
                            </h4>
                            <p className="text-xs text-gray-400 italic">
                                {signal.evidence}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Link href={signal.action_link}>
                            <Button variant="secondary" className="text-sm py-1.5 h-auto">
                                {signal.action_label}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </GlassCard>
    )
}
