import React from 'react'
import { GlassCard } from '@/components/ui/GlassCard'

interface TimelineScrubberProps {
    currentDateIndex: number
    totalEvents: number
    onChange: (index: number) => void
    startDate?: string
    endDate?: string
}

export function TimelineScrubber({ currentDateIndex, totalEvents, onChange, startDate, endDate }: TimelineScrubberProps) {
    if (totalEvents === 0) return null

    return (
        <GlassCard className="mb-6 p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Time-Scrub Analysis</span>
                <span className="text-[10px] text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded border border-primary-500/20 animate-pulse">
                    Live Cause-Effect Mode
                </span>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-xs text-gray-500 font-mono">{startDate || 'Start'}</div>

                <div className="flex-1 relative h-6 flex items-center">
                    {/* Track */}
                    <div className="absolute inset-0 top-1/2 -translate-y-1/2 h-1 bg-white/10 rounded-full" />
                    <div
                        className="absolute h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-300"
                        style={{ width: `${(currentDateIndex / (totalEvents - 1)) * 100}%`, top: '50%', transform: 'translateY(-50%)' }}
                    />

                    {/* Ticks */}
                    {Array.from({ length: totalEvents }).map((_, i) => (
                        <div
                            key={i}
                            className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full z-10 transition-all duration-500 ${i <= currentDateIndex ? 'bg-white' : 'bg-white/10'
                                }`}
                            style={{ left: `${(i / (totalEvents - 1)) * 100}%` }}
                        />
                    ))}

                    {/* Input Range (Invisible but interactive) */}
                    <input
                        type="range"
                        min={0}
                        max={totalEvents - 1}
                        value={currentDateIndex}
                        onChange={(e) => onChange(parseInt(e.target.value))}
                        className="w-full h-full absolute inset-0 opacity-0 cursor-pointer z-20"
                    />

                    {/* Thumb (Custom visual) */}
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center pointer-events-none transition-all duration-200"
                        style={{
                            left: `${(currentDateIndex / (totalEvents - 1)) * 100}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        <div className="w-6 h-6 bg-white rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] border-2 border-primary-500 flex items-center justify-center rotate-45">
                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-sm -rotate-45" />
                        </div>
                    </div>
                </div>

                <div className="text-xs text-gray-500 font-mono">{endDate || 'Now'}</div>
            </div>

            <div className="text-center mt-1">
                <span className="text-[10px] text-gray-600 italic">Drag to correlate execution milestones with readiness trajectory</span>
            </div>
        </GlassCard>
    )
}
