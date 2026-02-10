import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { calculateResult, type ScoreResult } from '../utils/scoring';
import styles from './ProcessingScreen.module.css';

const LOG_MESSAGES = [
    'Initializing neural link...',
    'Analyzing response patterns...',
    'Detecting shadow archetypes...',
    'Compiling psychological profile...',
    'Cross-referencing Jungian database...',
    'Measuring masking density...',
    'Calibrating emotional suppression index...',
    'Generating final report...',
];

export default function ProcessingScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const answers = location.state?.answers;
        if (!answers) {
            navigate('/');
            return;
        }

        // Progress animation
        const startTime = Date.now();
        const duration = 3500; // 3.5s total time

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / duration) * 100, 100);

            setProgress(newProgress);

            // Add random logs
            if (Math.random() > 0.85 && logs.length < LOG_MESSAGES.length) {
                const msg = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
                setLogs(prev => [...prev.slice(-5), `> ${msg}`]);
            }

            if (newProgress >= 100) {
                clearInterval(interval);

                // Calculate and navigate
                const result: ScoreResult = calculateResult(answers);
                setTimeout(() => {
                    navigate('/result', { state: { result } });
                }, 500);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [location.state, navigate, logs.length]);

    return (
        <div className={styles.container}>
            <div className={styles.scanLine}></div>

            <div className={styles.terminalOutput}>
                {logs.map((log, i) => (
                    <div key={i} className={styles.line}>{log}</div>
                ))}
                <div className={styles.line}>
                    <span className={styles.highlight}>_PROCESSING...</span>
                </div>
            </div>

            <div className={styles.progressContainer}>
                <div
                    className={styles.progressBar}
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className={styles.percentage}>
                {Math.round(progress)}%
            </div>
        </div>
    );
}
