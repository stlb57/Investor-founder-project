import React from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { ExclamationTriangleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

interface Risk {
    risk: string
    evidence: string
    mitigation: string
}

interface RiskSurfacingProps {
    risks: Risk[]
}

export function RiskSurfacing({ risks }: RiskSurfacingProps) {
    if (!risks || risks.length === 0) {
        return (
            <GlassCard className="p-6 text-center border-green-500/20">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 text-green-400">
                    <ShieldCheckIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Resilient Signal</h3>
                <p className="text-gray-400 text-sm">No structural execution risks detected in the current quality window.</p>
            </GlassCard>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-white">Risk Surfacing</h3>
                <span className="text-[10px] uppercase tracking-wider text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/10 ml-2">Ambient Intelligence</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {risks.map((risk, index) => (
                    <GlassCard key={index} className="p-5 border-l-4 border-l-yellow-500/50 hover:border-l-yellow-500 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-white text-md">{risk.risk}</h4>
                            <span className="text-[10px] font-bold text-yellow-500/70 border border-yellow-500/30 px-2 py-0.5 rounded uppercase">Medium Risk</span>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-tighter mb-1 font-bold italic underline">Evidence</p>
                                <p className="text-sm text-gray-300 italic">&quot;{risk.evidence}&quot;</p>
                            </div>
                            <div className="bg-primary-500/5 p-3 rounded-lg border border-primary-500/10">
                                <p className="text-[10px] text-primary-400 uppercase tracking-tighter mb-1 font-bold">Mitigation Strategy</p>
                                <p className="text-sm text-primary-100 font-medium">{risk.mitigation}</p>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>

            <p className="text-[10px] text-gray-500 text-center italic mt-4">
                &quot;What would kill this startup?&quot; — Risk surfacing focuses on preventive intelligence vs. simple scoring.
            </p>
        </div>
    )
}
