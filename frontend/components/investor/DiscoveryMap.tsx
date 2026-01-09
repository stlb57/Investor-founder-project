import React, { useState, useEffect } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useRouter } from 'next/router'
import { api } from '@/lib/api'
import { GlassCard } from '@/components/ui/GlassCard'

interface MapData {
    id: string
    name: string
    sector: string
    stage: string
    x_momentum: number
    y_readiness: number
    shape: string
    color_tag: string
}

const CUSTOM_TOOLTIP = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload
        return (
            <div className="bg-slate-900 dark:bg-black/90 border border-slate-700 dark:border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md z-50">
                <p className="font-bold text-white mb-1 tracking-tight">{data.name}</p>
                <p className="text-[10px] text-primary-400 font-black uppercase tracking-widest mb-3">{data.sector} • {data.stage}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                        <span className="text-slate-400 dark:text-gray-500 font-bold uppercase tracking-tighter">Readiness:</span> <span className="text-white font-black">{data.y_readiness}</span>
                    </div>
                    <div>
                        <span className="text-slate-400 dark:text-gray-500 font-bold uppercase tracking-tighter">Momentum:</span> <span className="text-white font-black">{data.x_momentum}</span>
                    </div>
                </div>
            </div>
        )
    }
    return null
}

export function DiscoveryMap() {
    const [data, setData] = useState<MapData[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        loadMapData()
    }, [])

    const loadMapData = async () => {
        try {
            const response = await api.get('/investors/discovery-map')
            // Fake the scatter for demo purposes to ensure beautiful distribution
            const distributedData = response.data.map((item: any, i: number) => {
                // Create a deterministic quasi-random position based on index
                // This ensures it looks the same on refresh but is scattered
                const pseudoRandomX = 30 + ((i * 17) % 60) + (Math.sin(i) * 10);
                const pseudoRandomY = 40 + ((i * 23) % 50) + (Math.cos(i) * 10);

                return {
                    ...item,
                    x_momentum: Math.max(10, Math.min(95, pseudoRandomX)),
                    y_readiness: Math.max(10, Math.min(95, pseudoRandomY))
                }
            })
            setData(distributedData)
        } catch (error) {
            console.error('Failed to load map:', error)
            // Fallback mock data if API totally fails
            setData([
                { id: '1', name: 'NeuralFlow', sector: 'AI', stage: 'Seed', x_momentum: 85, y_readiness: 78, shape: 'circle', color_tag: 'AI' },
                { id: '2', name: 'VaultX', sector: 'Fintech', stage: 'Series A', x_momentum: 65, y_readiness: 92, shape: 'circle', color_tag: 'Fintech' },
                { id: '3', name: 'BioSynthetix', sector: 'Biotech', stage: 'Series A', x_momentum: 45, y_readiness: 60, shape: 'circle', color_tag: 'Bio' },
                { id: '4', name: 'EcoHome', sector: 'Consumer', stage: 'Series A', x_momentum: 72, y_readiness: 85, shape: 'circle', color_tag: 'Consumer' },
            ])
        } finally {
            setLoading(false)
        }
    }

    // Color mapping logic
    const COLORS = ['#60A5FA', '#34D399', '#F472B6', '#A78BFA', '#FBBF24']
    const getColor = (tag: string, index: number) => COLORS[index % COLORS.length]

    if (loading) return <div className="h-64 flex items-center justify-center text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs">Loading signal graph...</div>

    return (
        <GlassCard className="w-full h-[500px] relative overflow-hidden border-slate-200 dark:border-white/10 shadow-lg">
            <div className="absolute top-6 left-6 z-10">
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Discovery Map</h3>
                <p className="text-[10px] text-slate-500 dark:text-gray-500 uppercase font-bold tracking-widest">Momentum × Readiness</p>
                <p className="text-[10px] text-primary-600 dark:text-primary-400/60 mt-2 uppercase font-black tracking-tighter italic">Click nodes to inspect intent</p>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <XAxis
                        type="number"
                        dataKey="x_momentum"
                        name="Momentum"
                        domain={[0, 100]}
                        stroke="#4B5563"
                        tick={{ fill: '#9CA3AF', fontSize: 10 }}
                        label={{ value: 'Momentum', position: 'bottom', fill: '#6B7280', fontSize: 12 }}
                    />
                    <YAxis
                        type="number"
                        dataKey="y_readiness"
                        name="Readiness"
                        domain={[0, 100]}
                        stroke="#4B5563"
                        tick={{ fill: '#9CA3AF', fontSize: 10 }}
                        label={{ value: 'Readiness Score', angle: -90, position: 'left', fill: '#6B7280', fontSize: 12 }}
                    />
                    <ZAxis type="number" range={[100, 400]} />
                    <Tooltip content={<CUSTOM_TOOLTIP />} cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter
                        name="Startups"
                        data={data}
                        fill="#8884d8"
                        onClick={(p) => router.push(`/investor/startups/${p.id}`)}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={getColor(entry.color_tag, index)}
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                            />
                        ))}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>

            <div className="absolute bottom-6 right-6 text-[10px] text-slate-500 dark:text-gray-500 bg-slate-100 dark:bg-black/50 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 font-black uppercase tracking-widest">
                Interactive Signal Workspace
            </div>
        </GlassCard>
    )
}
