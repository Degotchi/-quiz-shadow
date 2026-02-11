#!/usr/bin/env python3
"""
将PNG图像批量转换为WebP格式
大幅减小文件大小，提升网页加载性能
"""

import os
from PIL import Image
import glob

# 输入输出目录
INPUT_DIR = "./src/assets/archetypes"
OUTPUT_DIR = "./src/assets/archetypes"

def convert_png_to_webp(png_path, quality=85):
    """
    将PNG转换为WebP格式

    Args:
        png_path: PNG文件路径
        quality: WebP质量 (0-100)，默认85可以保持高质量同时大幅压缩
    """
    try:
        # 打开PNG图像
        img = Image.open(png_path)

        # 生成WebP文件路径
        webp_path = png_path.replace('.png', '.webp')

        # 转换为WebP
        img.save(webp_path, 'webp', quality=quality, method=6)

        # 获取文件大小
        png_size = os.path.getsize(png_path) / 1024  # KB
        webp_size = os.path.getsize(webp_path) / 1024  # KB
        reduction = (1 - webp_size / png_size) * 100  # 压缩率

        print(f"✅ {os.path.basename(png_path)}")
        print(f"   PNG:  {png_size:6.1f} KB")
        print(f"   WebP: {webp_size:6.1f} KB")
        print(f"   减小: {reduction:5.1f}%\n")

        return webp_size, png_size

    except Exception as e:
        print(f"❌ 转换失败: {png_path}")
        print(f"   错误: {str(e)}\n")
        return 0, 0

def main():
    print("=" * 60)
    print("PNG → WebP 批量转换器")
    print("=" * 60)

    # 查找所有PNG文件
    png_files = glob.glob(os.path.join(INPUT_DIR, "*.png"))

    if not png_files:
        print("❌ 未找到PNG文件")
        return

    print(f"\n找到 {len(png_files)} 个PNG文件\n")
    print("开始转换...\n")

    total_webp_size = 0
    total_png_size = 0
    success_count = 0

    for png_file in sorted(png_files):
        webp_size, png_size = convert_png_to_webp(png_file, quality=85)
        if webp_size > 0:
            success_count += 1
            total_webp_size += webp_size
            total_png_size += png_size

    # 总结报告
    print("=" * 60)
    print("转换完成!")
    print("=" * 60)
    print(f"成功转换: {success_count}/{len(png_files)}")
    print(f"\nPNG总大小:  {total_png_size:8.1f} KB ({total_png_size/1024:.2f} MB)")
    print(f"WebP总大小: {total_webp_size:8.1f} KB ({total_webp_size/1024:.2f} MB)")
    print(f"总共减小:   {(1 - total_webp_size/total_png_size)*100:.1f}%")
    print(f"\n节省空间:   {(total_png_size - total_webp_size)/1024:.2f} MB")
    print(f"\n输出目录:   {OUTPUT_DIR}")
    print("\n提示: 原PNG文件保留作为降级方案")

if __name__ == "__main__":
    main()
