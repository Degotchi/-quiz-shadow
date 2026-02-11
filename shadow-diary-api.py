#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Shadow Diary API Service
提供阴影日记生成的Flask服务端点
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
# 配置CORS，允许所有来源访问（开发环境）
CORS(app,
     resources={r"/api/*": {"origins": "*"}},
     supports_credentials=False,
     allow_headers=["Content-Type"],
     methods=["GET", "POST", "OPTIONS"]
)

# 配置 Antigravity 代理
genai.configure(
    api_key="sk-f3dd5285df3f42f9bdbdd0d436d11c4a",
    transport='rest',
    client_options={'api_endpoint': 'http://127.0.0.1:8045'}
)

def analyze_answer_patterns(answers):
    """分析答题模式"""
    patterns = []
    choices = list(answers.values())
    distribution = {
        'A': choices.count('A'),
        'B': choices.count('B'),
        'C': choices.count('C'),
        'D': choices.count('D'),
    }

    # 识别极端选择倾向
    if distribution['A'] > 12:
        patterns.append("高频选择控制型/伪装型答案")
    if distribution['B'] > 12:
        patterns.append("倾向于对抗和报复策略")
    if distribution['C'] > 12:
        patterns.append("倾向于情感隔离和抽离策略")
    if distribution['D'] > 12:
        patterns.append("选择超然旁观的应对方式")

    return '\n· '.join(patterns) if patterns else "答题模式较为均衡"

def build_prompt(data):
    """构建AI提示词"""
    archetype = data['primaryArchetype']
    scores = data['normalizedScores']
    sync_rate = data['shadowSyncRate']
    patterns = analyze_answer_patterns(data.get('answers', {}))

    return f"""你是一个心理分析AI，现在需要为一个刚完成"暗影自我协议"测试的用户生成一段"阴影日记"。

## 用户数据
- 阴影同步率: {sync_rate}%
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

@app.route('/api/generate-diary', methods=['POST', 'OPTIONS'])
def generate_diary():
    """生成阴影日记的API端点"""
    # 处理OPTIONS预检请求
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response

    try:
        data = request.json

        # 验证必需字段
        required_fields = ['primaryArchetype', 'normalizedScores', 'shadowSyncRate']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # 构建提示词
        prompt = build_prompt(data)

        # 调用AI生成
        model = genai.GenerativeModel('gemini-3-flash')
        response = model.generate_content(prompt)
        diary = response.text

        return jsonify({
            'success': True,
            'diary': diary,
            'length': len(diary)
        })

    except Exception as e:
        print(f'Error generating diary: {e}')
        return jsonify({
            'success': False,
            'error': str(e),
            'diary': ''  # 返回空字符串，前端可以优雅降级
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查端点"""
    return jsonify({'status': 'ok', 'service': 'shadow-diary-api'})

if __name__ == '__main__':
    print('=' * 60)
    print('🌓 Shadow Diary API Server')
    print('=' * 60)
    print('Server running on: http://localhost:5001')
    print('API endpoint: POST http://localhost:5001/api/generate-diary')
    print('Health check: GET http://localhost:5001/api/health')
    print('=' * 60)
    app.run(host='0.0.0.0', port=5001, debug=True)
