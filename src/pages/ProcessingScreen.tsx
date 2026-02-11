import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { calculateResult, type ScoreResult } from '../utils/scoring';
import { generateAIShadowReading } from '../utils/geminiAPI';
import { getFallbackReading } from '../data/fallbackReadings';
import styles from './ProcessingScreen.module.css';

const LOG_MESSAGES = [
    '> Initializing neural link...',
    '> Analyzing response patterns...',
    '> Detecting shadow archetypes...',
    '> Compiling psychological profile...',
    '> Cross-referencing Jungian database...',
    '> Measuring masking density...',
    '> Calibrating emotional suppression index...',
    '> Scanning subconscious patterns...',
    '> Decrypting shadow signal...',
    '> Generating final report...',
];

export default function ProcessingScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [glitchActive, setGlitchActive] = useState(false);
    const logIndexRef = useRef(0);

    useEffect(() => {
        const answers = location.state?.answers;
        if (!answers) {
            navigate('/');
            return;
        }

        // Progress animation
        const startTime = Date.now();
        const duration = 4000;

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / duration) * 100, 100);

            setProgress(newProgress);

            // Add logs sequentially
            const logTarget = Math.floor((newProgress / 100) * LOG_MESSAGES.length);
            if (logIndexRef.current < logTarget && logIndexRef.current < LOG_MESSAGES.length) {
                const msg = LOG_MESSAGES[logIndexRef.current];
                logIndexRef.current += 1;
                setLogs(prev => [...prev.slice(-6), msg]);
            }

            // Random glitch bursts
            if (Math.random() > 0.95) {
                setGlitchActive(true);
                setTimeout(() => setGlitchActive(false), 150);
            }

            if (newProgress >= 100) {
                clearInterval(interval);

                // Calculate result
                const result: ScoreResult = calculateResult(answers);

                // Generate AI shadow reading via Gemini API (8秒超时)
                generateAIShadowReading(
                    {
                        nameCN: result.primaryArchetype.nameCN,
                        nameEN: result.primaryArchetype.nameEN,
                        mask: result.primaryArchetype.mask,
                        shadow: result.primaryArchetype.shadow,
                        trigger: result.primaryArchetype.trigger,
                        temptation: result.primaryArchetype.temptation,
                        curse: result.primaryArchetype.curse,
                    },
                    result.normalizedScores,
                    8000  // 8秒超时
                )
                .then(aiReading => {
                    if (aiReading) {
                        // API调用成功，使用AI生成的解读
                        result.shadowDiary = aiReading;
                        console.log('✅ AI reading generated successfully');
                    } else {
                        // API调用失败或超时，使用预制备用数据
                        result.shadowDiary = getFallbackReading(result.primaryArchetype.id);
                        console.warn('⚠️ Using fallback reading');
                    }
                })
                .catch(err => {
                    // 异常情况，使用备用数据
                    console.error('❌ AI reading error:', err);
                    result.shadowDiary = getFallbackReading(result.primaryArchetype.id);
                })
                .finally(() => {
                    // 无论成功或失败，600ms后跳转结果页
                    setTimeout(() => {
                        navigate('/result-v2', { state: { result } });
                    }, 600);
                });
            }
        }, 50);

        return () => clearInterval(interval);
    }, [location.state, navigate]);

    return (
        <div className={`${styles.container} ${glitchActive ? styles.glitchBurst : ''}`}>
            {/* Mesh gradient */}
            <div className={styles.bgMesh} />

            {/* Scan line */}
            <div className={styles.scanLine} />

            {/* Terminal output */}
            <div className={styles.terminalOutput}>
                {logs.map((log, i) => (
                    <div
                        key={i}
                        className={styles.line}
                        style={{ opacity: 0.4 + (i / logs.length) * 0.6 }}
                    >
                        {log}
                    </div>
                ))}
                <div className={styles.line}>
                    <span className={styles.highlight}>_PROCESSING...</span>
                    <span className={styles.cursor} />
                </div>
            </div>

            {/* Progress bar */}
            <div className={styles.progressContainer}>
                <div
                    className={styles.progressBar}
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className={styles.percentage}>
                {Math.round(progress)}%
            </div>

            <div className={styles.statusText}>
                SHADOW PROTOCOL ACTIVE
            </div>
        </div>
    );
}
