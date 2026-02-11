/**
 * Gemini API 调用工具（通过后端代理）
 * 用于生成个性化的阴影原型AI解读
 */

// 后端API地址
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL ||
    (import.meta.env.DEV ? 'http://localhost:3001' : '');

interface ArchetypeData {
  nameCN: string;
  nameEN: string;
  mask: string;
  shadow: string;
  trigger: string;
  temptation: string;
  curse: string;
}

interface ScoreData {
  control: number;
  aggression: number;
  envy: number;
  masking: number;
  destruction: number;
  detachment: number;
}

/**
 * 调用后端API生成个性化阴影解读
 *
 * @param archetype - 原型数据
 * @param scores - 六维分数
 * @param timeout - 超时时间（毫秒），默认10000ms
 * @returns Promise<string> - AI生成的解读文本，失败返回null
 */
export async function generateAIShadowReading(
  archetype: ArchetypeData,
  scores: ScoreData,
  timeout: number = 10000
): Promise<string | null> {

  try {
    // 创建超时Promise
    const timeoutPromise = new Promise<null>((_, reject) => {
      setTimeout(() => reject(new Error('API call timeout')), timeout);
    });

    // 创建API调用Promise
    const apiPromise = fetch(`${BACKEND_API_URL}/api/generate-shadow-reading`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        archetype,
        scores
      })
    });

    // 使用Promise.race实现超时控制
    const response = await Promise.race([apiPromise, timeoutPromise]) as Response;

    if (!response || !response.ok) {
      console.warn('Backend API request failed:', response?.status);
      return null;
    }

    const data = await response.json();

    // 如果后端返回useFallback标志，触发降级
    if (data.useFallback) {
      console.warn('Backend API returned fallback flag');
      return null;
    }

    return data.text || null;

  } catch (error) {
    // 超时或其他错误，返回null触发降级
    console.warn('Failed to generate AI reading:', error);
    return null;
  }
}

/**
 * 带重试的AI解读生成（可选使用）
 */
export async function generateAIReadingWithRetry(
  archetype: ArchetypeData,
  scores: ScoreData,
  maxRetries: number = 1,
  timeout: number = 10000
): Promise<string | null> {
  for (let i = 0; i <= maxRetries; i++) {
    const result = await generateAIShadowReading(archetype, scores, timeout);
    if (result) return result;

    // 如果不是最后一次重试，等待1秒后重试
    if (i < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return null;
}
