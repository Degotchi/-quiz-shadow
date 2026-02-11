import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { type ScoreResult } from '../utils/scoring';
import BarChart from '../components/BarChart';
import { getArchetypeTheme } from '../utils/archetypeThemes';
import styles from './ResultScreenV2.module.css';

export default function ResultScreenV2() {
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
        normalizedScores,
    } = result;

    // 获取当前原型的主题色
    const currentTheme = getArchetypeTheme(primaryArchetype.id);

    // 获取原型图像（霓虹塔罗牌风格 - WebP优化）
    const getArchetypeImage = () => {
        try {
            // WebP路径（优先使用，85%体积压缩）
            const webpPath = new URL(
                `../assets/archetypes/${primaryArchetype.id}.webp`,
                import.meta.url
            ).href;

            // PNG路径（降级方案）
            const pngPath = new URL(
                `../assets/archetypes/${primaryArchetype.id}.png`,
                import.meta.url
            ).href;

            return (
                <picture>
                    {/* 优先加载WebP格式（节省85%带宽） */}
                    <source srcSet={webpPath} type="image/webp" />
                    {/* PNG降级方案（兼容旧浏览器） */}
                    <img
                        src={pngPath}
                        alt={primaryArchetype.nameCN}
                        className={styles.heroImage}
                        loading="eager"
                    />
                </picture>
            );
        } catch (error) {
            // 降级到渐变占位符
            console.warn('Failed to load archetype image:', error);
            return (
                <div className={styles.placeholderImage}>
                    <div className={styles.placeholderText}>
                        <h1>{primaryArchetype.nameCN}</h1>
                        <span>{primaryArchetype.nameEN}</span>
                    </div>
                </div>
            );
        }
    };

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

    // 六维信息卡片分层数据
    const cardSections = [
        {
            title: "SURFACE LAYER · 表象层",
            cards: [
                { label: "你的面具", content: primaryArchetype.mask, theme: "cold" },
                { label: "你的阴影", content: primaryArchetype.shadow, theme: "cold" },
                { label: "触发条件", content: primaryArchetype.trigger, theme: "cold" }
            ]
        },
        {
            title: "SOUL LAYER · 灵魂层",
            cards: [
                { label: "阴影的诱惑", content: primaryArchetype.temptation, theme: "warm" },
                { label: "阴影的诅咒", content: primaryArchetype.curse, theme: "warm" },
                { label: "AI深度解读", content: result.shadowDiary || "系统解析中...", theme: "ai-special" }
            ]
        }
    ];

    return (
        <div
            className={styles.container}
            style={{
                '--theme-primary': currentTheme.primary,
                '--theme-secondary': currentTheme.secondary,
                '--theme-glow': currentTheme.glow,
            } as React.CSSProperties}
        >
            {/* Background Mesh */}
            <div className={styles.bgMesh} />

            {/* 1. 顶部"破格"人物区域 */}
            <div className={styles.heroImageSection}>
                {/* 渐变遮罩 */}
                <div className={styles.heroGradientMask} />

                {/* 原型塔罗牌图像 */}
                {getArchetypeImage()}

                {/* 浮动同步率指示器 */}
                <div className={styles.floatingSyncRate}>
                    <div className={styles.syncRateNumber}>{shadowSyncRate}<span>%</span></div>
                    <div className={styles.syncRateLabel}>SHADOW SYNC</div>
                </div>

                {/* 原型名称悬浮标签 */}
                <div className={styles.archetypeTitle}>
                    <h1>{primaryArchetype.nameCN}</h1>
                    <span>{primaryArchetype.nameEN}</span>
                </div>
            </div>

            {/* 2. 六维信息卡片区域（分层渲染） */}
            <div className={styles.cardsContainer}>
                {cardSections.map((section, sectionIdx) => (
                    <div key={sectionIdx} className={styles.cardSection}>
                        <div className={styles.sectionHeader}>{section.title}</div>
                        <div className={styles.cardGrid}>
                            {section.cards.map((card, cardIdx) => (
                                <div
                                    key={cardIdx}
                                    className={`${styles.infoCard} ${
                                        card.theme === 'cold' ? styles.cardCold :
                                        card.theme === 'warm' ? styles.cardWarm :
                                        styles.cardAI
                                    }`}
                                >
                                    <div className={styles.cardLabel}>{card.label}</div>
                                    <div className={styles.cardContent}>{card.content}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. 数据可视化区域 */}
            <div className={styles.chartSection}>
                <div className={styles.chartHeader}>数据分析</div>
                <BarChart data={normalizedScores} />
            </div>

            {/* 4. 底部操作按钮 */}
            <div className={styles.actionArea}>
                <button className={styles.primaryButton} onClick={handleShare}>
                    分享结果
                </button>
            </div>
        </div>
    );
}
