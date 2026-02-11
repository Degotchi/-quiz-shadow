import { useMemo } from 'react';
import { type DimensionKey, DIMENSIONS } from '../data/archetypes';

interface RadarChartProps {
    data: Record<DimensionKey, number>;
    size?: number;
}

export default function RadarChart({ data, size = 300 }: RadarChartProps) {
    const center = size / 2;
    const radius = (size / 2) - 60; // 增加padding从40到60
    const dimensions = Object.keys(DIMENSIONS) as DimensionKey[];
    const total = dimensions.length;

    const getPoint = (value: number, index: number, max: number) => {
        const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
        const r = (value / max) * radius;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return { x, y, angle };
    };

    // 根据角度智能计算text-anchor
    const getTextAnchor = (angle: number): "start" | "middle" | "end" => {
        const degrees = ((angle + Math.PI / 2) * 180 / Math.PI + 360) % 360;
        if (degrees > 45 && degrees < 135) return "start";
        if (degrees > 225 && degrees < 315) return "end";
        return "middle";
    };

    const points = useMemo(() => {
        return dimensions.map((dim, i) => {
            return getPoint(data[dim], i, 100);
        }).map(p => `${p.x},${p.y}`).join(' ');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const gridPoints = useMemo(() => {
        return [25, 50, 75, 100].map(level => {
            return dimensions.map((_, i) => {
                const p = getPoint(level, i, 100);
                return `${p.x},${p.y}`;
            }).join(' ');
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Data points for glow dots
    const dataPoints = useMemo(() => {
        return dimensions.map((dim, i) => getPoint(data[dim], i, 100));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Defs for gradients and filters */}
            <defs>
                <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(138, 43, 226, 0.15)" />
                    <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <linearGradient id="dataFill" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(138, 43, 226, 0.35)" />
                    <stop offset="100%" stopColor="rgba(160, 20, 50, 0.25)" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                {/* 文字背景滤镜 */}
                <filter id="textBg" x="-0.3" y="-0.3" width="1.6" height="1.6">
                    <feFlood floodColor="rgba(6, 6, 12, 0.8)" />
                    <feComposite in="SourceGraphic" operator="over" />
                </filter>
            </defs>

            {/* Background glow */}
            <circle cx={center} cy={center} r={radius + 10} fill="url(#radarGlow)" />

            {/* Grid */}
            {gridPoints.map((pts, i) => (
                <polygon
                    key={i}
                    points={pts}
                    fill="none"
                    stroke={`rgba(138, 43, 226, ${0.08 + i * 0.04})`}
                    strokeWidth="0.5"
                />
            ))}

            {/* Axes */}
            {dimensions.map((dim, i) => {
                const p = getPoint(100, i, 100);
                return (
                    <line
                        key={dim}
                        x1={center} y1={center}
                        x2={p.x} y2={p.y}
                        stroke="rgba(138, 43, 226, 0.12)"
                        strokeWidth="0.5"
                    />
                );
            })}

            {/* Data Area */}
            <polygon
                points={points}
                fill="url(#dataFill)"
                stroke="rgba(138, 43, 226, 0.7)"
                strokeWidth="1.5"
                filter="url(#glow)"
            />

            {/* Data points glow dots */}
            {dataPoints.map((p, i) => (
                <g key={dimensions[i]}>
                    <circle
                        cx={p.x} cy={p.y} r="4"
                        fill="rgba(138, 43, 226, 0.3)"
                    />
                    <circle
                        cx={p.x} cy={p.y} r="2"
                        fill="#8A2BE2"
                    />
                </g>
            ))}

            {/* Labels with smart positioning */}
            {dimensions.map((dim, i) => {
                const labelPoint = getPoint(135, i, 100); // 标签距离更远
                const valuePoint = getPoint(85, i, 100);  // 数值显示在内侧
                const anchor = getTextAnchor(labelPoint.angle);

                return (
                    <g key={dim}>
                        {/* 维度标签背景 */}
                        <rect
                            x={labelPoint.x - (anchor === 'middle' ? 30 : anchor === 'start' ? 0 : 60)}
                            y={labelPoint.y - 10}
                            width="60"
                            height="20"
                            rx="3"
                            fill="rgba(6, 6, 12, 0.7)"
                            opacity="0.9"
                        />

                        {/* 维度标签文字 */}
                        <text
                            x={labelPoint.x}
                            y={labelPoint.y}
                            textAnchor={anchor}
                            dominantBaseline="middle"
                            fill="rgba(255, 255, 255, 0.95)"
                            fontSize="13"
                            fontWeight="700"
                            fontFamily="var(--font-mono), monospace"
                            letterSpacing="0.5"
                        >
                            {DIMENSIONS[dim].cn}
                        </text>

                        {/* 数值标签（内侧显示，更小更精致） */}
                        <text
                            x={valuePoint.x}
                            y={valuePoint.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="rgba(255, 255, 255, 0.9)"
                            fontSize="12"
                            fontWeight="700"
                            fontFamily="var(--font-mono), monospace"
                            style={{
                                textShadow: '0 0 8px rgba(138, 43, 226, 0.8), 0 0 4px rgba(0, 0, 0, 1)'
                            }}
                        >
                            {data[dim]}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}
