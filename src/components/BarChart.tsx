import { type DimensionKey, DIMENSIONS } from '../data/archetypes';
import styles from './BarChart.module.css';

interface BarChartProps {
    data: Record<DimensionKey, number>;
}

export default function BarChart({ data }: BarChartProps) {
    const dimensions = Object.keys(DIMENSIONS) as DimensionKey[];

    return (
        <div className={styles.container}>
            {dimensions.map((dim) => {
                const value = data[dim];
                const dimension = DIMENSIONS[dim];

                return (
                    <div key={dim} className={styles.barRow}>
                        <div className={styles.labelArea}>
                            <span className={styles.labelCN}>{dimension.cn}</span>
                            <span className={styles.labelEN}>{dimension.en}</span>
                        </div>

                        <div className={styles.barTrack}>
                            <div
                                className={styles.barFill}
                                style={{ width: `${value}%` }}
                            >
                                <div className={styles.barGlow} />
                            </div>
                        </div>

                        <div className={styles.valueLabel}>
                            {value}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
