
import React from 'react'

interface GlassCardProps {
    children: React.ReactNode
    className?: string
    hoverEffect?: boolean
    delay?: string
    style?: React.CSSProperties
}

export const GlassCard = ({ children, className = '', hoverEffect = true, delay = '0s', style }: GlassCardProps) => {
    return (
        <div
            className={`
        glass p-6 rounded-2xl border border-white/10
        ${hoverEffect ? 'transition-all duration-300 hover:bg-white/10 hover:shadow-2xl hover:border-white/20 hover:-translate-y-1' : ''}
        animate-slide-up
        ${className}
      `}
            style={{ animationDelay: delay, ...style }}
        >
            {children}
        </div>
    )
}
