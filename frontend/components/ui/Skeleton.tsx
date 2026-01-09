
import React from 'react'

interface SkeletonProps {
    className?: string
}

export const Skeleton = ({ className = '' }: SkeletonProps) => {
    return (
        <div className={`animate-pulse bg-slate-200 dark:bg-white/5 rounded-md ${className}`} />
    )
}

export const CardSkeleton = () => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-1/6" />
        </div>
        <Skeleton className="h-20 w-full" />
        <div className="flex gap-4">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
        </div>
    </div>
)
