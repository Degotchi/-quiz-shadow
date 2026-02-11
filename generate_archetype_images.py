#!/usr/bin/env python3
"""
阴影原型图像生成器 - 霓虹线条艺术塔罗牌风格
"""

import base64
import os
import re
import time

from openai import OpenAI

# API配置
client = OpenAI(base_url="http://127.0.0.1:8045/v1", api_key="")

# 输出目录
OUTPUT_DIR = "./src/assets/archetypes"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 统一视觉风格定义
UNIFIED_STYLE = """
Art Style: Glowing neon line art tarot card, digital occult wireframe illustration
Visual Treatment: Abstract geometric line drawing with glowing outlines on pure black background
Character Design: Gender-neutral abstract silhouette, symbolic representation, NO facial features, NO gender markers
Line Work: Thin to medium glowing neon lines, varied line weights for depth, wireframe and solid line mix
Background: Pure black (#000000) with subtle atmospheric glow effects
Lighting: Neon glow effect on all lines, holographic shimmer, cyberpunk mystical aesthetic
Composition: Centered symmetrical or dynamic asymmetrical, iconic symbolic gestures, ritualistic poses
Mood: Mystical, technological, abstract, enigmatic, psychological depth
Technical: Vector-style illustration, glowing outlines, minimal solid fills, NO TEXT, NO WORDS embedded in image
Color Variation: Use different neon color schemes per character - purple, magenta, cyan, blue, crimson, emerald green
"""

