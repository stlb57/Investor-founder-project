
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/ThemeProvider'
import { useState, useEffect } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const router = useRouter()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const isActive = (path: string) => router.pathname === path

    const navItems = user?.role === 'investor'
        ? [
            { label: 'Dashboard', path: '/investor/dashboard' },
            { label: 'Timeline', path: '/investor/timeline' },
            { label: 'Insights', path: '/insights' },
            { label: 'Pricing', path: '/pricing' },
            { label: 'Introductions', path: '/investor/intros' },
        ]
        : [
            { label: 'Dashboard', path: '/startup/dashboard' },
            { label: 'Timeline', path: '/startup/timeline' },
            { label: 'Insights', path: '/insights' },
            { label: 'Pricing', path: '/pricing' },
            { label: 'Introductions', path: '/startup/intros' },
        ]

    return (
        <nav className="glass sticky top-0 z-50 border-b border-slate-200/50 dark:border-white/5">
            <div className="container-custom">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center group">
                        <div className="relative h-12 w-40">
                            {mounted && (
                                <Image
                                    src={theme === 'dark' ? '/logo_dark.png' : '/logo.png'}
                                    alt="ScaleX Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            )}
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-white ${isActive(item.path)
                                    ? 'text-primary-600 dark:text-white border-b-2 border-primary-500 pb-1'
                                    : 'text-slate-600 dark:text-slate-400'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        {mounted && (
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-white transition-all border border-slate-200 dark:border-white/10"
                                aria-label="Toggle Theme"
                            >
                                {theme === 'dark' ? (
                                    <SunIcon className="w-5 h-5" />
                                ) : (
                                    <MoonIcon className="w-5 h-5" />
                                )}
                            </button>
                        )}
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                {user?.email}
                            </div>
                            <button
                                onClick={logout}
                                className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-white transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden glass border-t border-white/10 py-4">
                    <div className="container-custom flex flex-col gap-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`text-sm font-medium px-4 py-2 ${isActive(item.path)
                                    ? 'text-primary-600 dark:text-white bg-primary-50 dark:bg-white/5 rounded-xl'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-white'
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="border-t border-slate-200 dark:border-white/10 pt-4 mt-2">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <span className="text-sm text-slate-600 dark:text-slate-400">{user?.email}</span>
                                {mounted && (
                                    <button
                                        onClick={toggleTheme}
                                        className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400"
                                    >
                                        {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={logout}
                                className="text-sm font-medium text-red-500 hover:text-red-400 px-2"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
