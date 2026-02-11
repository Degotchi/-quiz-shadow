import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { type ScoreResult } from '../utils/scoring';
import RadarChart from '../components/RadarChart';
import { POETIC_DIMENSIONS } from '../data/archetypes';
import styles from './ResultScreen.module.css';

export default function ResultScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const [result, setResult] = useState<ScoreResult | null>(null);

    useEffect(() => {
        if (location.state?.result) {
            setResult(location.state.result);
        } else {
            navigate('/');
        }
    }, [location.state, navigate]);

    if (!result) return null;

    const {
        shadowSyncRate,
        primaryArchetype,
        secondaryArchetype,
        normalizedScores,
        isChaos,
        isBarrier
    } = result;

    const handleShare = async () => {
        const shareText = `我的阴影同步率是 ${shadowSyncRate}%。原型：${primaryArchetype.nameCN}。测测你的：`;
        const shareUrl = window.location.origin + '/quiz/shadow/quiz/';
        if (navigator.share) {
            try {
                await navigator.share({
                    title: '暗影自我协议',
                    text: shareText,
                    url: shareUrl,
                });
            } catch (err) {
                console.log('Share cancelled', err);
            }
        } else {
            navigator.clipboard.writeText(shareText + shareUrl);
            alert('结果已复制到剪贴板');
        }
    };

    return (
        <div className={styles.container}>
            {/* Mesh gradient */}
            <div className={styles.bgMesh} />

            {/* 1. Sync Rate Hero */}
            <div className={styles.heroSection}>
                <div className={styles.syncRateLabel}>SHADOW SYNC RATE</div>
                <div className={styles.syncRateValue}>
                    {shadowSyncRate}<span className={styles.syncRateUnit}>%</span>
                </div>
            </div>

            {/* 2. Primary Archetype Card */}
            <div className={styles.archetypeCard}>
                <div className={styles.cardDecoration} />
                <h1 className={styles.archetypeNameCN}>{primaryArchetype.nameCN}</h1>
                <span className={styles.archetypeNameEN}>{primaryArchetype.nameEN}</span>

                <h3 className={styles.sectionTitle}>你的阴影</h3>
                <p className={styles.descriptionText}>{primaryArchetype.shadow}</p>

                <h3 className={styles.sectionTitle}>你的面具</h3>
                <p className={styles.descriptionText}>{primaryArchetype.mask}</p>

                <h3 className={styles.sectionTitle}>触发条件</h3>
                <p className={styles.descriptionText}>{primaryArchetype.trigger}</p>

                <h3 className={styles.sectionTitle}>阴影的诱惑</h3>
                <p className={styles.descriptionText}>{primaryArchetype.temptation}</p>

                <h3 className={styles.sectionTitle}>阴影的诅咒</h3>
                <p className={styles.descriptionText}>{primaryArchetype.curse}</p>
            </div>

            {/* 3. Secondary Archetype (Double Shadow) */}
            {secondaryArchetype && (
                <div className={styles.warningCard}>
                    <div className={styles.warningTitle}>检测到叠影态</div>
                    <h1 className={styles.archetypeNameCN}>{secondaryArchetype.nameCN}</h1>
                    <span className={styles.archetypeNameEN}>{secondaryArchetype.nameEN}</span>
                    <p className={styles.descriptionText}>
                        你的阴影在两种形态之间摇摆。{secondaryArchetype.shadow}
                    </p>
                </div>
            )}

            {/* 4. Special States */}
            {isChaos && (
                <div className={styles.warningCard}>
                    <div className={styles.warningTitle}>混沌态确认</div>
                    <p className={styles.descriptionText}>
                        你的六维特征高度均匀，系统无法捕捉主导倾向。你可能是最接近"真实人性"的人，也可能是最迷失的人。
                    </p>
                </div>
            )}

            {isBarrier && (
                <div className={styles.warningCard}>
                    <div className={styles.warningTitle}>阴影屏障</div>
                    <p className={styles.descriptionText}>
                        你的面具太厚了，系统无法穿透。建议放下防御重测。
                    </p>
                </div>
            )}

            {/* 4.5. Shadow Diary (AI Generated) */}
            {result.shadowDiary && (
                <div className={styles.shadowDiary}>
                    <div className={styles.diaryHeader}>
                        <span className={styles.diaryIcon}>◈</span>
                        阴影日记 · Shadow Diary
                    </div>
                    <div className={styles.diaryContent}>
                        {result.shadowDiary}
                    </div>
                    <div className={styles.diaryFooter}>
                        ▸ AI Generated · Based on your shadow pattern
                    </div>
                </div>
            )}

            {/* 5. Radar Chart */}
            <div className={styles.chartSection}>
                <RadarChart data={normalizedScores} size={300} />
            </div>

            {/* 6. Actions */}
            <div className={styles.actionArea}>
                <button className={styles.primaryButton} onClick={handleShare}>
                    分享结果
                </button>
                <button className={styles.secondaryButton} onClick={() => navigate('/result-v2', { state: { result } })}>
                    体验V2版本 🎬
                </button>
                <button className={styles.secondaryButton} onClick={() => navigate('/')}>
                    重新测试
                </button>
            </div>
        </div>
    );
}
