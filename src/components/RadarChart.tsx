import { useMemo } from 'react';
import { type DimensionKey, DIMENSIONS } from '../data/archetypes';

interface RadarChartProps {
    data: Record<DimensionKey, number>;
    size?: number;
}

export default function RadarChart({ data, size = 300 }: RadarChartProps) {
    const center = size / 2;
    const radius = (size / 2) - 40; // padding
    const dimensions = Object.keys(DIMENSIONS) as DimensionKey[];
    const total = dimensions.length;

    const getPoint = (value: number, index: number, max: number) => {
        const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
        const r = (value / max) * radius;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return { x, y };
    };

    const points = useMemo(() => {
        return dimensions.map((dim, i) => {
            return getPoint(data[dim], i, 100);
        }).map(p => `${p.x},${p.y}`).join(' ');
    }, [data, dimensions, radius, center, total]);

    const gridPoints = useMemo(() => {
        return [25, 50, 75, 100].map(level => {
            return dimensions.map((_, i) => {
                const p = getPoint(level, i, 100);
                return `${p.x},${p.y}`;
            }).join(' ');
        });
    }, [dimensions, radius, center, total]);

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Grid */}
            {gridPoints.map((points, i) => (
                <polygon
                    key={i}
                    points={points}
                    fill="none"
                    stroke="rgba(57, 255, 20, 0.2)"
                    strokeWidth="1"
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
                        stroke="rgba(57, 255, 20, 0.2)"
                        strokeWidth="1"
                    />
                );
            })}

            {/* Data Area */}
            <polygon
                points={points}
                fill="rgba(138, 43, 226, 0.4)"
                stroke="#8A2BE2"
                strokeWidth="2"
            />

            {/* Labels */}
            {dimensions.map((dim, i) => {
                const p = getPoint(120, i, 100); // Push labels out
                return (
                    <text
                        key={dim}
                        x={p.x}
                        y={p.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#fff"
                        fontSize="10"
                        fontFamily="monospace"
                    >
                        {DIMENSIONS[dim].cn}
                    </text>
                );
            })}
        </svg>
    );
}
