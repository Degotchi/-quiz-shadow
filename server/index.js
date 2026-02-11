/**
 * Shadow Protocol Backend API
 * 提供 Gemini AI 代理服务
 */

import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = process.env.PORT || 3001;

// Gemini API Key（从环境变量读取，生产环境必须配置）
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCy3HL6SOtsJ4I5fRAe-fROyAPthI6RCzE';

// 初始化 Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// 配置 CORS
app.use(cors());
app.use(express.json());

// 健康检查端点
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: Date.now(),
        service: 'Shadow Protocol Backend'
    });
});

// AI 解读生成端点
app.post('/api/generate-shadow-reading', async (req, res) => {
    try {
        const { archetype, scores } = req.body;

        // 验证请求参数
        if (!archetype || !scores) {
            return res.status(400).json({
                error: 'Missing required parameters',
                useFallback: true
            });
        }

        // 构建提示词
        const prompt = `你是一位专业的心理分析师，擅长荣格心理学中的"阴影自我"理论。现在需要你为一位测试者生成深度的阴影人格解读。

【测试者的阴影原型】
中文名称：${archetype.nameCN}
英文名称：${archetype.nameEN}

【原型特征】
面具（社交表象）：${archetype.mask}
阴影（隐藏人格）：${archetype.shadow}
触发条件：${archetype.trigger}
阴影的诱惑：${archetype.temptation}
阴影的诅咒：${archetype.curse}

【六维心理特征分数】（0-100分）
控制欲：${scores.control}
攻击性：${scores.aggression}
嫉妒值：${scores.envy}
伪装度：${scores.masking}
破坏冲动：${scores.destruction}
情感隔离：${scores.detachment}

【任务要求】
请生成一段250-350字的深度心理分析，要求：

1. **语言风格**：
   - 使用第二人称"你"，直接对话式
   - 语气犀利但不失共情，像一位看透一切的老友
   - 避免学术术语，用生活化的语言

2. **内容结构**（分3段）：
   - 第1段：揭示阴影的运作机制（为什么你会这样）
   - 第2段：指出阴影的代价和困境（你因此付出了什么）
   - 第3段：给出出路和成长方向（如何与阴影和解）

3. **写作要点**：
   - 结合具体的六维分数，给出个性化分析
   - 避免空洞的鸡汤，要有洞察力和穿透力
   - 不要使用"但是"开头，使用更自然的转折
   - 每段100-120字，总计250-350字

4. **禁止事项**：
   - 不要使用markdown格式（如**加粗**）
   - 不要使用项目符号或数字列表
   - 不要出现"总之"、"综上所述"等总结词
   - 不要重复原型特征的原话

请直接输出解读文本，不要任何前缀或解释。`;

        // 调用 Gemini API（8秒超时）
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const result = await Promise.race([
            model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.9,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('API timeout')), 8000)
            )
        ]);

        const text = result.response.text();

        // 清理文本
        const cleanedText = text
            .replace(/\*\*/g, '')
            .replace(/#{1,6}\s/g, '')
            .trim();

        res.json({ text: cleanedText });

        console.log(`✅ AI reading generated for ${archetype.nameCN}`);

    } catch (error) {
        console.error('❌ AI generation error:', error.message);
        res.status(500).json({
            error: 'AI generation failed',
            useFallback: true
        });
    }
});

// 404 处理
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// 启动服务
app.listen(PORT, () => {
    console.log(`🚀 Shadow Protocol Backend running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});
