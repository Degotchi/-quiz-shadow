import OpenAI from 'openai';

const client = new OpenAI({
    baseURL: "http://127.0.0.1:8045/v1",
    apiKey: "sk-f3dd5285df3f42f9bdbdd0d436d11c4a"
});

// 模拟用户数据：沉默的审判者
const testData = {
    shadowSyncRate: 87.3,
    primaryArchetype: {
        nameCN: '沉默的审判者',
        nameEN: 'The Silent Judge'
    },
    normalizedScores: {
        control: 88,
        aggression: 45,
        envy: 38,
        masking: 62,
        destruction: 35,
        detachment: 85
    },
    answers: {
        1: 'B', 2: 'A', 3: 'C', 4: 'D', 5: 'C', 6: 'A', 7: 'A', 8: 'C', 9: 'B'
    }
};

// 分析答题模式
function analyzeAnswerPatterns(answers) {
    const patterns = [];
    const choices = Object.values(answers);
    const distribution = {
        A: choices.filter(c => c === 'A').length,
        B: choices.filter(c => c === 'B').length,
        C: choices.filter(c => c === 'C').length,
        D: choices.filter(c => c === 'D').length,
    };

    if (distribution.A > 3) patterns.push("频繁选择控制型/伪装型答案");
    if (distribution.C > 3) patterns.push("倾向于情感隔离和抽离策略");
    if (distribution.D > 3) patterns.push("选择超然旁观的应对方式");

    return patterns.join('\n· ') || "答题模式较为均衡";
}

// 构建提示词
function buildPrompt(data) {
    const { primaryArchetype, normalizedScores, shadowSyncRate, answers } = data;
    const patterns = analyzeAnswerPatterns(answers);

    return `你是一个心理分析AI，现在需要为一个刚完成"暗影自我协议"测试的用户生成一段"阴影日记"。

## 用户数据
- 阴影同步率: ${shadowSyncRate}%
- 主要原型: ${primaryArchetype.nameCN} (${primaryArchetype.nameEN})
- 六维度分数:
  · 控制欲: ${normalizedScores.control}
  · 攻击性: ${normalizedScores.aggression}
  · 嫉妒值: ${normalizedScores.envy}
  · 伪装度: ${normalizedScores.masking}
  · 破坏冲动: ${normalizedScores.destruction}
  · 情感隔离: ${normalizedScores.detachment}

## 答题模式特征
${patterns}

## 任务要求
以"你的阴影人格"的视角，写一段200字左右的内心独白。要求：

1. **第二人称视角**："你以为你在...其实你..."
2. **直击核心**：基于用户的答题模式，揭示其最不愿承认的心理动机
3. **冷静而锋利**：不需要安慰，只需要真相
4. **文学化表达**：避免心理学术语，用隐喻和意象
5. **精确字数**：严格控制在180-220字

## 风格参考
- "你用理性包装恐惧，用沉默惩罚亲密，用完美主义逃避失败。你以为你在掌控局面，其实你在囚禁自己。"
- "你的善良是一种精心设计的投资。你帮助别人不是因为慈悲，是因为你需要确认自己的价值。一旦回报不如预期，你的愤怒会比任何人都深。"

请直接输出日记内容，不要任何前缀或解释。`;
}

// 测试AI生成
async function testShadowDiary() {
    console.log('='.repeat(60));
    console.log('测试用户原型：沉默的审判者 (The Silent Judge)');
    console.log('阴影同步率：87.3%');
    console.log('='.repeat(60));
    console.log('\n正在调用AI生成阴影日记...\n');

    const prompt = buildPrompt(testData);

    try {
        const response = await client.chat.completions.create({
            model: "gemini-3-flash",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.9,
            max_tokens: 300,
        });

        const diary = response.choices[0].message.content;

        console.log('━'.repeat(60));
        console.log('【阴影日记 · Shadow Diary】');
        console.log('━'.repeat(60));
        console.log(diary);
        console.log('━'.repeat(60));
        console.log(`\n字数：${diary.length} 字`);
        console.log('\n✅ 生成成功！');

    } catch (error) {
        console.error('❌ 生成失败:', error.message);
    }
}

testShadowDiary();
