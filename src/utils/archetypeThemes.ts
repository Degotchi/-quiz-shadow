/**
 * 原型主题色配置
 * 为12个原型预定义霓虹色配色方案
 */

export const ARCHETYPE_THEMES: Record<string, {
    primary: string;
    secondary: string;
    glow: string;
}> = {
    'silent-judge': {
        primary: '#8B5CF6',      // 冷紫蓝
        secondary: '#3B82F6',
        glow: '#60A5FA'
    },
    'smiling-arsonist': {
        primary: '#EC4899',      // 炽热洋红橙
        secondary: '#F97316',
        glow: '#FB923C'
    },
    'patient-puppeteer': {
        primary: '#8B5CF6',      // 深紫罗兰
        secondary: '#A855F7',
        glow: '#C084FC'
    },
    'cold-spectator': {
        primary: '#06B6D4',      // 冰冷青色
        secondary: '#0EA5E9',
        glow: '#38BDF8'
    },
    'flawless-counterfeit': {
        primary: '#10B981',      // 翡翠绿
        secondary: '#059669',
        glow: '#34D399'
    },
    'gentle-executioner': {
        primary: '#DC2626',      // 血红
        secondary: '#B91C1C',
        glow: '#EF4444'
    },
    'mirror-gazer': {
        primary: '#7C3AED',      // 神秘紫
        secondary: '#6D28D9',
        glow: '#A78BFA'
    },
    'beautiful-martyr': {
        primary: '#F59E0B',      // 金色
        secondary: '#D97706',
        glow: '#FBBF24'
    },
    'undercurrent': {
        primary: '#0891B2',      // 深海蓝
        secondary: '#0E7490',
        glow: '#22D3EE'
    },
    'island-keeper': {
        primary: '#84CC16',      // 青草绿
        secondary: '#65A30D',
        glow: '#A3E635'
    },
    'sweet-avenger': {
        primary: '#F43F5E',      // 玫瑰红
        secondary: '#E11D48',
        glow: '#FB7185'
    },
    'cracked-perfectionist': {
        primary: '#6366F1',      // 靛蓝
        secondary: '#4F46E5',
        glow: '#818CF8'
    }
};

/**
 * 获取原型主题色
 * @param archetypeId 原型ID
 * @returns 主题色配置对象
 */
export function getArchetypeTheme(archetypeId: string) {
    return ARCHETYPE_THEMES[archetypeId] || ARCHETYPE_THEMES['silent-judge'];
}
