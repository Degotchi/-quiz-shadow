import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CodeInputModal.module.css';

interface CodeInputModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_URL = 'http://localhost:3001/api/verify-cdkey';

// Format: xxxx-xxxx-xxxx-xxxx
const formatCDKey = (value: string): string => {
  const alphanumeric = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const groups = alphanumeric.match(/.{1,4}/g) || [];
  return groups.slice(0, 4).join('-');
};

export default function CodeInputModal({ isOpen, onClose }: CodeInputModalProps) {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setInputValue('');
      setError('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCDKey(e.target.value);
    setInputValue(formatted);
    setError('');
  }, []);

  const handleVerify = useCallback(async () => {
    if (isLoading) return;

    const cleanCode = inputValue.replace(/-/g, '');
    if (cleanCode.length !== 16) {
      setError('CDKEY格式错误，需16位字符');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cdkey: inputValue }),
      });

      const data = await response.json();

      if (data.valid) {
        // Success: close modal and navigate
        onClose();
        navigate('/quiz');
      } else {
        setError(data.message || 'CDKEY无效');
      }
    } catch {
      setError('验证失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, navigate, onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  }, [handleVerify]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glitch border effect */}
            <div className={styles.glitchBorder}>
              <div className={styles.glitchCornerTL} />
              <div className={styles.glitchCornerTR} />
              <div className={styles.glitchCornerBL} />
              <div className={styles.glitchCornerBR} />
            </div>

            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerGlow} data-text="> 身份验证">
                <span className={styles.headerText}>{'>'} 身份验证</span>
              </div>
              <div className={styles.subHeader}>SHADOW_PROTOCOL_ACCESS</div>
            </div>

            {/* Input Area */}
            <div className={styles.inputArea}>
              <label className={styles.label}>输入访问码</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  className={styles.input}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  maxLength={19}
                  autoFocus
                  disabled={isLoading}
                />
                <div className={styles.inputScanline} />
              </div>
              <div className={styles.hint}>格式: 4组4位字符 (A-Z, 0-9)</div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className={styles.error}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <span className={styles.errorIcon}>!</span>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons */}
            <div className={styles.buttons}>
              <button
                className={styles.cancelButton}
                onClick={onClose}
                disabled={isLoading}
              >
                取消
              </button>
              <button
                className={styles.verifyButton}
                onClick={handleVerify}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className={styles.loadingDots}>
                    <span>.</span><span>.</span><span>.</span>
                  </span>
                ) : (
                  '验证'
                )}
              </button>
            </div>

            {/* Footer */}
            <div className={styles.footer}>
              <span className={styles.footerDot} />
              <span className={styles.footerText}>SECURE_CONNECTION</span>
              <span className={styles.footerDot} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
