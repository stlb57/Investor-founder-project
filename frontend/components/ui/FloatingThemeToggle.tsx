import React, { useEffect, useState } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useTheme } from '@/lib/ThemeProvider'

export const FloatingThemeToggle = () => {
    const { theme, toggleTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <button
            onClick={toggleTheme}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl glass shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group border-primary-500/30"
            aria-label="Toggle Theme"
        >
            <div className="relative w-6 h-6">
                {theme === 'light' ? (
                    <MoonIcon className="w-6 h-6 text-primary-600 transition-all duration-300 rotate-0 scale-100" />
                ) : (
                    <SunIcon className="w-6 h-6 text-primary-400 transition-all duration-300 rotate-0 scale-100" />
                )}
            </div>

            {/* Tooltip */}
            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-white/10">
                Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
            </span>
        </button>
    )
}
