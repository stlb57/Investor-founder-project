
import React from 'react'
import Head from 'next/head'
import Navbar from './Navbar'
import { FloatingThemeToggle } from './ui/FloatingThemeToggle'

interface LayoutProps {
    children: React.ReactNode
    title?: string
    checkAuth?: boolean
}

export default function Layout({ children, title = 'ScaleX', checkAuth = true }: LayoutProps) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <div className="min-h-screen flex flex-col">
                {checkAuth && <Navbar />}
                <main className="flex-grow">
                    {children}
                </main>
                <FloatingThemeToggle />
            </div>
        </>
    )
}
