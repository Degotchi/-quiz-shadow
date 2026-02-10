import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QUESTIONS } from '../data/questions';
import styles from './QuizScreen.module.css';

export default function QuizScreen() {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const currentQuestion = QUESTIONS[currentIndex];
    const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

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
                setCurrentIndex((prev) => prev + 1);
                setSelectedOption(null);
                setIsTransitioning(false);
            } else {
                // Finished
                navigate('/processing', { state: { answers: newAnswers } });
            }
        }, 600);
    }, [currentIndex, answers, isTransitioning, currentQuestion.id, navigate]);

    // Animation variants
    const pageVariants = {
        initial: { opacity: 0, x: 20 },
        in: { opacity: 1, x: 0 },
        out: { opacity: 0, x: -20 },
    };

    const pageTransition = {
        type: 'tween',
        ease: 'anticipate',
        duration: 0.4,
    } as const;

    return (
        <div className={styles.container}>
            {/* Background decoration */}
            <div className={styles.bgDecoration} />

            {/* Progress Bar */}
            <div className={styles.progressBarContainer}>
                <div
                    className={styles.progressBarFill}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Header Info */}
            <div className={styles.header}>
                <span className={styles.stageLabel}>
                    STAGE {currentQuestion.stage} // {currentQuestion.category}
                </span>
                <span className={styles.progressLabel}>
                    {currentIndex + 1} / {QUESTIONS.length}
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
                        <div className={styles.categoryTag}>
                            {currentQuestion.category}
                        </div>
                        <h2 className={styles.scenarioText}>
                            {currentQuestion.scenario}
                        </h2>
                    </motion.div>
                </AnimatePresence>

                <div className={styles.optionsList}>
                    <AnimatePresence mode='wait'>
                        {currentQuestion.options.map((option, idx) => (
                            <motion.button
                                key={`${currentQuestion.id}-${option.label}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    transition: { delay: idx * 0.1 }
                                }}
                                className={`${styles.optionButton} ${selectedOption === option.label ? styles.selected : ''
                                    }`}
                                onClick={() => handleOptionSelect(option.label)}
                                disabled={isTransitioning}
                            >
                                <div className={styles.scanline} />
                                <span className={styles.optionLabel}>{option.label}.</span>
                                <span className={styles.optionText}>{option.text}</span>
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
