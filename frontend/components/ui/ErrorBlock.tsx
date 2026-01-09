
import React from 'react'
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface ErrorBlockProps {
    message: string
    title?: string
    onRetry?: () => void
    onClose?: () => void
}

export const ErrorBlock = ({ message, title = 'Signal Interrupted', onRetry, onClose }: ErrorBlockProps) => {
    return (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-4 mb-6 animate-shake">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400 shrink-0">
                <ExclamationCircleIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 pt-1">
                <h4 className="text-sm font-bold text-red-200 uppercase tracking-wider mb-1">{title}</h4>
                <p className="text-sm text-red-300/80 font-medium leading-relaxed">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="mt-3 text-xs font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest flex items-center gap-1"
                    >
                        Try to reconnect
                    </button>
                )}
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="p-1 rounded-md text-red-400 hover:bg-red-500/20 transition-all"
                >
                    <XMarkIcon className="w-4 h-4" />
                </button>
            )}
        </div>
    )
}