# 12个原型定义（整合用户提供的具体视觉描述）
ARCHETYPES = [
    {
        "id": "silent-judge",
        "name_cn": "沉默的审判者",
        "name_en": "The Silent Judge",
        "color_scheme": "Cold purple and blue neon (#8B5CF6, #3B82F6)",
        "visual_prompt": """
A closed-eyes gender-neutral silhouette head in profile, rendered in glowing purple wireframe lines.
Above the head floats a massive judgment sword composed of straight geometric neon lines.
Background filled with vertical barcode-like gravity lines creating oppressive atmosphere.
Symmetrical rigid composition, minimalist but powerful.
NO TEXT - Pure symbolic line art on pure black background.
        """,
    },
    {
        "id": "smiling-arsonist",
        "name_cn": "微笑的纵火犯",
        "name_en": "The Smiling Arsonist",
        "color_scheme": "Hot magenta and orange neon (#EC4899, #F97316)",
        "visual_prompt": """
Center: A glowing theatrical mask with dual expressions, rendered in bright magenta wireframe.
Below mask: Two hands holding geometric cubic flames made of neon outlines.
Fire sparks represented as scattered chaotic pixel points floating around.
Asymmetrical dynamic energy, warm neon glow.
NO TEXT - Pure symbolic line art on pure black background.
        """,
    },
    {
        "id": "patient-puppeteer",
        "name_cn": "隐忍的操控者",
        "name_en": "The Patient Puppeteer",
        "color_scheme": "Deep purple and violet neon (#8B5CF6, #A855F7)",
        "visual_prompt": """
Top: A giant glowing hand with fingers extended, rendered in purple wireframe.
From fingertips hang countless thin purple light threads descending downward.
Bottom: Multiple small wireframe puppet figures being controlled by the threads.
Symmetrical top-down control composition, intricate thread network.
NO TEXT - Pure symbolic line art on pure black background.
        """,
    },
    {
        "id": "cold-spectator",
        "name_cn": "冷漠的旁观者",
        "name_en": "The Cold Spectator",
        "color_scheme": "Ice blue and cyan neon (#06B6D4, #3B82F6)",
        "visual_prompt": """
A gender-neutral silhouette trapped inside a transparent glowing crystal shell.
Crystal exterior covered with sharp angular spikes pointing in all directions.
Cold blue neon glow radiating from the crystalline structure.
Defensive isolation symbolism, frozen in geometric prison.
NO TEXT - Pure symbolic line art on pure black background.
        """,
    },
    {
        "id": "flawless-counterfeit",
        "name_cn": "完美的赝品",
        "name_en": "The Flawless Counterfeit",
        "color_scheme": "Bright magenta and pink neon (#EC4899, #F472B6)",
        "visual_prompt": """
A shattered porcelain mask in center, cracks glowing with intense magenta light from within.
Surrounding the mask float numerous hollow eye frames, reaching toward the light.
Fragmented perfection symbolism, void trying to capture brilliance.
Symmetrical but broken composition.
NO TEXT - Pure symbolic line art on pure black background.
        """,
    },
    {
        "id": "gentle-executioner",
        "name_cn": "温柔的绞刑者",
        "name_en": "The Gentle Executioner",
        "color_scheme": "Rose pink and crimson neon (#F43F5E, #DC2626)",
        "visual_prompt": """
Two hands wearing silk gloves slowly pulling tight a glowing geometric light rope.
At the rope's center blooms a crystalline neon rose with visible sharp thorns.
Gentle violence symbolism, beauty concealing danger.
Symmetrical pulling gesture, elegant but deadly.
NO TEXT - Pure symbolic line art on pure black background.
        """,
    },
    {
        "id": "mirror-gazer",
        "name_cn": "镜中的嫉妒者",
        "name_en": "The Mirror Gazer",
        "color_scheme": "Emerald green and cyan neon (#10B981, #06B6D4)",
        "visual_prompt": """
Gender-neutral figure facing multiple intersecting floating mirror frames.
Each mirror reflects a larger, more distorted, brighter phantom duplicate.
Mirrors arranged in chaotic overlapping geometry.
Envy and comparison symbolism, infinite distorted reflections.
NO TEXT - Pure symbolic line art on pure black background.
        """,
    },
    {
        "id": "beautiful-martyr",
        "name_cn": "自毁的殉道者",
        "name_en": "The Beautiful Martyr",
        "color_scheme": "White gold and blue neon (#F59E0B, #60A5FA)",
        "visual_prompt": """
Gender-neutral figure in falling descent pose, rendered in wireframe.
From chest erupts massive radial geometric light burst pattern.
Body appears to dissolve from inside out, transforming into pure energy beams.
Self-destruction as transcendence symbolism, beautiful dissolution.
NO TEXT - Pure symbolic line art on pure black background.
        """,
    },
    {
        "id": "undercurrent",
        "name_cn": "暗流的野心家",
        "name_en": "The Undercurrent",
        "color_scheme": "Deep blue and purple neon (#1E40AF, #6366F1)",
        "visual_prompt": """
Massive iceberg wireframe structure, mostly submerged below water line.
Above surface: Only small tip visible in simple lines.
Below surface: Dense network of countless vertical vector lines creating oppressive mass.
Hidden ambition symbolism, vast power beneath calm surface.
NO TEXT - Pure symbolic line art on pure black background.
        """,
    },
    {
        "id": "island-keeper",
        "name_cn": "孤岛的守望者",
        "name_en": "The Island Keeper",
        "color_scheme": "Cyan and teal neon (#06B6D4, #14B8A6)",
        "visual_prompt": """
Tiny gender-neutral figure standing on small circular glowing platform.
Surrounded by multiple layers of thick semi-transparent circular force field rings.
Concentric barriers isolating figure from darkness outside.
Voluntary isolation symbolism, self-imposed exile.
NO TEXT - Pure symbolic line art on pure black background.
        """,
    },
    {
        "id": "sweet-avenger",
        "name_cn": "甜蜜的复仇者",
        "name_en": "The Sweet Avenger",
        "color_scheme": "Ruby red and crimson neon (#DC2626, #B91C1C)",
        "visual_prompt": """
A glowing heart constructed from shattered glass fragments.
At heart's center hides a sharp dagger blade.
Below the heart fall glowing droplets like stars or tears.
Sweet revenge symbolism, beauty containing violence.
NO TEXT - Pure symbolic line art on pure black background.
        """,
    },
    {
        "id": "cracked-perfectionist",
        "name_cn": "失控的完美主义者",
        "name_en": "The Cracked Perfectionist",
        "color_scheme": "Gold and electric yellow neon (#F59E0B, #EAB308)",
        "visual_prompt": """
Perfect golden ratio spiral structure rendered in precise geometric neon lines.
At the spiral's endpoint: Violent glitch art-style circuit overload breakdown.
Perfect order dissolving into chaotic fragmentation.
Control loss symbolism, perfection shattering into chaos.
NO TEXT - Pure symbolic line art on pure black background.
        """,
    },
]


