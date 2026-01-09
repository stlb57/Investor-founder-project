
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    isLoading?: boolean
    icon?: React.ReactNode
}

export const Button = ({
    children,
    variant = 'primary',
    isLoading = false,
    icon,
    className = '',
    ...props
}: ButtonProps) => {
    const baseStyles = "relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"

    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-500 hover:shadow-[0_0_20px_#10b98166]",
        secondary: "glass text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white",
        danger: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20",
        ghost: "text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
    }

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {icon && <span className="w-5 h-5">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    )
}
