import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import styles from './StartScreen.module.css';
import CodeInputModal from '../components/CodeInputModal';

const TERMINAL_MESSAGES = [
  '> 正在扫描神经链路...',
  '> 检测到人格面具覆盖率 97.8%',
  '> 阴影信号源已锁定...',
  '> 准备启动深层扫描协议',
];

const TYPE_SPEED = 45;     // ms per character
const LINE_PAUSE = 600;    // pause between lines

export default function StartScreen() {
  const navigate = useNavigate();

  // ── CDKEY Modal state ──
  const [showCodeModal, setShowCodeModal] = useState(false);

  // ── Terminal typewriter state ──
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    if (lineIndex >= TERMINAL_MESSAGES.length) {
      setTyping(false);
      return;
    }

    const currentMsg = TERMINAL_MESSAGES[lineIndex];

    if (charIndex < currentMsg.length) {
      const timer = setTimeout(() => {
        setLines((prev) => {
          const updated = [...prev];
          updated[lineIndex] = currentMsg.slice(0, charIndex + 1);
          return updated;
        });
        setCharIndex((c) => c + 1);
      }, TYPE_SPEED);
      return () => clearTimeout(timer);
    } else {
      // Line finished, pause then move to next
      const timer = setTimeout(() => {
        setLineIndex((l) => l + 1);
        setCharIndex(0);
        setLines((prev) => [...prev, '']);
      }, LINE_PAUSE);
      return () => clearTimeout(timer);
    }
  }, [lineIndex, charIndex]);

  // ── CTA shake + modal ──
  const [shaking, setShaking] = useState(false);

  const handleStart = useCallback(() => {
    if (shaking) return;
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
      setShowCodeModal(true);
    }, 200);
  }, [shaking]);

  return (
    <div className={styles.container}>
      {/* Mesh gradient background */}
      <div className={styles.bgGradient} />

      {/* SVG noise grain overlay */}
      <div className={styles.noiseOverlay}>
        <svg xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* CRT scanline overlay */}
      <div className={styles.scanlineOverlay} />

      {/* Breathing border */}
      <div className={styles.breathingBorder} />

      {/* ── Main content ── */}
      <div className={styles.content}>
        {/* 1. Terminal Status Bar */}
        <div className={styles.terminal}>
          {lines.map((line, i) => (
            <div key={i} className={styles.terminalLine}>
              {line}
              {typing && i === lineIndex && <span className={styles.cursor} />}
            </div>
          ))}
          {!typing && <span className={styles.cursor} />}
        </div>

        {/* 2. Hero Area */}
        <div className={styles.hero}>
          <div className={styles.titleWrapper} data-text="「暗影自我协议」">
            <span className={styles.title}>「暗影自我协议」</span>
          </div>
          <div className={styles.subtitle}>THE SHADOW SELF PROTOCOL</div>
          <div className={styles.slogan}>「你压抑了多少，阴影就有多深。」</div>
        </div>

        {/* 3. CTA Button */}
        <div className={styles.ctaArea}>
          <button
            className={`${styles.ctaButton} ${shaking ? styles.ctaButtonShake : ''}`}
            onClick={handleStart}
          >
            启动扫描
          </button>
          <div className={styles.warning}>⚠ 本测试可能暴露你不愿面对的自己</div>
        </div>

        {/* 4. Footer */}
        <div className={styles.footer}>
          SYSTEM v2.1.7 | NEURAL_SCAN_PROTOCOL
        </div>
      </div>

      {/* CDKEY Modal */}
      <AnimatePresence>
        {showCodeModal && (
          <CodeInputModal
            isOpen={showCodeModal}
            onClose={() => setShowCodeModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