def save_image_from_response(image_data, output_path):
    """从API响应保存图像"""
    try:
        # 提取markdown图片链接中的base64数据
        if "![image](data:image/" in image_data:
            match = re.search(r"data:image/[^;]+;base64,([^)]+)", image_data)
            if match:
                base64_data = match.group(1)
                image_bytes = base64.b64decode(base64_data)
                with open(output_path, "wb") as f:
                    f.write(image_bytes)
                return True
        elif image_data.startswith("data:image"):
            base64_data = re.sub("^data:image/.+;base64,", "", image_data)
            image_bytes = base64.b64decode(base64_data)
            with open(output_path, "wb") as f:
                f.write(image_bytes)
            return True
        elif image_data.startswith("http"):
            import requests

            img_response = requests.get(image_data)
            with open(output_path, "wb") as f:
                f.write(img_response.content)
            return True
        return False
    except Exception as e:
        print(f"保存失败: {str(e)}")
        return False


def generate_image(archetype):
    """生成单个原型图像"""

    full_prompt = f"""
{UNIFIED_STYLE}

CHARACTER: {archetype["name_en"]} ({archetype["name_cn"]})
COLOR SCHEME: {archetype["color_scheme"]}

VISUAL DESCRIPTION:
{archetype["visual_prompt"]}

CRITICAL REQUIREMENTS:
- Pure black background (#000000)
- Glowing neon line art style with varied line weights
- NO text, NO words, NO letters embedded in the image
- NO gender markers, abstract symbolic representation only
- Wide horizontal format (16:9 ratio) for banner display
- Centered composition with atmospheric glow
- Use specified color scheme for this character
"""

    print(f"\n{'=' * 60}")
    print(f"生成: {archetype['name_cn']} ({archetype['name_en']})")
    print(f"配色: {archetype['color_scheme']}")
    print(f"{'=' * 60}")

    try:
        response = client.chat.completions.create(
            model="gemini-3-pro-image",
            extra_body={"size": "1280x720"},
            messages=[{"role": "user", "content": full_prompt}],
        )

        image_data = response.choices[0].message.content
        output_path = os.path.join(OUTPUT_DIR, f"{archetype['id']}.png")

        if save_image_from_response(image_data, output_path):
            file_size = os.path.getsize(output_path) / 1024
            print(f"✅ 已保存: {output_path}")
            print(f"   文件大小: {file_size:.1f} KB")
            return output_path
        else:
            print(f"❌ 保存失败")
            return None

    except Exception as e:
        print(f"❌ 生成失败: {str(e)}")
        return None


def main():
    """主函数"""
    import sys

    count = 2  # 默认生成2个测试
    if len(sys.argv) > 1:
        try:
            count = int(sys.argv[1])
            count = min(count, len(ARCHETYPES))
        except:
            pass

    print("=" * 60)
    print("阴影原型图像生成器 - 霓虹线条艺术塔罗牌")
    print("=" * 60)

    # 测试连接
    print("\n[1/3] 测试API连接...")
    try:
        test_response = client.chat.completions.create(
            model="gemini-3-pro-image",
            extra_body={"size": "1280x720"},
            messages=[{"role": "user", "content": "Test: neon wireframe crystal"}],
        )
        print("✅ API连接成功")
    except Exception as e:
        print(f"❌ API连接失败: {str(e)}")
        return

    # 显示生成计划
    print(f"\n[2/3] 生成计划:")
    print(f"风格: 霓虹线条艺术 + 性别中性 + 无文字嵌入")
    print(f"本次生成: 前 {count} 个原型")
    print(f"输出目录: {OUTPUT_DIR}\n")

    target_archetypes = ARCHETYPES[:count]
    for i, arch in enumerate(target_archetypes, 1):
        print(f"  {i}. {arch['name_cn']:14s} - {arch['color_scheme']}")

    print(f"\n{'=' * 60}")

    # 开始生成
    print(f"\n[3/3] 生成中...")
    success_count = 0

    for i, archetype in enumerate(target_archetypes, 1):
        print(f"\n进度: [{i}/{count}]")
        result = generate_image(archetype)

        if result:
            success_count += 1

        if i < count:
            print("等待3秒...")
            time.sleep(3)

    # 报告
    print(f"\n{'=' * 60}")
    print(f"生成完成!")
    print(f"{'=' * 60}")
    print(f"✅ 成功: {success_count}/{count}")
    print(f"\n输出目录: {OUTPUT_DIR}")

    if success_count == count:
        print(f"\n🎉 测试生成成功! 请检查图像风格")
        print(f"   满意后运行: python3 generate_archetype_images.py 12")
        print(f"   来生成全部12个原型")


if __name__ == "__main__":
    main()
