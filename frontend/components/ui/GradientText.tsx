
import React from 'react'

interface GradientTextProps {
    children: React.ReactNode
    className?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export const GradientText = ({ children, className = '', size = 'md' }: GradientTextProps) => {
    return (
        <span className={`bg-clip-text text-transparent bg-gradient-to-r from-primary-700 via-primary-500 to-emerald-400 dark:from-white dark:via-primary-300 dark:to-primary-500 font-bold ${className}`}>
            {children}
        </span>
    )
}
