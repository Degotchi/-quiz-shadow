#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import google.generativeai as genai

# 配置 Antigravity 代理
genai.configure(
    api_key="sk-f3dd5285df3f42f9bdbdd0d436d11c4a",
    transport='rest',
    client_options={'api_endpoint': 'http://127.0.0.1:8045'}
)

# 模拟用户数据：沉默的审判者
test_data = {
    'shadowSyncRate': 87.3,
    'primaryArchetype': {
        'nameCN': '沉默的审判者',
        'nameEN': 'The Silent Judge'
    },
    'normalizedScores': {
        'control': 88,
        'aggression': 45,
        'envy': 38,
        'masking': 62,
        'destruction': 35,
        'detachment': 85
    },
    'answers': {
        1: 'B', 2: 'A', 3: 'C', 4: 'D', 5: 'C', 6: 'A', 7: 'A', 8: 'C', 9: 'B'
    }
}

# 分析答题模式
def analyze_answer_patterns(answers):
    patterns = []
    choices = list(answers.values())
    distribution = {
        'A': choices.count('A'),
        'B': choices.count('B'),
        'C': choices.count('C'),
        'D': choices.count('D'),
    }

    if distribution['A'] > 3:
        patterns.append("频繁选择控制型/伪装型答案")
    if distribution['C'] > 3:
        patterns.append("倾向于情感隔离和抽离策略")
    if distribution['D'] > 3:
        patterns.append("选择超然旁观的应对方式")

    return '\n· '.join(patterns) if patterns else "答题模式较为均衡"

# 构建提示词
def build_prompt(data):
    archetype = data['primaryArchetype']
    scores = data['normalizedScores']
    patterns = analyze_answer_patterns(data['answers'])

    return f"""你是一个心理分析AI，现在需要为一个刚完成"暗影自我协议"测试的用户生成一段"阴影日记"。

## 用户数据
- 阴影同步率: {data['shadowSyncRate']}%
- 主要原型: {archetype['nameCN']} ({archetype['nameEN']})
- 六维度分数:
  · 控制欲: {scores['control']}
  · 攻击性: {scores['aggression']}
  · 嫉妒值: {scores['envy']}
  · 伪装度: {scores['masking']}
  · 破坏冲动: {scores['destruction']}
  · 情感隔离: {scores['detachment']}

## 答题模式特征
{patterns}

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

请直接输出日记内容，不要任何前缀或解释。"""

# 测试生成
def test_shadow_diary():
    print('=' * 60)
    print('测试用户原型：沉默的审判者 (The Silent Judge)')
    print('阴影同步率：87.3%')
    print('=' * 60)
    print('\n正在调用AI生成阴影日记...\n')

    prompt = build_prompt(test_data)

    try:
        model = genai.GenerativeModel('gemini-3-flash')
        response = model.generate_content(prompt)

        diary = response.text

        print('━' * 60)
        print('【阴影日记 · Shadow Diary】')
        print('━' * 60)
        print(diary)
        print('━' * 60)
        print(f'\n字数：{len(diary)} 字')
        print('\n✅ 生成成功！')

    except Exception as e:
        print(f'❌ 生成失败: {e}')

if __name__ == '__main__':
    test_shadow_diary()
