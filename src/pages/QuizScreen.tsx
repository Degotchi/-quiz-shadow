import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QUESTIONS } from '../data/questions';
import styles from './QuizScreen.module.css';

// Pseudo-science data messages that rotate
const PSEUDO_DATA = [
    'Dopamine_Scan',
    'Self_Defense_Bypass',
    'Cortisol_Level',
    'Shadow_Depth',
    'Mask_Integrity',
    'Neural_Pattern',
];

export default function QuizScreen() {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [direction, setDirection] = useState(1);
    const optionKeyRef = useRef(0);

    // Pseudo-science data state
    const [pseudoValues, setPseudoValues] = useState<Record<string, number>>({});
    const [activeStatus, setActiveStatus] = useState<string>('SCANNING');

    const currentQuestion = QUESTIONS[currentIndex];
    const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

    // Stage-based background color class
    const getStageClass = () => {
        if (currentQuestion.stage === 1) return styles.stageCool; // Q1-10: 暗蓝
        if (currentQuestion.stage === 2) return styles.stageMid;  // Q11-20: 深紫
        return styles.stageHot; // Q21-30: 暗红
    };

    // Initialize and update pseudo-science data
    useEffect(() => {
        // Initial random values
        const initial: Record<string, number> = {};
        PSEUDO_DATA.forEach(key => {
            initial[key] = Math.floor(Math.random() * 60) + 20; // 20-79
        });
        setPseudoValues(initial);

        // Update values on every question
        const updateInterval = setInterval(() => {
            setPseudoValues(prev => {
                const updated = { ...prev };
                const key = PSEUDO_DATA[Math.floor(Math.random() * PSEUDO_DATA.length)];
                updated[key] = Math.min(99, Math.max(1, updated[key] + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 10)));
                return updated;
            });
        }, 2000);

        // Rotate status
        const statusOptions = ['SCANNING', 'ACTIVE', 'ANALYZING', 'PROBING'];
        const statusInterval = setInterval(() => {
            setActiveStatus(statusOptions[Math.floor(Math.random() * statusOptions.length)]);
        }, 3000);

        return () => {
            clearInterval(updateInterval);
            clearInterval(statusInterval);
        };
    }, [currentIndex]);

    const handleOptionSelect = useCallback((label: string) => {
        if (isTransitioning) return;

        setSelectedOption(label);
        setIsTransitioning(true);

        // Record answer
        const newAnswers = { ...answers, [currentQuestion.id]: label };
        setAnswers(newAnswers);

        // Delay before next question
        setTimeout(() => {
            if (currentIndex < QUESTIONS.length - 1) {
                setDirection(1);
                setCurrentIndex((prev) => prev + 1);
                setSelectedOption(null);
                setIsTransitioning(false);
                optionKeyRef.current += 1;
            } else {
                // Finished
                navigate('/processing', { state: { answers: newAnswers } });
            }
        }, 700);
    }, [currentIndex, answers, isTransitioning, currentQuestion.id, navigate]);

    // Animation variants
    const pageVariants = {
        initial: { opacity: 0, x: direction * 30, filter: 'blur(4px)' },
        in: { opacity: 1, x: 0, filter: 'blur(0px)' },
        out: { opacity: 0, x: direction * -30, filter: 'blur(4px)' },
    };

    const pageTransition = {
        type: 'tween',
        ease: 'anticipate',
        duration: 0.45,
    } as const;

    // Stage label mapping
    const stageLabels = ['低强度 · 试探', '中强度 · 深入', '高强度 · 深水区'];
    const stageLabel = stageLabels[(currentQuestion.stage - 1)] || '';

    return (
        <div className={`${styles.container} ${getStageClass()}`}>
            {/* Stage-based mesh gradient background */}
            <div className={styles.bgMesh} />

            {/* Breathing border */}
            <div className={styles.breathingBorder} />

            {/* Progress Bar */}
            <div className={styles.progressBarContainer}>
                <div
                    className={styles.progressBarFill}
                    style={{ width: `${progress}%` }}
                />
                <div
                    className={styles.progressGlow}
                    style={{ left: `${progress}%` }}
                />
            </div>

            {/* Pseudo-science data ticker */}
            <div className={styles.dataTicker}>
                {PSEUDO_DATA.slice(0, 3).map((key) => (
                    <span key={key} className={styles.dataItem}>
                        {key}: <span className={styles.dataValue}>{pseudoValues[key] || 0}%</span>
                    </span>
                ))}
                <span className={styles.dataStatus}>
                    Status: <span className={styles.dataStatusValue}>{activeStatus}</span>
                </span>
            </div>

            {/* Header Info */}
            <div className={styles.header}>
                <span className={styles.stageLabel}>
                    STAGE {currentQuestion.stage} — {stageLabel}
                </span>
            </div>

            {/* Question Content */}
            <div className={styles.content}>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentQuestion.id}
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                        className={styles.questionCard}
                    >
                        <div className={styles.cardHeader}>
                            <div className={styles.categoryTag}>
                                {currentQuestion.category}
                            </div>
                            <div className={styles.questionProgress}>
                                {String(currentIndex + 1).padStart(2, '0')}/{QUESTIONS.length}
                            </div>
                        </div>
                        <h2 className={styles.scenarioText}>
                            {currentQuestion.scenario}
                        </h2>
                    </motion.div>
                </AnimatePresence>

                <div className={styles.optionsList}>
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={`opts-${currentQuestion.id}-${optionKeyRef.current}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={styles.optionsInner}
                        >
                            {currentQuestion.options.map((option, idx) => {
                                const isSelected = selectedOption === option.label;
                                const isOther = selectedOption !== null && !isSelected;
                                return (
                                    <motion.button
                                        key={`${currentQuestion.id}-${option.label}-${optionKeyRef.current}`}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{
                                            opacity: isOther ? 0.3 : 1,
                                            y: 0,
                                            scale: isOther ? 0.97 : 1,
                                            transition: { delay: idx * 0.08, duration: 0.3 }
                                        }}
                                        className={`${styles.optionButton} ${isSelected ? styles.selected : ''} ${isOther ? styles.dismissed : ''}`}
                                        onClick={() => handleOptionSelect(option.label)}
                                        disabled={isTransitioning}
                                        type="button"
                                    >
                                        <div className={styles.optionGlow} />
                                        <span className={styles.optionLabel}>{option.label}.</span>
                                        <span className={styles.optionText}>{option.text}</span>
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
