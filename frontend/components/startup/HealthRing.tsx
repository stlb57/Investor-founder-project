import React from 'react'

interface HealthRingProps {
    score: number // 0-100
    size?: number
    label?: string
}

export function HealthRing({ score, size = 120, label = "Readiness" }: HealthRingProps) {
    const radius = size / 2
    const strokeWidth = size / 12
    const normalizedRadius = radius - strokeWidth * 2
    const circumference = normalizedRadius * 2 * Math.PI

    // Gaps represent execution density
    const gapSize = 10
    const dashArray = `${circumference - gapSize} ${gapSize}`
    const strokeDashoffset = circumference - (score / 100) * circumference

    let color = 'rgba(239, 68, 68, 1)' // red-500
    let shadowColor = 'rgba(239, 68, 68, 0.4)'

    if (score >= 70) {
        color = 'rgba(16, 185, 129, 1)' // green-500
        shadowColor = 'rgba(16, 185, 129, 0.4)'
    } else if (score >= 40) {
        color = 'rgba(245, 158, 11, 1)' // amber-500
        shadowColor = 'rgba(245, 158, 11, 0.4)'
    }

    return (
        <div className="relative flex flex-col items-center justify-center group" style={{ width: size, height: size }}>
            {/* Ambient Glow */}
            <div
                className="absolute inset-0 rounded-full blur-2xl opacity-20 transition-all duration-1000 group-hover:opacity-40"
                style={{ backgroundColor: shadowColor }}
            />

            <svg
                height={size}
                width={size}
                className="transform -rotate-90 relative z-10"
            >
                {/* Background Ring */}
                <circle
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />

                {/* Score Ring */}
                <circle
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={dashArray}
                    style={{
                        strokeDashoffset,
                        transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)',
                        filter: `drop-shadow(0 0 5px ${shadowColor})`
                    }}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
                <span className="text-2xl font-black tracking-tighter" style={{ textShadow: `0 0 10px ${shadowColor}` }}>
                    {score}
                </span>
                {label && (
                    <span className="text-[8px] uppercase text-gray-400 font-bold tracking-widest mt-0.5 opacity-60">
                        {label}
                    </span>
                )}
            </div>
        </div>
    )
}
